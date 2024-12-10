import { 
    CommandInteraction,
	CommandInteractionOptionResolver,
    Message,
	SlashCommandBuilder,
    TextBasedChannel,
} from 'discord.js';
import { Command } from '../../classes/command';
import { stones, bot } from '../../index'
import { poker, game } from '../../configs/poker';
import { config } from '../../configs/gen_config'
import { format } from '../../interfaces/mongo-format'; 
import { able } from '../../function/permission';
import { shuffle } from '../../function/rand';
import { logger } from '../../logger';
import { WithId } from 'mongodb';
import { gacha } from '../../configs/gacha';
type CIOR = CommandInteractionOptionResolver;

class Shoot extends Command{
	//get
  	get name(){return `shoot`;}
  	get description(){
    	return `ヒナ～レッドドッグをやりましょう`;
  	}
  	get catagory(){return `game`;}
  	get dataname(){return `shootdragon`;}
	override build(): 
	SlashCommandBuilder | 
	Omit<SlashCommandBuilder,`addSubcommand` | `addSubcommandGroup`>{
		return new SlashCommandBuilder()
		  	.setName(this.name)
		  	.setDescription(this.description)
		  	.addIntegerOption(option =>
				option.setName('石をどれくらいベットにするの')
				  .setDescription(`stones you want to bet, 1 ~ ${game.play_max}, default: ${game.play_crit}`)
				  .setMinValue(1)
				  .setMaxValue(game.play_max)
			)
	}
  	async execute(interaction: CommandInteraction): Promise<void>{
    	try{
      		//init
      		const guild = await bot.guilds.fetch(config.guildId);
      		if(guild === null || guild.id !== config.guildId)
        		throw `null guild in shoot.ts`;
      		const channel = await guild.channels
        		.fetch(gacha.channel) as TextBasedChannel;
      		if(channel == null || channel.id !== gacha.channel)
        		throw `null channel in shoot.ts`;
      		const id = interaction.user.id;
      		const sticker = game.stone;
      		const fee = game.play_crit;
			const bet = (interaction.options as CIOR).getInteger('石をどれくらいベットにするの') ?? fee;
      		//able
      		let check =await able(
        		interaction, 
        		`先生、遊びたいならここへ ${channel.url}`, 
        		channel
      		);
      		if(!check) return;
			//check stone
      		const find = await stones.findOne({userid: id});
      		let stone = 0;
      		if(find) stone = find.value;
      		else{
        		await stones.updateOne(
            		{userid: id},
            		{
                		$set: {
                		    value: 100
                		}
            		},
            		{upsert: true}
        		);
        		stone = 100;
      		}
      		if(stone < bet){
        		await interaction.reply(
					`${sticker}を${bet}個ベットにしたいとみえるけど、` +
					`${stone}個しかないよ`
        		);
        		return;
      		}
      		bot.channel_used.set(interaction.channelId, true);
      		await interaction.reply(`${sticker} -${bet}`);
      		await stones.updateOne(
        		{userid: id},
        		{
            		$inc:{
                		value: -bet,
            		}
        		},
        		{upsert: true}
      		);
      		await interaction.editReply(`(シャフル中...)`)
      		stone = (await stones.findOne({userid: id}) as WithId<format>).value;
      		const deck = await shuffle();
      		let left = deck[0];
      		let right = deck[1];
      		if((left + 11) % 13 > (right + 11) % 13){
          		const temp = left;
          		left = right;
          		right = temp;
      		}
      		let str = `手札は: ${poker.get(left)}     ${poker.get(right)}\n`;
			//continuous quit
      		if(((right + 11) % 13) - ((left + 11) % 13) === 1){
        		await interaction.editReply(
            		`${str}残念、まだ来て\n` +
            		`残る${sticker}: ${stone}`
        		);
        		bot.channel_used.delete(interaction.channelId);
        		return;
      		}
			//qa
      		const rp = await interaction.editReply(
        		str + `ベットする？(y/n)`
      		)
      		const filt = (m:Message) => 
			(m.author.id === interaction.user.id && (
        		m.content === 'y' || 
        		m.content === 'n' ||
        		m.content === 'Y' || 
        		m.content === 'N'  
        	));
      		const ncollector = await channel.awaitMessages(
        		{ 
        		    filter: filt, 
        		    time: 5000, 
            		max: 1
        		}
      		);
      		const msg = ncollector.first();
			//qa dealing
      		if(ncollector.size > 0 && msg !== undefined)
				await msg.reply(`いいよ、わかった`);
      		else{
        		await rp.reply(
            		`ん？まあ、まだ来て\n` + 
            		`残る${sticker}: ${stone}`
        		);
        		bot.channel_used.delete(interaction.channelId);
        		return;
      		}
			//n quit
      		if(msg.content.toLowerCase() === 'n'){
        		await rp.reply(
            		`うん、まだ来て\n` + 
            		`残る${sticker}: ${stone}`
        		);
        		bot.channel_used.delete(interaction.channelId);
        		return;
      		}
			//same
      		if((left + 11) % 13 === (right + 11) % 13){
				//qa
        		await channel.send(`高いか？低いか？(h/l)`);
        		const fil = (m:Message) => 
				(m.author.id === interaction.user.id && (
        		    m.content === 'h' || 
        		    m.content === 'l' ||
        		    m.content === 'H' || 
        		    m.content === 'L'  
        		));
        		const hcollector = await channel.awaitMessages({ filter: fil, time: 5000, max: 1});
        		const m = hcollector.first();
        		if(hcollector.size > 0 && m !== undefined)
					await m.reply(`いいよ、わかった`);
        		else{
        		    await msg.reply(
        		        `ん？まあ、まだ来て\n` +
                		`残る${sticker}: ${stone}`
           			);
            		bot.channel_used.delete(interaction.channelId);
            		return;
        		}
        		const third = await channel.send(`引いたカードは${poker.get(deck[2])}`);
        		let win = -1;
        		if(
					m.content.toLowerCase() === `h` && 
            		(deck[2] + 11) % 13 > (left + 11) % 13
        		)win = 2;
        		else if(
					m.content.toLowerCase() === `l` && 
            		(deck[2] + 11) % 13 < (left + 11) % 13 
        		)win = 2;
        		else if((deck[2] + 11) % 13 === (left + 11) % 13)win = -3;
        		await stones.updateOne(
            		{userid: id},
            		{
                		$inc:{
                		    value: bet * win
                		}
            		},
            		{upsert: true}
        		);
        		stone = (await stones.findOne({userid: id}) as WithId<format>).value;
        		if(win === 2){
            		await third.reply(
                		`おめでとう先生\n` +
                		`${sticker} +${bet}\n` + 
                		`残る${sticker}: ${stone}`
            		);
            		bot.channel_used.delete(interaction.channelId);
            		return;
        		}
        		if(win === -1){
            		await third.reply(
                		`残念、まだ来て\n` +
                		`残る${sticker}: ${stone}`
            		);
            		bot.channel_used.delete(interaction.channelId);
            		return;
        		}
        		if(win === -3){
            		await third.reply(
                		`運が悪かった\n` +
                		`${sticker} -${bet * 2}\n` +
                		`残る${sticker}: ${stone}`
            		);
            		bot.channel_used.delete(interaction.channelId);
            		return;
        		}
      		}
			//not same
      		const third = await channel.send(`引いたカードは${poker.get(deck[2])}`);
      		let win = -1;
      		if(
				(deck[2] + 11) % 13 > (left + 11) % 13 &&
      			(deck[2] + 11) % 13 < (right + 11) % 13
			)win = 2;
      		else if(
				(deck[2] + 11) % 13 === (left + 11) % 13 || 
        		deck[2] === (right + 11) % 13
      		)win = -2;
      		await stones.updateOne(
        		{userid: id},
        		{
            		$inc: {
            		    value: bet * win
            		}
        		},
        		{upsert: true}
      		);
      		stone = (await stones.findOne({userid: id}) as WithId<format>).value;
      		if(win === 2){
        		await third.reply(
            		`おめでとう先生\n` +
            		`${sticker} +${bet * 2}\n` +
            		`残る${sticker}: ${stone}`
        		);
      		}
      		else if(win === -1){
        		await third.reply(
            		`残念、まだ来て\n` +
            		`残る${sticker}: ${stone}`
        		);
      		}
      		else{
        		await third.reply(
            		`運が悪かった\n` +
            		`${sticker} -${bet}\n` +
            		`残る${sticker}: ${stone}`
        		)
      		}
      		bot.channel_used.delete(interaction.channelId);
    	}catch(err: unknown){
      		logger.error(`${err}`);
      		if(interaction.replied)await interaction.editReply(`${err}`);
      		else await interaction.reply(`${err}`);
      		bot.channel_used.delete(interaction.channelId);
      		return;
    	}
  	}
};

export const command = new Shoot();

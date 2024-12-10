import { 
    CommandInteraction, 
    TextBasedChannel,
} from 'discord.js';
import { Command } from '../../classes/command';
import { mission, stones, mission_cd, bot } from '../../index'
import { config } from '../../configs/gen_config'
import { game } from '../../configs/poker';
import { constant } from '../../configs/constants';
import { gacha } from '../../configs/gacha';
import { able } from '../../function/permission';
import { sinrand } from '../../function/rand';
import { logger } from '../../logger';

class Work extends Command{
	//get
  	get name(){return `work`;}
  	get description(){
    	return `ヒナ、この辺の探索を任せるよ`;
  	}
  	get catagory(){return `game`;}
  	get dataname(){return `work`;}
  	async execute(interaction: CommandInteraction): Promise<void>{
    	try{
			//init
      		const guild = await bot.guilds.fetch(config.guildId);
      		if(guild === null || guild.id !== config.guildId)
        		throw `null guild`;
      		const channel = await guild.channels
        		.fetch(gacha.channel) as TextBasedChannel;
      		if(channel == null || channel.id !== gacha.channel)
        		throw `null channel`;
			//able
      		let check =await able(
        		interaction, 
        		`先生、遊びたいならここへ ${channel.url}`, 
        		channel, 
        		mission_cd,
        		constant.day / 2,
        		`探索はまだ途中です、\n`
      		);
      		if(!check) return;
      		const id = interaction.user.id;
      		const search = await mission.findOne({userid: id});
			//if no mission completed
      		if(!search || search.value === 0){
        		await mission.updateOne(
            		{userid: id},
            		{
                		$set:{
                		    value: 1
                		}
           		 	},
            		{upsert: true}
        		);
        		await interaction.reply(`うん、任せて`);
        		return;
      		}
      		const rand = await sinrand(99);
      		await mission.updateOne(
        		{userid: id},
        		{
            		$set:{
                		value: 0
            		}
        		},
        		{upsert: true}
      		);
      		await mission_cd.deleteOne({userid: id});
      		let str: string = '', amnt = 0;
      		if(rand < 5){
        		amnt = 0;
        		str = `全く...どこで間違えたのか...\n`;
      		}
      		else if(rand < 20){
        		amnt = 2;
        		str = `私らしくないミスを...ごめん先生...\n`;
      		}
      		else if(rand < 80){
        		amnt = 4;
        		str = `ミッション完了、報告は後で渡す\n`;
      		}
      		else{
				amnt = 6;
        		str = `大成功だったよ先生\n`;
      		}
        	await stones.updateOne(
            	{userid: id},
            	{
                	$inc:{
                    	value: game.play_crit * amnt,
                	}
            	},
            	{upsert: true}
        	);
      		const find = await stones.findOne({userid: id});
      		let stone = 0;
      		if(find) stone = find.value;
      		await interaction.reply(str + `持ってる<:stone:1135016872950116485>: ${stone}個`);
      		return;
    	}catch(err: unknown){
      		logger.error(`${err}`);
      		if(interaction.replied)await interaction.editReply(`${err}`);
      		else await interaction.reply(`${err}`);
      		return;
    	}
  	}
};

export const command = new Work();

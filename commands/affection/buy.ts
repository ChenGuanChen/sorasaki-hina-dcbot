import { CommandInteraction, TextBasedChannel } from 'discord.js';
import { Command } from '../../classes/command';
import { buy_cd, stones, bot } from '../../index'
import { Affection } from '../../configs/affection';
import { config } from '../../configs/gen_config';
import { constant } from '../../configs/constants';
import { able } from '../../function/permission';
import { sinrand } from '../../function/rand'; 
import { add_exp } from '../../function/Affection/add_exp';
import { logger } from '../../logger';
import { bar } from '../../function/Affection/bar';

class Buy extends Command{
	//get
	get name(){return `buy`;}
  	get description(){
    	return `ヒナと一緒に買い物に行きたいな～`;
  	}
  	get catagory(){return `affection`;}
  	get dataname(){return `buy`;}
  	async execute(interaction: CommandInteraction): Promise<void>{
    	try{
    		//init
    	  	const guild = await bot.guilds.fetch(config.guildId);
    	  	if(guild === null || guild.id !== config.guildId)
        		throw `null guild in buy.ts`;
      		const channel = await guild.channels
        		.fetch(Affection.channel) as TextBasedChannel;
      		if(channel == null || channel.id !== Affection.channel)
        		throw `null channel in buy.ts`;
      		const id = interaction.user.id;
      		//able
      		let check =await able(
        		interaction, 
        		`あ、先生。あと少しが残っているからここに待ってて ${channel.url}`, 
        		channel, 
        		buy_cd,
        		constant.day,
      		);
      		if(!check) return;
      		//get stones  
      		const search = await stones.findOne({userid: id});
      		let result = 0;
      		if(search !== null)result = search.value;
      		if(result < 200){
        		await interaction.reply(
        		    `お金が足りないですか。ううん、大丈夫だよ\n`
        		);
        		return;
      		}
      		//result
      		let str: string = '';
      		await add_exp(id, 60);
      		await stones.updateOne(
        		{userid: interaction.user.id},
        		{
        		  $inc:{
        		    value: -200,
        		  }
        		},
        		{upsert: true}
      		);
      		//output
      		const prog = await bar(interaction);
      		const remain = await stones.findOne({userid: id});
      		if(!remain) throw `null remain in buy.ts`;
      		const rand = await sinrand(Affection.react_buy_size - 1);
      		str = 
      		`${config.httpServer.urlBase}` +
      		`/files/hina/react/buy/${rand}.png`;
      		await interaction.reply(
        		`(/////)\n${prog}\n` + 
        		`remained stones: ${remain.value}\n` + 
        		str
      		);
      		return;
    	}catch(err: unknown){
      		logger.error(`${err}`);
      		if(interaction.replied)await interaction.editReply(`${err}`);
      		else await interaction.reply(`${err}`);
      		return;
    	}
  	}
};

export const command = new Buy();

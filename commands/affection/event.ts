import { CommandInteraction, TextBasedChannel } from 'discord.js';
import { Command } from '../../classes/command';
import { mood_cd, bot } from '../../index'
import { Affection } from '../../configs/affection';
import { config, } from '../../configs/gen_config'
import { constant } from '../../configs/constants';
import { able } from '../../function/permission';
import { sinrand } from '../../function/rand';
import { cur_mood } from '../../function/Affection/mood'; 
import { logger } from '../../logger';

class Event extends Command{
    //get
    get name(){return `event`;}
	get description(){
		return `ヒナは何を考えてるみたい...`;
	}
	get catagory(){return `affection`;}
	get dataname(){return `event`;}
  	async execute(interaction: CommandInteraction): Promise<void>{
    	try{
    		//init
    		const guild = await bot.guilds.fetch(config.guildId);
    		if(guild === null || guild.id !== config.guildId)
    			throw `null guild in event.ts`;
    		const channel = await guild.channels
    			.fetch(Affection.channel) as TextBasedChannel;
    		if(channel == null || channel.id !== Affection.channel)
    			throw `null channel in event.ts`;
    		const id = interaction.user.id;
   			//able
    		let check =await able(
    			interaction, 
    			`うん、先生が疲れたらこっちでリラックスして ${channel.url}`, 
    			channel, 
    			mood_cd, 
    			constant.hr8
    		);
    		if(!check) return;
    		//get mood
    		const ans = await cur_mood(interaction, 1);
    		if(ans < 0)throw `error occurs in mood.ts in event.ts`;
    		//output
    		let str: string = '';
    		const rand = await sinrand(Affection.want_size[ans] - 1);
        	str += 
        	`${config.httpServer.urlBase}` +
        	`/files/hina/want/${Affection.choice[ans]}/${rand}.png`;
      		await interaction.reply(str);  
    	}catch(err: unknown){
      		logger.error(`${err}`);
      		if(interaction.replied)await interaction.editReply(`${err}`);
      		else await interaction.reply(`${err}`);
      		return;
    	}
  	}
};

export const command = new Event();

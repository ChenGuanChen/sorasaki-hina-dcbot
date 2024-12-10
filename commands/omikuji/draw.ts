import { 
  	CommandInteraction, 
  	EmbedBuilder,
  	TextBasedChannel
} from 'discord.js';
import { Command } from '../../classes/command';
import { bot, kuji_cd } from '../../index'
import { config } from '../../configs/gen_config'
import { constant } from '../../configs/constants';
import { Affection } from '../../configs/affection';
import { sinrand } from '../../function/rand'; 
import { 
	daikiti,
  	kiti,
  	hankiti,
  	syoukiti,
  	matsuyoukiti,
  	suekiti,
  	kyou,
} from '../../data/kuji_contents'
import { able } from '../../function/permission';
import { logger } from '../../logger';

class Draw extends Command{
	//get
  	get name(){return `draw`;}
  	get description(){
    	return `ヒナ、占いお願い！`;
  	}
  	get catagory(){return `omikuji`;}
  	get dataname(){return `draw`;}
  	async execute(interaction: CommandInteraction): Promise<void>{
    	try{
			//init
			const guild = await bot.guilds.fetch(config.guildId);
    		if(guild === null || guild.id !== config.guildId)
				throw 'null guild in draw.ts';
    		const channel = await guild.channels
      			.fetch(Affection.channel) as TextBasedChannel;
    		if(channel == null || channel.id !== Affection.channel)
				throw 'null channel in draw.ts';
			//able
    		const check = await able(
				interaction, 
				`占い`, 
				channel, 
				kuji_cd, 
				constant.hr8
			);
    		if(!check)return;
    		const rand = await sinrand(99);
    		let str: string = '';
    		let num: number = 0;
    		let dis: string = '';
    		if(rand <= 16){
      			str = `daikiti`;
      			num = await sinrand(16);
      			dis = daikiti[num];
    		}
    		else if(rand <= 51){
      			str = `kiti`;
      			num = await sinrand(34);
      			dis = kiti[num];
    		}
    		else if(rand <= 56){
      			str = `hankiti`;
      			num = await sinrand(4)
      			dis = hankiti[num];
    		}
    		else if(rand <= 60){
      			str = `syoukiti`;
      			num = await sinrand(3);
      			dis = syoukiti[num];
    		}
    		else if(rand <= 63){
      			str = `matsusyoukiti`;
      			num = await sinrand(2);
      			dis = matsuyoukiti[num];
    		}
    		else if(rand <= 69){
      			str = `suekiti`;
      			num = await sinrand(5);
      			dis = suekiti[num];
    		}
    		else{
      			str = `kyou`;
      			num = await sinrand(29);
      			dis = kyou[num];
    		}
    		const embeds = [
      			new EmbedBuilder().setURL(
        			`${config.httpServer.urlBase}` +
        			`/files/hina/others/peek/example.png`
      			).setImage(
        			`${config.httpServer.urlBase}` +
        			`/files/omikuji/` + str +
        			`/front/${num}.png`
      			).setTitle(
        			"先生、結果が出たよ"
      			).setDescription(dis),
      			new EmbedBuilder().setURL(
        			`${config.httpServer.urlBase}` +
        			`/files/hina/others/peek/example.png`
      			).setImage(
        			`${config.httpServer.urlBase}` +
        			`/files/omikuji/` + str + 
        			`/back/${num}.png`
      			),
    		];
    		await interaction.reply({embeds});
    		bot.channel_used.delete(interaction.channelId);
		}catch(err: unknown){
			logger.error(`${err}`);
    		bot.channel_used.delete(interaction.channelId);
			if(interaction.replied)await interaction.editReply(`${err}`);
			else await interaction.reply(`${err}`);
		}
  	}
};

export const command = new Draw();

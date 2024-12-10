import { 
    CommandInteraction, 
    CommandInteractionOptionResolver,
    SlashCommandBuilder,
    TextBasedChannel,
} from 'discord.js';
import { Command } from '../../classes/command';
import { pat_cd, bot } from '../../index'
import { Affection } from '../../configs/affection';
import { config } from '../../configs/gen_config'
import { constant } from '../../configs/constants';
import { able } from '../../function/permission';
import { sinrand } from '../../function/rand';
import { cur_mood } from '../../function/Affection/mood'
import { bar } from '../../function/Affection/bar';
import { add_exp } from '../../function/Affection/add_exp';
import { logger } from '../../logger';

type CIOR = CommandInteractionOptionResolver;

class Action extends Command{
	//get
  	get name(){return `action`;}
  	get description(){
    	return `ヒナ～こっちおいで～`;
  	}
  	get catagory(){return `affection`;}
  	get dataname(){return `headpat`;}
  	//build
  	override build(): 
  	SlashCommandBuilder | 
  	Omit<SlashCommandBuilder,`addSubcommand` | `addSubcommandGroup`>{
    	return new SlashCommandBuilder()
      		.setName(this.name)
      		.setDescription(this.description)
      		.addStringOption(option =>
        		option.setName(`ヒナに何をする`)
            		.setDescription('choose what you want to do to hina')
            		.setRequired(true)
            		.addChoices(
				  		{ name: 'nadenade --headpat', value: 'nade' },
				  		{ name: 'homeru --praise hina', value: 'praise' },
				  		{ name: 'date --ask hina out', value: 'date' },
		    		)
      		)
  	}
  	async execute(interaction: CommandInteraction): Promise<void>{
    	try{
      		//init
      		const guild = await bot.guilds.fetch(config.guildId);
      		if(guild === null || guild.id !== config.guildId)
        		throw `null guild in headpat.ts`;
      		const channel = await guild.channels
        		.fetch(Affection.channel) as TextBasedChannel;
      		if(channel == null || channel.id !== Affection.channel)
        		throw `null channel in headpat.ts`;
      		const id = interaction.user.id;
      		//able
      		let check =await able(
        		interaction, 
        		`忙しいからここに待ってて ${channel.url}`, 
        		channel, 
        		pat_cd,
        		constant.hr8,
      		);
      		if(!check) return;
      		//get choice
      		const choice = (interaction.options as CIOR).getString('ヒナに何をする');
      		if(!choice) throw 'null choice in headpat.ts';
      		//get mood
      		const ans = await cur_mood(interaction);
      		if(ans < 0) throw `error in mood.ts in headpat.ts`;
      		//checking answer
      		let str: string = '', correct = false;
      		if(choice === Affection.choice[ans]){
        		correct = true;
        		const rand = await sinrand(Affection.react_size[ans] - 1);
        		str = 
        		`${config.httpServer.urlBase}` +
        		`/files/hina/react/${Affection.choice[ans]}/${rand}.png`;
      		}
      		//result
      		if(correct){
        		await add_exp(id, 15);
        		const prog = await bar(interaction);
        		await interaction.reply(`(/////)\n${prog}\n` + str);
      		}
      		else{
        		const prog = await bar(interaction);
        		await interaction.reply(`うん、ありがとう\n${prog}`);
     		}
    	}catch(err: unknown){
      		logger.error(`${err}`);
      		if(interaction.replied)await interaction.editReply(`${err}`);
      		else await interaction.reply(`${err}`);
      		return;
    	}
  	}
};

export const command = new Action();

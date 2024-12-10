import { 
    CommandInteraction,
    CommandInteractionOptionResolver,
    SlashCommandBuilder,
 } from 'discord.js';
import { Command } from '../../classes/command';
import { stones, affection, mission_cd, mission, alarm } from '../../index'
import { config } from '../../configs/gen_config';
import { bar } from '../../function/Affection/bar'; 
import { time_string } from '../../function/time_str';
import { logger } from '../../logger';
import { game } from '../../configs/poker';
type CIOR = CommandInteractionOptionResolver;
class Peak extends Command{
	//get
  	get name(){return `peek`;}
  	get description(){
    	return `peek.`;
  	}
  	get catagory(){return `op`;}
  	get dataname(){return `look`;}
	//build
  	override build(): 
  	SlashCommandBuilder | 
  	Omit<SlashCommandBuilder,`addSubcommand` | `addSubcommandGroup`>{
    	return new SlashCommandBuilder()
      		.setName(this.name)
      		.setDescription(this.description)
      		.addUserOption( option =>
        	option.setName(`誰の資料を覗く`)
        	    .setDescription('target you want to see')
        	    .setRequired(true)
      	)
  	}

  	async execute(interaction: CommandInteraction): Promise<void>{
    	if(!config.AllowedID.includes(interaction.user.id)){
      		await interaction.reply(
        		{content: `(ヒナ今は寝てる...)`,
          		ephemeral: true }
      		);
      		return;
    	}
   		try{
        	const tar_us = (interaction.options as CIOR).getUser(`誰の資料を覗く`);
        	if(!tar_us)throw `null target!`;
        	let str = `========================================\n`;
        	str += ` ♢ 名前                    ${tar_us.username}\n`;
        	const id = tar_us.id;
        	let result = await stones.findOne({userid: id});
        	let value = 0;
        	if(result)value = result.value;
        	str += ` ♢ 宝石                    ${game.stone} x${value}\n`;
        	result = await affection.findOne({userid: id});
        	value = 0;
        	if(result)value = result.value;
        	str += ` ♢ ヒナの好感度 ${(await bar(interaction, false))}\n`;
        	result = await mission_cd.findOne({userid: id});
        	if(result)str += ` ♢ ミッション     ${(await time_string(result.value))}\n`;
        	else{
          		const search = await mission.findOne({userid: id});
          		if(!search || search.value === 0)str += ` ♢ ミッション     ないみたい\n`;
          		else str += ` ♢ ミッション     ミッション完了、ヒナはあなたを待ってる\n`;
        	} 
        	result = await alarm.findOne({userid: id});
        	if(!result)str += ` ♢ アラーム         ないみたい\n`;
        	else str += ` ♢ アラーム         ${(await time_string(result.value))}\n`;
        	str += `========================================`
        	await interaction.reply({content: str, ephemeral: true});
    	}
    	catch(err: unknown){
    	    logger.error(`${err}`);
    	    if(interaction.replied)await interaction.editReply(`${err}`);
    	    else await interaction.reply(`${err}`);
    	    return;
    	}
  	}
};

export const command = new Peak();

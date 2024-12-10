import {Interaction} from 'discord.js';

import {isExtendedClient} from '../classes/extendedclient';
import {logger} from '../logger';

export async function handleCommands(interaction: Interaction): Promise<void>{
  if(!interaction.isChatInputCommand()) return;
  if(!isExtendedClient(interaction.client)){
    logger.error(`Type Error in function "handleCommands"`);
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);
  if(!command){
    logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  //try{
    if('execute' in command)
      await command.execute(interaction);
    else{
      logger.error('The command is missing a require `execute` function');
      return;
    }
  /*}catch(error){
    logger.error(`Execution error in function "handleCommands"`);
    if(interaction.replied || interaction.deferred)
      await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
    else
      await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
  }*/
}
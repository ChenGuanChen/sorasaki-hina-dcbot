import {
  Collection,
  CommandInteraction,
  ComponentType, 
  Message,
  MessageReaction,
  ReactionCollector,
  TextBasedChannel, 
  User
} from 'discord.js';
import { Command } from '../../classes/command';
import { config} from '../../configs/gen_config'
import { logger } from '../../logger'
class Test extends Command{
/*****************get*****************/
  get name(){return `test`;}
  get description(){
    return `update-inc neo のテスト中だ`;
  }
  get catagory(){return `test`;}
  get dataname(){return `test`;}
/***************execute***************/
  async execute(interaction: CommandInteraction): Promise<void>{
    try{
      if(!config.AllowedID.includes(interaction.user.id)){
        await interaction.reply(
          {content: `ちょっと待ってて、忙しいから。。。`,
            ephemeral: true }
        );
        return;
      }
    }catch(err: unknown){
      logger.error(`${err}`);
      const channel = interaction.channel;
      if(channel === null){
        if(interaction.replied)await interaction.editReply(`${err}`);
        else await interaction.reply(`${err}`);
      }
      else
        await channel.send(`${err}`);
    }
  }
};

export const command = new Test();

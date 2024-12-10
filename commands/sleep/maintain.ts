import { CommandInteraction } from 'discord.js';
import { setTimeout } from 'node:timers/promises'
import { Command } from '../../classes/command';
import { config } from '../../configs/gen_config';
import { Affection } from '../../configs/affection';
import { sinrand } from '../../function/rand';
import { bot } from '../../index';
import { logger } from '../../logger';

class Maintain extends Command{
  get name(){return `mt`;}
  get description(){return `ヒナ、体の体調大丈夫？ちょっと休まない？`;}
  get catagory(){return `sleep`;}
  get dataname(){return `maintain`;}
  async execute(interaction: CommandInteraction): Promise<void>{
    try{
      if(!config.AllowedID.includes(interaction.user.id)){
        await interaction.reply(
          {content: `ううん、大丈夫。寝ない`,
            ephemeral: true }
        );
        return;
      }
      if(bot.channel_used.get(interaction.channelId)){
        await interaction.reply(
          {content: `ちょっと待ってて、忙しいから。。。`,
            ephemeral: true }
        );
        return;
      }
      bot.channel_used.set(interaction.channelId, true);
      let str: string = '';
    	const rand = await sinrand(Affection.sleep_size - 1);
      str += 
      	`${config.httpServer.urlBase}` +
        `/files/hina/others/sleep/${rand}.png`;
      const msg = await interaction.reply(str);
      const channel = interaction.channel;
      if(channel === null)throw `null channel in maintain.ts!`;
      await channel.send(`ん...少しなら大丈夫そう\nおやすみ先生`);
      bot.channel_used.delete(interaction.channelId);
      await setTimeout(5000);
      bot.in_use = true;
    }catch(err: unknown){
      logger.error(`${err}`);
      if(interaction.replied)
        await interaction.editReply(`${err}`);
      else
        await interaction.reply(`${err}`);
      return;
    }
  }
};

export const command = new Maintain();
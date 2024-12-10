import { CommandInteraction } from 'discord.js';
import { setTimeout } from 'node:timers/promises'
import { Command } from '../../classes/command';
import { config } from '../../configs/gen_config';
import { bot } from '../../index';
import { able } from '../../function/permission'
import { logger } from '../../logger';
import { channel } from 'node:diagnostics_channel';

class ProfilePicture extends Command{
  get name(){return `pfp`;}
  get description(){return `ヒナの顔を見たい！！`;}
  get catagory(){return `test`;}
  get dataname(){return `pfp`;}
  async execute(interaction: CommandInteraction): Promise<void>{
    try{
      const channel = interaction.channel;
      if(channel === null)throw `null channel in pfp.ts!`;
      let check = await able(interaction, 'null', channel);
      if(!check)return;
      bot.channel_used.set(interaction.channelId, true);
      await interaction.reply(`ちょッ、ま...ッ`);
      const msg = await channel.send(
        `${config.httpServer.urlBase}` +
        `/files/hina/others/peek/example.png`
      );
      await setTimeout(3000);
      await interaction.editReply(`近い！！`);
      await msg.edit(`( でも、いいかも...//// )`);
      bot.channel_used.delete(interaction.channelId);  
    }catch(err: unknown){
      logger.error(`${err}`);
      await interaction.editReply(`${err}`);
      return;
    }
  }
};

export const command = new ProfilePicture();
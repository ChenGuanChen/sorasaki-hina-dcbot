import { CommandInteraction } from 'discord.js';
import { setTimeout } from 'node:timers/promises'
import { Command } from '../../classes/command';
import { config } from '../../configs/gen_config';
import { Affection } from '../../configs/affection';
import { sinrand } from '../../function/rand';
import { bot } from '../../index';

class Wake extends Command{
  get name(){return `wake`;}
  get description(){return `ヒナ、もう朝だよ`;}
  get catagory(){return `sleep`;}
  get dataname(){return `wake`;}
  async execute(interaction: CommandInteraction): Promise<void>{
    if(!config.AllowedID.includes(interaction.user.id)){
      await interaction.reply(
        {content: `Zzz......`,
          ephemeral: true }
      );
      return;
    }
    bot.channel_used.set(interaction.channelId, true);
    let str: string = '';
    const rand = await sinrand(Affection.wake_size - 1);
    str += 
    	`${config.httpServer.urlBase}` +
      `/files/hina/others/wake/${rand}.png`;
    const msg = await interaction.reply(str);
    bot.channel_used.delete(interaction.channelId);
    await setTimeout(5000);
    bot.in_use = false;
  }
};

export const command = new Wake();
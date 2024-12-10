import {CommandInteraction} from 'discord.js';
import {Command} from '../../classes/command';
import { setTimeout } from 'node:timers/promises';
import { bot } from '../../index';

class Ping extends Command{
  get name(){return `ping`;}
  get description(){return `ヒナ、健康診断の時間だᕕ(◠ڼ◠)ᕗ`;}
  get catagory(){return `utils`;}
  get dataname(){return `ping`;}
  async execute(interaction: CommandInteraction): Promise<void>{
    if(bot.in_use){
      await interaction.reply(
        {content: `(ヒナ今は寝てる...)`,
          ephemeral: true }
      );
      return;
    }
    const sent = await interaction.reply({
      content: `ちょっ、先生、どこに触ってるんだ...`,
      ephemeral: true,
      fetchReply: true, 
    });
    await setTimeout(2000);
    await interaction.editReply(
      `...ッん、結果が出た/////\n`+
      `========================\n`+
      `| Roundtrip latency: ${
      sent.createdTimestamp - interaction.createdTimestamp
      }ms |`
    );
  }
};

export const command = new Ping();

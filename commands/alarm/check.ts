import { CommandInteraction } from 'discord.js';
import { Command } from '../../classes/command';
import { logger } from '../../logger';
import { bot, alarm } from '../../index'
import { time_string } from '../../function/time_str';

class Check_alarm extends Command{
  get name(){return `check`;}
  get description(){return `ヒナ～スケジュールについて、`;}
  get catagory(){return `alarm`;}
  get dataname(){return `check`;}
  async execute(interaction: CommandInteraction): Promise<void>{
    if(bot.in_use){
      await interaction.reply(
        {content: `(ヒナ今は寝てる...)`,
          ephemeral: true }
      );
      return;
    }
    try{
      await interaction.reply(`うん、待ってね`);
      const id = interaction.user.id;
      const result = await alarm.findOne({userid: id});
      if(result === null){
        await interaction.editReply(`記録がないみたい先生`);
      }
      else{
        let ans = `ここにあったよ先生\n`;
        ans += await time_string(result.value);
        ans += `まで休んでいいよ`;
        await interaction.editReply(ans);
      }
    }catch(err: unknown){
      logger.error(`${err}`);
      if(interaction.replied)await interaction.editReply(`${err}`);
      else await interaction.reply(`${err}`);
      return;
    }
  }
};

export const command = new Check_alarm();
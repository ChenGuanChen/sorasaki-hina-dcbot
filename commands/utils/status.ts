import { CommandInteraction, inlineCode } from 'discord.js';
import { Command } from '../../classes/command';
import { stones, affection, mission_cd, mission, alarm } from '../../index'
import { bar } from '../../function/Affection/bar';
import { time_string } from '../../function/time_str';
import { game } from '../../configs/poker';
class Status extends Command{
/*****************get*****************/
  get name(){return `status`;}
  get description(){
    return `status!`;
  }
  get catagory(){return `utils`;}
  get dataname(){return `status`;}
/***************execute***************/
  async execute(interaction: CommandInteraction): Promise<void>{
    let str = `========================================\n`;
    str += ` ♢ 名前                    ${interaction.user.username}\n`;
    const id = interaction.user.id;
    let result = await stones.findOne({userid: id});
    let value = 0;
    if(result)value = result.value;
    str += ` ♢ 宝石                    ${game.stone} x${value}\n`;
    result = await affection.findOne({userid: id});
    value = 0;
    if(result)value = result.value;
    str += ` ♢ ヒナの好感度 ${(await bar(interaction, true))}\n`;
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
};

export const command = new Status();

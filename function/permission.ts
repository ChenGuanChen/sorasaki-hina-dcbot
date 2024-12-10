import { CommandInteraction, TextBasedChannel } from "discord.js";
import { Collection } from "mongodb";
import { bot, affection } from "../index"
import { config } from "../configs/gen_config"
import { format } from "../interfaces/mongo-format";
import { sinrand } from "./rand"
import { time_string } from "./time_str"
import { Affection } from "../configs/affection";
export async function able(
    interaction: CommandInteraction, 
    tar?: string,
    channel?: TextBasedChannel,
    cd?: Collection<format>,
    cd_time?: number,
    cd_log?: string,
): Promise<boolean>{
    const id = interaction.user.id;
    if(bot.in_use && !config.AllowedID.includes(id)){
        await interaction.reply(
            {content: `(ヒナ今は寝てる...)`,
            ephemeral: true }
        );
        return false;
    }   
    if(bot.channel_used.get(interaction.channelId)){
        await interaction.reply(
          {content: `ちょっと待ってて、忙しいから。。。`,
            ephemeral: true }
        );
        return false;
    }
    if(config.lock_channel && tar !== undefined && channel !== undefined){
        let str = `${tar}はこっちだよ先生 ${channel.url}`;
        if(tar.length >= 5) str = tar;
        if(interaction.channelId !== channel.id){
          await interaction.reply(
            {content: str,
              ephemeral: true }
          );
          return false;
        }
    }
    const search = await affection.findOne({userid: id});
    if(search && search.value < 0 && channel !== undefined && channel.id == Affection.channel){
      const rev = - search.value;
      const rand = await sinrand(99);
      if(rand < rev * 20){
        await interaction.reply(`先生と会いたくないです。`)
        return false;
      }
    }
    if(cd !== undefined && cd_time !== undefined){
        const time = await cd.findOne({userid: id});
        if(time){
            let ans = `今は仕事しないと、\n`;
            if(cd_log !== undefined)ans = cd_log;
            ans += await time_string(time.value);
            ans += `まで待ってて`;
            await interaction.reply(
                {content: ans,
                ephemeral: true }
            );
            return false;
        }
        else{
            const now = new Date().getTime();
            cd.updateOne(
              {userid: id},
              {
                $set:{
                  userid: id,
                  value: now + cd_time,
                }
              },
              {upsert: true}
            );
        }  
    }
    return true;
}
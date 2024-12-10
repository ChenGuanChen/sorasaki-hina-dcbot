import { Message, TextBasedChannel } from 'discord.js';
import { logger } from '../logger';
import { ExtendedClient } from '../classes/extendedclient';
import { alarm, kuji_cd, pat_cd, mood_cd, mission_cd, buy_cd } from '../index';
import { config } from '../configs/gen_config';
import { Affection } from '../configs/affection';
import { add_exp } from '../function/Affection/add_exp';

export async function checkeronline(client: ExtendedClient): Promise<void>{
  try{
    while(1){
      const time = new Date();
      const guild = await client.guilds.fetch(config.guildId);
      if(guild === null || guild.id !== config.guildId)
        throw `null guild`;
      const channel = await guild.channels
        .fetch(Affection.channel) as TextBasedChannel;
      if(channel == null || channel.id !== Affection.channel)
        throw `null channel`;
      const cur_time = time.getTime();
      const alarm_offs = await (alarm.find({value: {$lte: cur_time}})).toArray();
      for(const search of alarm_offs){
          const user = await guild.members.fetch(search.userid);
          let ans: string =`${user.user}\n`;
          ans += `先生、もう時間だ\n`;
          ans += `ダラダラしないで、仕事をきちんとやって！`
          await channel.send(ans);
      }
      let chk = (
        time.getHours() === 4 && 
        time.getMinutes() === 0 &&
        time.getSeconds() === 0
      );
      if(chk){
        await kuji_cd.deleteMany();
        await pat_cd.deleteMany();
        await mood_cd.deleteMany();
        await buy_cd.deleteMany();
        continue;
      }
      await alarm.deleteMany({value: {$lte: cur_time}});
      await kuji_cd.deleteMany({value: {$lte: cur_time}});
      await pat_cd.deleteMany({value: {$lte: cur_time}});
      await mood_cd.deleteMany({value: {$lte: cur_time}});
      await mission_cd.deleteMany({value: {$lte: cur_time}});
      await buy_cd.deleteMany({value: {$lte: cur_time}});
      const filter = (m:Message) => (
        m.content.includes(`虐`) ||
        m.content.includes(`ㄋ`) ||
        m.content.includes(`ㄩ`) ||
        m.content.includes(`ㄝ`) ||
        m.content.includes(`哭哭`) ||
        m.content.includes(`nue`) ||
        m.attachments.size > 0
      );
      const ncollector = await channel.awaitMessages(
        { 
          filter, 
          time: 100 ,
          max: 1
        }
      );
      if(ncollector.size < 1)continue;
      const msg = ncollector.first();
      if(msg === undefined)throw `undefined msg!`
      let bad = false;
      if(
        msg.content.includes(`虐`) ||
        msg.content.includes(`ㄋ`) ||
        msg.content.includes(`ㄩ`) ||
        msg.content.includes(`ㄝ`) ||
        msg.content.includes(`哭哭`)
      )bad = true;
      if(!bad){
        const col = msg.attachments;
        for(const search of col){
          if(Affection.bad_names.includes(search[1].name)){
            bad = true;
            break;
          }
        }  
      }
      if(bad){
        const bad_id = msg.author.id;
        await add_exp(bad_id, -60);
        await channel.send(`...あぁ、しょうがない`);
        const tar = await guild.members.fetch(bad_id);
        await tar.timeout(600 * 1000);
      }
    }
  }catch(error: unknown){
    logger.error(`${error}`);
    return;
  }
}
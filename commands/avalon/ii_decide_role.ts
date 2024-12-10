import { Message, TextBasedChannel, User } from 'discord.js';
import { logger } from '../../logger'
import { avalon } from '../../configs/avalon';
export async function decide(channel: TextBasedChannel, num: number, usr: User): Promise<Array<number>>{
    try{
      const role = [
        avalon.roles[num - 5][0],
        avalon.roles[num - 5][1],
        avalon.roles[num - 5][2],
        avalon.roles[num - 5][3],
        avalon.roles[num - 5][4],
        avalon.roles[num - 5][5],
        avalon.roles[num - 5][6],
        avalon.roles[num - 5][7],
        avalon.roles[num - 5][8],
      ]; 
      await channel.send(
        `先ずはキャラクターの配置を決めましょう\n` +
        `今の人数によるディフォルト(default)は:\n` +
        `${avalon.names[0]}: ${role[0]} 人\n` +
        `${avalon.names[1]}: ${role[1]} 人\n` +
        `${avalon.names[2]}: ${role[2]} 人\n` +
        `${avalon.names[3]}: ${role[3]} 人\n` +
        `${avalon.names[4]}: ${role[4]} 人\n` +
        `${avalon.names[5]}: ${role[5]} 人\n` +
        `${avalon.names[6]}: ${role[6]} 人\n` +
        `${avalon.names[7]}: ${role[7]} 人\n` +
        `${avalon.names[8]}いる？: ${(role[8] > 0)}\n` +
        `この配置を使う？(y/n)\n` +
        `*注: qでゲームを放棄する`
      );
      const yn = (m: Message) => (
        m.author.id === usr.id && (
          m.content.toLowerCase() === 'y' ||
          m.content.toLowerCase() === 'n' ||
          m.content.toLowerCase() === 'q'
        )
      );
      let ans = await channel.awaitMessages({
        filter: yn, 
        max: 1, 
        time: 15 * 1000}
      );
      let msg = ans.first();
      if(msg === undefined)throw 'no response from question: use default or not';
      await msg.reply(`わかった。`);
      if(msg.content.toLowerCase() === 'q')return [];
      if(msg.content.toLowerCase() === 'n'){
        let ask = await channel.send(
          `じゃお互いに5分以内で話し合って配置を決めて\n` +
          `もし配置を決めたら、いつでも『d』とタイプして知らせて\n` +
          `*注: qでゲームを放棄する`
        );
        let done = false;
        while(!done){
          const brk = (m: Message) => (
            m.author.id === usr.id && 
            m.content.toLowerCase() === `d`
          );
          ans = await channel.awaitMessages({
            filter: brk,
            max: 1,
            time: 5 * 60 * 1000,
          });
          msg = ans.first();
          if(msg !== undefined){
            let chk = true;
            if(msg.content.toLowerCase() === 'q')chk = false;
            await msg.delete();
            if(!chk) return [];
          }
          let count = 0;
          let ju_count = 0;
          let n = await channel.send(`うん、配置を教えて`);
          for(let i = 0; i < 8; i ++){
            await n.edit(
              `${avalon.names[i]} を入れる？(y/n)\n` +
              `残り人数: ${num - count}\n` +
              `*注: qでゲームを放棄する`
            );
            ans = await channel.awaitMessages({
              filter: yn,
              max: 1,
              time: 15 * 1000,
            });
            msg = ans.first();
            if(msg === undefined)role[i] = 0;
            else{
              if(msg.content.toLowerCase() === 'q'){
                await msg.delete();
                return [];
              }
              if(msg.content.toLowerCase() === 'y'){
                role[i] = 1;
                if(i < 8)count += role[i];
                if(i < 3)ju_count += role[i];
              }
              else role[i] = 0;
              await msg.delete();
            }
            if(count >= num || ju_count >= num)break;
            if(avalon.names[i].includes(`バカ`) && role[i] > 0){
              count --;
              ju_count --;
              await n.edit(
                `何人を入れる？(0 ~ 9)\n` +
                `残り人数: ${num - count}\n` +
                `*注: qでゲームを放棄する`
              );
              const input = (m: Message) => (
                m.author.id === usr.id &&
                (
                  (
                    m.content.length < 2 &&
                    m.content[0] >= '0' &&
                    m.content[0] <= '9'
                  ) || (
                    m.content.toLowerCase() === 'q'
                  )
                )
              );
              ans = await channel.awaitMessages({
                filter: input,
                max: 1,
                time: 15 * 1000,
              });
              msg = ans.first();
              if(msg === undefined){
                role[i] = 1;
                count ++;
                if(i < 3)ju_count ++;
              }
              else{
                if(msg.content.toLowerCase() === 'q'){
                  await msg.delete();
                  return [];
                }
                role[i] = Number(msg.content[0]);
                count += role[i];
                if(i < 3)ju_count += role[i];
                await msg.delete();
              }
            }
            if(count >= num || ju_count >= num)break;
            if(i >= 2 && ju_count === 0)break;
          }
          if(ju_count >= num){
            await n.edit(
              `邪悪側が必要だ、もう一度人数を確認して\n` +
              `もし配置を直したらいつでも『d』とタイプして知らせて\n` +
              `*注: qでゲームを放棄する`
            );
            continue;
          }
          if(ju_count === 0){
            await n.edit(
              `正義側が必要だ、もう一度人数を確認して\n` +
              `もし配置を直したらいつでも『d』とタイプして知らせて\n` +
              `*注: qでゲームを放棄する`
            );
            continue;
          }
          if(count !== num){
            await n.edit(
              `人数が合っていないみたい、もう一度確認して\n` +
              `もし配置を直したらいつでも『d』とタイプして知らせて\n` +
              `*注: qでゲームを放棄する`
            );
            continue;
          }
          await n.edit(
            `${avalon.names[8]} を入れる？(y/n)\n` +
            `*注: qでゲームを放棄する`
          );
          ans = await channel.awaitMessages({
            filter: yn,
            max: 1,
            time: 15 * 1000,
          });
          msg = ans.first();
          if(msg === undefined)role[8] = 0;
          else{
            if(msg.content.toLowerCase() === 'q'){
              await msg.delete();
              return [];
            }
            if(msg.content.toLowerCase() === 'y'){
              role[8] = 1;
            }
            else role[8] = 0;
            await msg.delete();
          }
          await n.edit(
            `最後に配置を確認する:\n` +
            `${avalon.names[0]}: ${role[0]} 人\n` +
            `${avalon.names[1]}: ${role[1]} 人\n` +
            `${avalon.names[2]}: ${role[2]} 人\n` +
            `${avalon.names[3]}: ${role[3]} 人\n` +
            `${avalon.names[4]}: ${role[4]} 人\n` +
            `${avalon.names[5]}: ${role[5]} 人\n` +
            `${avalon.names[6]}: ${role[6]} 人\n` +
            `${avalon.names[7]}: ${role[7]} 人\n` +
            `${avalon.names[8]}いる？: ${(role[8] > 0)}\n` +
            `これで合ってる？(y/n)\n` +
            `*注: qでゲームを放棄する`
          );
          ans = await channel.awaitMessages({
            filter: yn, 
            max: 1, 
            time: 15 * 1000}
          );
          msg = ans.first();
          if(msg === undefined)throw 'no response from question: last confirm';
          await msg.reply(`わかった。`);
          if(msg.content.toLowerCase() === 'q'){
            await msg.delete();
            return [];
          }
          else if(msg.content.toLowerCase() === 'n'){
            n = await channel.send(
              `じゃもう一度確認して\n` +
              `もし配置を直したらいつでも『d』とタイプして知らせて\n` +
              `*注: qでゲームを放棄する`
            )
            continue;
          }
          done = true;
          await n.edit(`設定を確認しました`);
          await n.delete();
        }
      }
      return role;
    }catch(err: unknown){
      logger.error(`${err}`);
      return [];
    }
}
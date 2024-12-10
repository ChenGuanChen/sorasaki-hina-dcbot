import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, TextBasedChannel } from "discord.js";
import { avalon } from "../../configs/avalon";
import { playerdata } from '../../interfaces/avalon-player';
import  path  from 'path';
import { readFile } from 'node:fs/promises';
import { logger } from "../../logger";
export async function cup(
    channel: TextBasedChannel,
    out: playerdata[]
): Promise<number | string>{
    try{
        const cup_choice = await channel.send(`0人がコップを出した、残る${out.length}人`);
        const yes = new ButtonBuilder()
            .setCustomId('success')
            .setLabel('聖杯を出す')
            .setStyle(ButtonStyle.Success);
        const no = new ButtonBuilder()
            .setCustomId('fail')
            .setLabel('汚れた杯を出す')
            .setStyle(ButtonStyle.Danger);
        const forbad = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(yes, no);
        const forgood = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(yes);
        const clean = path.join(__dirname, `../../files${avalon.cup.clean}`);
        const gcup = await readFile(clean);
        const dirty = path.join(__dirname, `../../files${avalon.cup.dirty}`);
        const dcup = await readFile(dirty);
        const cups = new Collection<Buffer, Buffer>();
        let ccnt = 0;
        let dcupcnt = 0;
        await Promise.all(out.map(
            async (value: playerdata) => {
              if(value.good){
                await value.player.send({files: [gcup]});
                const q = await value.player.send({
                  content: `どのコップを出す？`,
                  components: [forgood],
                });
                const bk = await q.awaitMessageComponent({time: 60 * 1000});
                cups.set(gcup, gcup);
                await bk.update({
                  content: `聖杯を出した`,
                  components: []
                });
              }
              else{
                await value.player.send({files: [gcup, dcup]});
                const q = await value.player.send({
                  content: `どのコップを出す？`,
                  components: [forbad],
                });
                const bk = await q.awaitMessageComponent({time: 60 * 1000});
                if(bk.customId === 'success'){
                  cups.set(gcup, gcup);
                  await bk.update({
                    content: `聖杯を出した`,
                    components: []
                  });
                }
                else{
                  cups.set(dcup, dcup);
                  await bk.update({
                    content: `汚れた杯を出した`,
                    components: []
                  });
                  dcupcnt ++;
                }
              }
              ccnt ++;
              await cup_choice.edit(`${ccnt}人がコップを出した、残る${out.length - ccnt}人`);
            }
          ))
          await cup_choice.edit(
            `ミッションに出たみんなからコップをもらった、一緒に見よう`
          );
          const cupres = await channel.send(`...`);
          const cupsbuf: Buffer[] = [];
          for(let f = 0; f < dcupcnt; f ++){
            cupsbuf.push(dcup);
            await cupres.edit({
              content: '',
              files: cupsbuf
            });
          }
          for(let f = cupsbuf.length; f < out.length; f ++){
            cupsbuf.push(gcup);
            await cupres.edit({
              content: '',
              files: cupsbuf
            });
        }
        return dcupcnt;
    }catch(err: unknown){
        logger.error(`${err}`);
        await channel.send(`${err}`);
        return `${err}`;
    }
}
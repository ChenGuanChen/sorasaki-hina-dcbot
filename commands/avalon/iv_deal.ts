import {
    ActionRowBuilder, 
    ButtonBuilder,
    ButtonStyle,
    TextBasedChannel, 
} from 'discord.js';
import { logger } from '../../logger';
import { avalon } from '../../configs/avalon';
import { playerdata } from '../../interfaces/avalon-player';
export async function deal(
    arr: Array<playerdata>,
    roles: Array<number>,
    channel: TextBasedChannel,
): Promise<string | null>{
    try{
        const ins = new Map(avalon.instruct);
        const a = await channel.send(
            `最初には、全員がDMで自分の役割を確認して。\n` +
            `(どうか60秒以内に確認ボタンを押してください)`
        );
        const chk = await channel.send(`0人が確認した、残る${arr.length}人`)
        const yes = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('確認完了')
            .setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(yes);
        let cur = 0;
        await Promise.all(arr.map(
            async (tar: playerdata) => {
                await tar.player.send({files: [tar.card]});
                await tar.player.send(`あなたが引いたカードは: ${tar.class}!`);
                const cha = ins.get(tar.class);
                if(cha === undefined)throw `get char_instruct fail in deal.ts`;
                await tar.player.send(cha);
                const deed = ins.get(`${tar.good}`);
                if(deed === undefined)throw `get deed_instruct fail in deal.ts`;
                await tar.player.send(deed);
                const affirm = await tar.player.send({
                    content: `役割を確認して`,
                    components: [row],
                });
                const ans =await affirm.awaitMessageComponent({time: 60 * 1000});
                await ans.update({ content: '確認完了', components: [] }),
                cur ++,
                await chk.edit(`${cur}人が確認した、残る${arr.length - cur}人`)
            }
        ));
        await chk.edit(`全員が役割を確認したから、各キャラクターの初期行動を開始する`);
        const bad: playerdata[] = [];
        let list: string = '';
        let mlist: string = '';
        let lcnt: number = 1;
        let mlcnt: number = 1;
        let meerlins: string = '';
        let mcnt = 1;
        for(const search of arr){
            if(!search.good){
                if(search.class !== 'モードレッド (Mordred)'){
                    list += `${lcnt}. ${search.player.username}\n`;
                    lcnt ++;
            }
            if(search.class !== 'オベロン (Oberon)'){
                mlist += `${mlcnt}. ${search.player.username}\n`;
                mlcnt ++;
                bad.push(search);
            }
            }
            if(
                search.class === `マーリン (Merlin)` ||
                search.class === `モルガナ (Morgana)`
            ){
                meerlins += `${mcnt}. ${search.player.username}\n`;
                mcnt ++;
            }
        }
        await chk.edit(`まず、オベロン (Oberon)以外邪悪の皆はDMを見て自分の味方達を確認して`);
        let cnt = 0;
        await Promise.all(bad.map(
            async (tar: playerdata) => {
                await tar.player.send(mlist);
                const affirm = await tar.player.send({
                    content: `味方達を確認した？`,
                    components: [row],
                });
                const ans =await affirm.awaitMessageComponent({time: 60 * 1000});
                await ans.update({ content: '確認完了', components: [] }),
                cnt ++,
                await chk.edit(`${cnt}人が確認した、残る${bad.length - cur}人`)
            }
        ))
        if(roles[0] > 0){
            await chk.edit(`次は、マーリン (Merlin)がDMを見てモードレッド (Mordred)以外の敵を確認して`);
            for(const search of arr){
                if(search.class === `マーリン (Merlin)`){
                    await search.player.send(list);
                    const affirm = await search.player.send({
                    content: `敵を確認した？`,
                    components: [row],
                })
                const ans = await affirm.awaitMessageComponent({time: 60 * 1000});
                await ans.update({ content: '確認完了', components: [] });
                }
            }        
        }
        if(roles[1] > 0){
            await chk.edit(`最後は、パーシヴァル (Percival)がDMを見てマーリン (Merlin)とモルガナ (Morgana)を確認して`);
            for(const search of arr){
                if(search.class === `パーシヴァル (Percival)`){
                    await search.player.send(meerlins);
                    const affirm = await search.player.send({
                        content: `確認した？`,
                        components: [row],
                    })
                    const ans = await affirm.awaitMessageComponent({time: 60 * 1000});
                    await ans.update({ content: '確認完了', components: [] });
                }
            }        
        }
        await chk.edit(`初期行動が終わった。それじゃ、ゲーム開始！`);
        return null;
    }catch(err: unknown){
      logger.error(`${err}`);
      await channel.send(`${err}`);
      return `${err}`;
    }
}
import {
  ActionRowBuilder,
  ComponentType,
  Message,
  SelectMenuComponentOptionData,
  StringSelectMenuBuilder,
  TextBasedChannel,
} from 'discord.js';
import { avalon } from '../../configs/avalon';
import { playerdata } from '../../interfaces/avalon-player';
import { logger } from '../../logger';
import { d_brk } from './d_brk'; 
  
function setChoices(datas: playerdata[]): SelectMenuComponentOptionData[]{
    const array: SelectMenuComponentOptionData[] = [];
    for(const choice of datas){
        let option: SelectMenuComponentOptionData = {
            label: choice.player.username,
            value: choice.player.id
            };
        array.push(option);
    }
    return array;
}

export async function row_gen(
    CustomId: string,
    Placeholder: string,
    players: playerdata[],
    num?: number,
): Promise< null | ActionRowBuilder<StringSelectMenuBuilder>>{
    try{
        const select = new StringSelectMenuBuilder()
                .setCustomId(CustomId)
                .setPlaceholder(Placeholder)
            .addOptions(setChoices(players))
        if(num){
            select.setMinValues(num)
                .setMaxValues(num)
        }
        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(select)
        return row;
    }catch(err: unknown){
        logger.error(`${err}`);
        return null;
    }
}

export async function multichoice(
    channel: TextBasedChannel,
    chooser: playerdata,
    CustomId: string,
    Placeholder: string,
    players: playerdata[],
    num: number,
):Promise<playerdata[] | string>{
    const ask = await channel.send(
        `じゃお互いに10分以内で話し合ってミッションにでる候補者達を決めて\n` +
        `もし候補者達を決めたら、いつでも『d』とタイプして知らせて\n` +
        `*注: マスターが入力する`
    );
    await d_brk(avalon.time.discussion, channel, chooser.player.id);
    await ask.edit(`時間だ、マスターの${chooser.player}はDMを見て候補者達を選んで`);

    const row = await row_gen(
        CustomId, 
        Placeholder, 
        players, 
        num,
    );
    if(!row)
        return `row_buildにエラー: null row`;

    const out:playerdata[] = [];
    const pick = await chooser.player.send({
        content: `マスター、候補者達を選んで`,
        components: [row]
    })
    const res = pick.createMessageComponentCollector({
        time: avalon.time.dm_choosing,
        componentType: ComponentType.StringSelect,
    });

    await channel.send('マスターが選んだ候補者達は:\n');
    let cnt = 1;
    let errstr = '';
    res.on('collect', async i => {
        try{
            await pick.edit({
                content: `わかった`,
                components: []
            })
            for(const search of i.values)
                logger.info(`collected ${search}`);
            
            const temp = players.filter(
                (value: playerdata) => (
                    i.values.includes(value.player.id)
                )
            );
            if(temp.length < 1)throw `null temp!`;
            for(const search of temp){
                await channel.send(`${cnt}. ${search.player}`);
                cnt ++;
            }
            for(const search of temp)
                out.push(search);
            res.stop();
            await channel.send(`d`);
        }catch(err: unknown){
            errstr = `${err}`;
            return;
        }
    });
    await d_brk(avalon.time.dm_choosing, channel);
    if(errstr.length > 1)
        return errstr;
    return out;
}

export async function sinchoice(
    channel: TextBasedChannel,
    chooser: playerdata,
    ask_cont_1: string,
    ask_cont_2: string,
    time_up_1: string,
    time_up_2: string,
    CustomId: string,
    Placeholder: string,
    tars: playerdata[],
    players: playerdata[],
    end: string
):Promise<playerdata | string>{
    try{
        const ask = await channel.send(
            ask_cont_1 +
            `${chooser.player}` +
            ask_cont_2 +
            `*注: ${chooser.player}が入力する`
        );
        await d_brk(avalon.time.discussion, channel, chooser.player.id);
        
        const nrow = await row_gen(CustomId, Placeholder, tars);
        if(!nrow)
            throw `row_buildにエラー: null row`
    
        await ask.edit(time_up_1 + `${chooser.player}` + time_up_2);
        const pick = await chooser.player.send({
            content: `${avalon.time.dm_choosing / 1000}秒で調べる対象を選んで`,
            components: [nrow]
        });
        const god_res = await pick.awaitMessageComponent({
            time: avalon.time.dm_choosing, 
            componentType: ComponentType.StringSelect,
        });
        const tar = players.filter(
            (value: playerdata) => (
                value.player.id === god_res.values[0]
            )
        )[0];
        await channel.send(`${chooser.player}が${tar.player}` + end);
        return tar;
    }catch(err: unknown){
        logger.error(`${err}`);
        return `${err}`;
    }
}
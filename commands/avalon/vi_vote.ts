import { Collection, MessageReaction, ReactionCollector, TextBasedChannel, User } from "discord.js";
import { avalon } from "../../configs/avalon";
import { playerdata } from '../../interfaces/avalon-player';
import { d_brk } from "./d_brk";
import { logger } from "../../logger";

export async function vote(
    channel: TextBasedChannel,
    playnum: number,
    boss: playerdata,
):Promise<boolean | string>{
    try{
        const col = await channel.send(
            `じゃこのリストを承認するかどうかを投票しよう\n` +
            `このメッセージの` + avalon.happy.full +
            `または` + avalon.angry.full + `を押して`
        );
        await col.react(avalon.happy.full);
        await col.react(avalon.happy.full);
    
        let mx = playnum;
        if(mx % 2 === 0) mx --;
        const sent = new Collection<string, User>();
        const emo = (reaction: MessageReaction, usr: User) => (
            (
                reaction.emoji.id === avalon.happy.id ||
                reaction.emoji.id === avalon.angry.id
            )&&(
                playnum % 2 !== 0 ||
                (playnum % 2 === 0 && usr.id !== boss.player.id)
            )
        );
        let happy = 0;
        let angry = 0;
        const reacol = new ReactionCollector(col,{
            filter: emo,
            dispose: true, 
            time: avalon.time.voting,
        })
        reacol.on('collect', async (i: MessageReaction, usr: User) => {
            if(sent.has(usr.id)){
                const another = col.reactions.cache.filter(
                    (value: MessageReaction) => (
                        value.emoji.id !== i.emoji.id
                    )
                ).first();
                if(another === undefined)throw `undefined another`;
                another.users.remove(usr.id);
                if(i.emoji.id === avalon.happy.id){
                    angry --;
                    happy ++;
                }
                else{
                    angry ++;
                    happy --;
                } 
                const warn = await channel.send(
                    `${usr}すでに投票したでしょう\n` +
                    `まあ、元の投票を取り下げてあげた。`
                );
            }
            else{
                if(i.emoji.id === '850358647171317781')happy ++;
                else angry ++;
                sent.set(usr.id, usr);
            }
            if(happy + angry === mx){
                reacol.stop();
                await channel.send('d');
            }
        });
        await d_brk(avalon.time.voting, channel);
        if(happy + angry !== mx)
            angry = happy + 1;
        if(angry > happy)
            return false;
        return true;
    }catch(err: unknown){
        logger.error(`${err}`);
        return `${err} in vote.ts`;
    }
}
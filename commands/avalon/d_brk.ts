import { Message, TextBasedChannel } from "discord.js";
export async function d_brk(
    time: number, 
    channel: TextBasedChannel,
    fromID: string = `1128045638681100348`,
){
    const self_brk = (m: Message) => (
        m.author.id === fromID && 
        m.content.toLowerCase() === `d`
    );
    const pause = await channel.awaitMessages({
        filter: self_brk,
        time: time,
        max: 1
    });
    const msg = pause.first();
    if(msg !== undefined)await msg.delete(); 
}
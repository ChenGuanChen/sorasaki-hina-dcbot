import { inlineCode } from "discord.js";
export async function time_string(time : number): Promise<string>{
    const set = new Date(time);
    let substr = `${set.getMonth() + 1}/${set.getDate()},`;
    if(set.getHours() < 10)substr += '0';
    substr += `${set.getHours()}:`;
    if(set.getMinutes() < 10)substr += '0';
    substr += `${set.getMinutes()}:`;
    if(set.getSeconds() < 10)substr += '0';
    substr += `${set.getSeconds()}`;
    substr = inlineCode(substr);
    return substr;
}
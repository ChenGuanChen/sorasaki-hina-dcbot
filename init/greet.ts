import { TextBasedChannel } from 'discord.js';
import { logger } from '../logger';
import { ExtendedClient } from '../classes/extendedclient';
import { bot } from '../index';
import { config } from '../configs/gen_config';

export async function greet(client: ExtendedClient): Promise<void>{
  try{
    const guild = await client.guilds.fetch(config.guildId);
    if(guild === null || guild.id !== config.guildId)
      throw `null guild`;
    const user = await guild.members.fetch(config.AllowedID[0]);
    const dm = await user .createDM();
    if(!bot.in_use){
      let ans: string =`${user.user}\n`;
      ans += `先生、おはよう\n`;
      await dm.send(ans);
    }
    else{
      await dm.send('zzz');
    }
  }catch(error: unknown){
    logger.error(`${error}`);
    return;
  }
}
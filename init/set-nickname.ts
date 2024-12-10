import {Guild} from 'discord.js';

import {ExtendedClient} from '../classes/extendedclient';
import {config} from '../configs/gen_config';
import {logger} from '../logger';

export async function setNickname(client: ExtendedClient): Promise<void>{
  await client.guilds.cache.forEach(
    async (guild: Guild): Promise<void> => {
      try{
        // console.log(guild.members);
        const self = await guild.members.fetch({user: config.clientId, force: true});
        if(self !== null){
          await self.setNickname(config.nickname);
          logger.log(`Nickname had changed in guild: ${guild.name}`);
        }
        else
          logger.error(`Execution error at changing nickname in guild: ${guild.name}`);
      }catch(error: unknown){
        logger.error(`Unknown execution error in function "setNickname".`);
      }
    }
  );
  logger.log(`All nicknames have been changed.`)
}
import {REST, Routes} from 'discord.js';

import {config} from '../configs/gen_config';
import {logger} from '../logger';

function isArray<T>(data: unknown): data is Array<T>{
  return (data as Array<T>).length !== undefined;
}

export async function registerCommands(commands: Array<string>): Promise<number>{
  const rest = new REST().setToken(config.token);
  try{
    const data = await rest.put(
      Routes.applicationCommands(config.clientId),
      {body: commands},
    );
    if(!isArray(data)) throw Error();
    return data.length;
  }catch(error: unknown){
    logger.error(`Type error in function "registerCommands"`);
    return -1;
  }
}
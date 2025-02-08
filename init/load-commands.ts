import path from 'path';
import {readdirSync} from 'fs';

import {ExtendedClient} from '../classes/extendedclient';
import {logger} from '../logger';

export async function loadCommands(client: ExtendedClient): Promise<Array<string>>{
  const foldersPath = path.join(__dirname, '../commands');
  const commandFolders = readdirSync(foldersPath);
  const commands: Array<string> = [];
  for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandsFiles = path.basename(__filename).endsWith('.ts')
                        ? readdirSync(commandsPath).filter(file => file.endsWith('.ts'))
                        : readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for(const file of commandsFiles){
      const filePath = path.join(commandsPath, file);
      const data = await import(filePath);
      if(data.command !== undefined){
        client.commands.set(data.command.name, data.command);
        commands.push(data.command.build().toJSON());
      }else
        logger.warning(`The command at ${filePath} is missing required properties.`);
    }
  }
  return commands;
}

import {
  Client,
  Collection,
  ClientOptions,
} from 'discord.js';
import {Command} from './command'
import {config} from '../configs/gen_config'

export function isExtendedClient(client: Client): client is ExtendedClient{
  return (client as ExtendedClient).commands !== undefined;
}

export class ExtendedClient extends Client{
  public commands: Collection<string, Command>;
  public channel_used: Map<string, boolean>;
  public in_use: boolean;
  constructor(
    opts: ClientOptions, 
    cmds = new Collection<string, Command>(),
    using = new Map<string, boolean>(),
  ){
    super(opts);
    this.commands = cmds;
    this.channel_used = using;
    this.in_use = config.maintaining;
  }
};
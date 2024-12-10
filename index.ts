import { Events, GatewayIntentBits } from 'discord.js';

import { MongoClient } from 'mongodb';

//  Global config
import { config } from './configs/gen_config';
import { format } from './interfaces/mongo-format';

//  Classes
import { ExtendedClient } from './classes/extendedclient'

//  Initialization functions
import { setNickname } from './init/set-nickname';
import { loadCommands } from './init/load-commands';
import { registerCommands } from './init/register-commands';
import { greet } from './init/greet';
import { checkeronline } from './init/checker';

//  Event-handling functions
import { handleCommands } from './events/handle-commands';
import { HandlePictures } from './events/handle-pics';

//  Sub-services
import { logger } from './logger';

const client = new ExtendedClient({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
  ] 
});

const auth: string = `${config.mongodb.user}:${config.mongodb.pass}`;
const server: string = `${config.mongodb.host}:${config.mongodb.port}`;
const url: string = `mongodb://${auth}@${server}/${config.mongodb.dbname}`;
const mongo = new MongoClient(url);
async function mongoConnect(){
  try{
    await mongo.connect();
    logger.info(`Mongo connected!`);
  }
  catch(err: unknown){
    logger.error(`${err} at connecting mongo`);
  }
}
try{
  mongoConnect();
}catch(err: unknown){
  logger.error(`${err} at index.ts`);
}

// mongo
export const db = mongo.db("hina");

//collections
export const stones = db.collection<format>("stones");
export const affection = db.collection<format>("affection");
export const affection_exp = db.collection<format>("affection_exp");
export const alarm = db.collection<format>("alarm");
export const kuji_cd = db.collection<format>("kuji_cooldown");
export const pat_cd = db.collection<format>("pat_cooldown");
export const mood = db.collection<format>("mood");
export const mood_cd = db.collection<format>("mood_cooldown");
export const buy_cd = db.collection<format>("buy_cooldown");
export const mission = db.collection<format>("mission");
export const mission_cd = db.collection<format>("mission_cooldown");

client.login(config.token);
export const bot = client;

// events
client.on(Events.MessageCreate, HandlePictures);
client.on(Events.InteractionCreate, handleCommands);

client.once(Events.ClientReady, async c => {

  logger.info(`Logged in as ${c.user.tag}`);
  
  await setNickname(client);
  logger.info(`Set nickname as ${config.nickname}`);

  const usr = client.user;
  if(usr === null){
    logger.error(`null client usr!`);
    return;
  }
  usr.setActivity(`ブルーアーカイブ`);
  logger.info(`Activity set successfully!`);

  const commands = await loadCommands(client);
  logger.info(`${commands.length} commands loaded.`);

  const regCmdCnt = await registerCommands(commands);
  logger.info(`${regCmdCnt} commands registered.`);

  logger.info(`Ready!`);

  await greet(client);

  checkeronline(client);
  
});




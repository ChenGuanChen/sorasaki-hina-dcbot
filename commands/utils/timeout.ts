import { 
    CommandInteraction,
    CommandInteractionOptionResolver,
    SlashCommandBuilder,
    TextBasedChannel,
 } from 'discord.js';
import { Command } from '../../classes/command';
import { bot } from '../../index'
import { logger } from '../../logger';
import { config } from '../../configs/gen_config';
import { Affection } from '../../configs/affection';
type CIOR = CommandInteractionOptionResolver;
class Timeout extends Command{
/*****************get*****************/
  get name(){return `timeout`;}
  get description(){
    return `はい、なんでしょうか`;
  }
  get catagory(){return `utils`;}
  get dataname(){return `timeout`;}
  /****************build****************/
  override build(): 
  SlashCommandBuilder | 
  Omit<SlashCommandBuilder,`addSubcommand` | `addSubcommandGroup`>{
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addUserOption( option =>
        option.setName(`誰が刑務所に入るの`)
            .setDescription('target you want to timeout')
            .setRequired(true)
      )
      .addIntegerOption( option =>
        option.setName(`いつまで`)
            .setDescription('the duration (sec, max: 114514')
            .setMinValue(1)
            .setMaxValue(114514)
      )
  }
/***************execute***************/
  async execute(interaction: CommandInteraction): Promise<void>{
    if(bot.in_use && !config.AllowedID.includes(interaction.user.id)){
      await interaction.reply(
        {content: `(ヒナ今は寝てる...)`,
          ephemeral: true }
      );
      return;
    }
    try{
        const guild = await bot.guilds.fetch(config.guildId);
        if(guild === null || guild.id !== config.guildId)
            throw `null guild`;
        const channel = await guild.channels
          .fetch(Affection.channel) as TextBasedChannel;
        if(channel == null || channel.id !== Affection.channel)
            throw `null channel`;
        const req_id = interaction.user.id;
        const req_role = (await guild.members.fetch(req_id)).roles.highest;
        let req_num: number = 85;
        if(req_role.name === `Member`)req_num = 0;
        else if(req_role.name === `bots`)req_num = 1;
        else if(req_role.name === `Moderator`)req_num = 2;
        else req_num = 3;
        const tar_us = (interaction.options as CIOR).getUser(`誰が刑務所に入るの`);
        if(!tar_us)throw `null target!`;
        const tar_id = tar_us.id;
        const tar = (await guild.members.fetch(tar_id));
        const tar_role = tar.roles.highest;
        const bot_role = (await guild.members.fetch(`1128045638681100348`)).roles.highest;
        let tar_num: number = 85;
        if(tar_role.name === `Member`)tar_num = 0;
        else if(tar_role.name === `bots`)tar_num = 1;
        else if(tar_role.name === `Moderator`)tar_num = 2;
        else tar_num = 3;
        const isbot = (await guild.members.fetch(tar_id)).user.bot;
        let chk = true;
        let str: string = '';
        if(req_num < tar_num || req_num < 1){
            chk = false;
            str += `先生の権限が足りないみたい。`;
        }
        else if(isbot || tar_num === 3){
            chk = false;
            str += `私そんな権限がない`;
        }
        if(!chk){
            await interaction.reply(str);
            return;
        }
        const duration = (interaction.options as CIOR)
            .getInteger(`いつまで`) ?? 10 * 60;
        await tar.timeout(duration * 1000);
        if(tar.isCommunicationDisabled()){
            await interaction.reply(`${tar_us}の刑期が ${duration}s になりました。`);
        }
        else{
            await interaction.reply(`${tar_us}が逮捕されました。`)
        }
    }catch(err: unknown){
        logger.error(`${err}`);
        if(interaction.replied)await interaction.editReply(`${err}`);
        else await interaction.reply(`${err}`);
        return;
    }
  }
};

export const command = new Timeout();

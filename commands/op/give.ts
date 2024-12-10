import { 
    CommandInteraction,
    CommandInteractionOptionResolver,
    SlashCommandBuilder,
    TextBasedChannel,
 } from 'discord.js';
import { Command } from '../../classes/command';
import { bot, stones } from '../../index'
import { logger } from '../../logger';
import { config } from '../../configs/gen_config'; 
import { Affection } from '../../configs/affection'; 
type CIOR = CommandInteractionOptionResolver;
class Give extends Command{
/*****************get*****************/
  get name(){return `give`;}
  get description(){
    return `非常手段だ`;
  }
  get catagory(){return `utils`;}
  get dataname(){return `give`;}
  /****************build****************/
  override build(): 
  SlashCommandBuilder | 
  Omit<SlashCommandBuilder,`addSubcommand` | `addSubcommandGroup`>{
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addUserOption( option =>
        option.setName(`誰にあげる`)
            .setDescription('target you want to give stones')
            .setRequired(true)
      )
      .addIntegerOption( option =>
        option.setName(`いくつ`)
            .setDescription('the quantity')
            .setRequired(true)
      )
  }
/***************execute***************/
  async execute(interaction: CommandInteraction): Promise<void>{
    if(!config.AllowedID.includes(interaction.user.id)){
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
        const tar_us = (interaction.options as CIOR).getUser(`誰にあげる`);
        if(!tar_us)throw `null target!`;
        const tar_id = tar_us.id;
        const quantity = (interaction.options as CIOR).getInteger(`いくつ`);
        if(!quantity)throw `null quantity!`;
        await stones.updateOne(
          {userid: tar_id},
          {
            $inc:{
              value: quantity
            }
          },
          {upsert: true}
        )
        await interaction.reply(`${tar_us}の宝石が ${quantity}個増えた`);
    }catch(err: unknown){
        logger.error(`${err}`);
        if(interaction.replied)await interaction.editReply(`${err}`);
        else await interaction.reply(`${err}`);
        return;
    }
  }
};

export const command = new Give();

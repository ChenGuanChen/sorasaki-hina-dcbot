import { 
    CommandInteraction,
    CommandInteractionOptionResolver,
    SlashCommandBuilder,
    TextBasedChannel,
 } from 'discord.js';
import { Command } from '../../classes/command';
import { bot, db } from '../../index'
import { logger } from '../../logger';
import { config } from '../../configs/gen_config'; 
import { Affection } from '../../configs/affection';
import { format } from '../../interfaces/mongo-format'; 
type CIOR = CommandInteractionOptionResolver;
class Give extends Command{
/*****************get*****************/
  get name(){return `clear`;}
  get description(){
    return `非常手段だ`;
  }
  get catagory(){return `utils`;}
  get dataname(){return `clearcd`;}
  /****************build****************/
  override build(): 
  SlashCommandBuilder | 
  Omit<SlashCommandBuilder,`addSubcommand` | `addSubcommandGroup`>{
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addUserOption( option =>
        option.setName(`誰を優先に助ける`)
            .setDescription('target you want to clear cd')
            .setRequired(true)
      )
      .addStringOption( option =>
        option.setName(`何の`)
            .setDescription('target cd you want to clear')
            .setRequired(true)
            .addChoices(
          { name: 'buy_cooldown', value: 'buy_cooldown' },
          { name: 'pat_cooldown', value: 'pat_cooldown' },
				  { name: 'kuji_cooldown', value: 'kuji_cooldown' },
				  { name: 'mission_cooldown', value: 'mission_cooldown' },
		    )
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
        const tar_us = (interaction.options as CIOR).getUser(`誰を優先に助ける`);
        if(!tar_us)throw `null target!`;
        const tar_id = tar_us.id;
        const cd = (interaction.options as CIOR).getString(`何の`);
        if(!cd)throw `null cd!`;
        const col = db.collection<format>(cd);
        await col.deleteOne({userid: tar_id})
        await interaction.reply(`${tar_us}の${cd}をクリアした`);
    }catch(err: unknown){
        logger.error(`${err}`);
        if(interaction.replied)await interaction.editReply(`${err}`);
        else await interaction.reply(`${err}`);
        return;
    }
  }
};

export const command = new Give();

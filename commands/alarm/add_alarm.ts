import { 
    CommandInteraction,
    CommandInteractionOptionResolver, 
    SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../classes/command';
import { logger } from '../../logger';
import { bot, alarm } from '../../index'
import { config } from '../../configs/gen_config'
import { valid } from '../../function/date_valid'
type CIOR = CommandInteractionOptionResolver;

class Add_alarm extends Command{
  get name(){return `alarm`;}
  get description(){return `ヒナ～ちょっと手伝ってくれる？`;}
  get catagory(){return `alarm`;}
  get dataname(){return `add_alarm`;}
  /****************build****************/
  override build(): 
  SlashCommandBuilder | 
  Omit<SlashCommandBuilder,`addSubcommand` | `addSubcommandGroup`>{
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addIntegerOption( option =>
        option.setName(`年`)
            .setDescription('year')
            .setMinValue(2023)
        )
      .addIntegerOption( option =>
        option.setName(`月`)
            .setDescription('month')
            .setMaxValue(12)
            .setMinValue(1)
        )
      .addIntegerOption( option =>
        option.setName(`日`)
            .setDescription('date')
            .setMinValue(1)
            .setMaxValue(31)
        )
      .addIntegerOption( option =>
        option.setName(`時`)
            .setDescription('hour')
            .setMinValue(0)
            .setMaxValue(23)
        )
      .addIntegerOption( option =>
        option.setName(`分`)
            .setDescription('minute')
            .setMinValue(0)
            .setMaxValue(59)
        )
  }
  async execute(interaction: CommandInteraction): Promise<void>{
    if(bot.in_use && !config.AllowedID.includes(interaction.user.id)){
      await interaction.reply(
        {content: `(ヒナ今は寝てる...)`,
          ephemeral: true }
      );
      return;
    }
    try{
        await interaction.reply(`( サラサラ... )`);
        const time = new Date();
        const year = (interaction.options as CIOR).getInteger('年') ?? 
          time.getFullYear();
        const month = (interaction.options as CIOR).getInteger('月')  ??
          time.getMonth() + 1;
        const date = (interaction.options as CIOR).getInteger('日') ??
          time.getDate();
        const hour = (interaction.options as CIOR).getInteger('時') ??
          time.getHours();
        const minute = (interaction.options as CIOR).getInteger('分') ??
          time.getMinutes();
        const exist = await valid(year, month, date);
        if(!exist){
          await interaction.reply(`ん？`);
          return;
        }
        const set_time = new Date(year, month - 1, date, hour, minute).getTime();
        const id = interaction.user.id;
        await alarm.updateOne(
          {userid: id},
          {
            $set:{
              userid: id,
              value: set_time,
            }
          },
          {upsert: true}
        );
        await interaction.editReply(`うん、その時先生に声掛けるね`);
    }catch(err: unknown){
      logger.error(`${err}`);
      if(interaction.replied)await interaction.editReply(`${err}`);
      else await interaction.reply(`${err}`);
      return;
    }
  }
};

export const command = new Add_alarm();
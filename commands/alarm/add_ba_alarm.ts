import { 
    CommandInteraction,
    CommandInteractionOptionResolver, 
    SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../classes/command';
import { logger } from '../../logger';
import { bot, alarm } from '../../index'
import { config } from '../../configs/gen_config'
type CIOR = CommandInteractionOptionResolver;

class Add_ba_alarm extends Command{
  get name(){return `reminder`;}
  get description(){return `ヒナ～休みたいよ～`;}
  get catagory(){return `alarm`;}
  get dataname(){return `add_ba_alarm`;}
  /****************build****************/
  override build(): 
  SlashCommandBuilder | 
  Omit<SlashCommandBuilder,`addSubcommand` | `addSubcommandGroup`>{
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addIntegerOption( option =>
        option.setName(`残った体力は`)
            .setDescription('how many stamina are left')
            .setRequired(true)
            .setMaxValue(300)
            .setMinValue(0)
        )
      .addIntegerOption( option =>
        option.setName(`最大体力は`)
            .setDescription('stamina maximum')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(300)
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
        const cur_time = new Date().getTime();
        const cur_sta = (interaction.options as CIOR).getInteger('残った体力は');
        const max_sta = (interaction.options as CIOR).getInteger('最大体力は');
        if(max_sta === null || cur_sta === null)throw `ん？`;
        const set_time = (max_sta - cur_sta) * 360000;
        const id = interaction.user.id;
        let chk = false;
        await alarm.updateOne(
          {userid: id},
          {
            $set:{
              userid: id,
              value: cur_time + set_time,
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

export const command = new Add_ba_alarm();
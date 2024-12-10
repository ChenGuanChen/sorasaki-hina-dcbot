import { 
    CommandInteraction,
    SlashCommandBuilder,
    CommandInteractionOptionResolver,
 } from 'discord.js';
import { Command } from '../../classes/command';
import { details } from '../../data/instruct';
import { bot } from '../../index'
type CIOR = CommandInteractionOptionResolver;
class Help extends Command{
/*****************get*****************/
  get name(){return `help`;}
  get description(){
    return `先生、何を聞きたい？`;
  }
  get catagory(){return `utils`;}
  get dataname(){return `help`;}
  /****************build****************/
  override build(): 
  SlashCommandBuilder | 
  Omit<SlashCommandBuilder,`addSubcommand` | `addSubcommandGroup`>{
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addStringOption( option =>
        option.setName(`何がわからないの`)
            .setDescription('target command you want to check its details')
            .setRequired(true)
            .addChoices(
          { name: 'buy', value: 'buy' },
          { name: 'event', value: 'event' },
          { name: 'action', value: 'action' },
				  { name: 'alarm', value: 'alarm' },
				  { name: 'reminder', value: 'reminder' },
				  { name: 'check', value: 'check' },
				  { name: 'gacha >10', value: 'lot size gahca' },
				  { name: 'gacha <=10', value: 'continuable gacha' },
				  { name: 'shoot', value: 'shoot' },
				  { name: 'work', value: 'work' },
          { name: 'draw', value: 'draw' },
				  { name: 'pfp', value: 'pfp' },
          { name: 'help', value: 'help' },
          { name: 'now', value: 'now' },
				  { name: 'ping', value: 'ping' },
				  { name: 'status', value: 'status' },
				  { name: 'timeout', value: 'timeout' },
		    )
      );
  }
/***************execute***************/
  async execute(interaction: CommandInteraction): Promise<void>{
    if(bot.in_use){
      await interaction.reply(
        {content: `(ヒナ今は寝てる...)`,
          ephemeral: true }
      );
      return;
    }
    const cmd = (interaction.options as CIOR).getString('何がわからないの');
    if(cmd === null)return;
    await interaction.reply({content: `${details.get(cmd)}`, ephemeral: true});
  }
};

export const command = new Help();

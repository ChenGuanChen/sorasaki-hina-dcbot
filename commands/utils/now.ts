import { CommandInteraction } from 'discord.js';
import { Command } from '../../classes/command';
import { bot } from '../../index'

class Now extends Command{
  get name(){return `now`;}
  get description(){return `ヒナ、ちょっといい`;}
  get catagory(){return `utils`;}
  get dataname(){return `now`;}
  async execute(interaction: CommandInteraction): Promise<void>{
    if(bot.in_use){
      await interaction.reply(
        {content: `(ヒナ今は寝てる...)`,
          ephemeral: true }
      );
      return;
    }
    if(bot.channel_used.get(interaction.channelId))
      await interaction.reply({ content: `ちょっと待ってて、忙しいから。。。`, ephemeral: true });
    else
      await interaction.reply({ content: `うん、なに`, ephemeral: true });
  }
};

export const command = new Now();

import {
  SlashCommandBuilder,
  CommandInteraction
} from 'discord.js';

export interface Component{
  execute(interaction: unknown): Promise<void>;
  build(): unknown;
};

export abstract class Command implements Component{
  abstract get name(): string;
  abstract get description(): string;
  abstract get catagory(): string;
  abstract get dataname(): string;
  abstract execute(interaction: CommandInteraction): Promise<void>;
  build(): 
    SlashCommandBuilder | Omit<
      SlashCommandBuilder, 
      `addSubcommand` | `addSubcommandGroup`
    >{
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }
};
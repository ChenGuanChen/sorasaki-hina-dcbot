import { Collection, CommandInteraction, Message, User } from 'discord.js';
import { logger } from '../../logger'
import { avalon } from '../../configs/avalon';
export async function gather(interaction: CommandInteraction): Promise<Collection<string, User> | null>{
    try{
      await interaction.reply(`waiting...`);
      const init = new Date().getTime();
      const col = new Collection<string, User>();
      const usr = interaction.user;
      const guild = interaction.guild;
      if(guild === null)throw `null guild`;
      const channel= interaction.channel;
      if(channel === null)throw `null channel`;
      const enroll = await guild.roles.fetch(`1153240766194405376`);
      if(enroll === null)throw `null role`;
      await channel.send(`${enroll}`);
      let str = 'プレーヤー(Player):\n';
      col.set(usr.id, usr);
      str += `${col.size}. ${usr.username}\n`;
      await interaction.editReply(str + 
        `j: 参加\n` +
        `s: 募集停止\n` +
        `q: ゲームやめる`
      );
      const fil = (m:Message) => (
        (
          !col.has(m.author.id) &&
          m.content.toLowerCase() === 'j'
        ) ||
        (
          m.author.id === usr.id &&
          (
            m.content.toLowerCase() === 's' ||
            m.content.toLowerCase() === 'q'
          )
        )
      );
      let run = true;
      while(run){
        const rec = await channel.awaitMessages({filter: fil, max: 1, time: 5000});
        const msg = rec.first();
        if(msg !== undefined){
            const newbie = msg.author;
            const cont = msg.content;
            await msg.delete();
            if(cont.toLowerCase() === 's')break;
            if(cont.toLowerCase() === 'q')return null;
            col.set(newbie.id, newbie);
            str += `${col.size}. ${newbie.username}\n`;
            await interaction.editReply(str + 
              `j: 参加\n` +
              `s: 募集停止\n` +
              `q: ゲームやめる`
            );    
        }
        if(col.size >= 10)run = false;
        const cur = new Date().getTime();
        if(cur - init > avalon.time.waiting_player)run = false;
      }
      if(col.size < 5){
        await interaction.editReply(`人数が足りないみたい...`);
        return null;
      }
      await interaction.editReply(`プレーヤーが ${col.size} 人集まった！`);
      return col;
    }catch(err: unknown){
      logger.error(`${err}`);
      if(interaction.replied)await interaction.editReply(`${err}`);
      else await interaction.reply(`${err}`);
      return null;
    }
}
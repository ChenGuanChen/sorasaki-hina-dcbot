import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message,
  SlashCommandBuilder,
  SlashCommandStringOption,
  TextBasedChannel,
} from 'discord.js';
import { Command } from '../../classes/command';
import { gacha } from '../../configs/gacha';
import { gachadata } from '../../interfaces/pool-data';
import { config } from '../../configs/gen_config';
import { logger } from '../../logger';
import { studentBook } from '../../data/studentdata'
import { setTimeout } from 'node:timers/promises'
import { bot } from '../../index'
import { Fakerand, sinrand } from '../../function/rand'
import { able } from '../../function/permission'

type CIOR = CommandInteractionOptionResolver;

function setChoices(): SlashCommandStringOption{
  let option = new SlashCommandStringOption;
  option.setName('どれにしようかな');
  option.setDescription('which pickup');
  for(const choice of gacha.Pool)option.addChoices(choice);
  return option;
}

class BA_Gacha extends Command{
  get name(){return `gacha`;}
  get description(){
    return `ブルーアーカイブ`;
  }
  get catagory(){return `gacha`;}
  get dataname(){return `gacha`;}
  override build(): 
  SlashCommandBuilder | 
  Omit<SlashCommandBuilder,`addSubcommand` | `addSubcommandGroup`>{
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addIntegerOption(option =>
        option.setName('何回にしようかな')
              .setDescription('draws you want to draw, 1 ~ 10000, default: 10')
              .setMinValue(1)
              .setMaxValue(10000)
      )
      .addStringOption(setChoices());
  }
  async execute(interaction: CommandInteraction): Promise<void>{
    const guild = await bot.guilds.fetch(config.guildId);
    if(guild === null || guild.id !== config.guildId){
      const str = `null guild`;
      logger.error(str);
      if(interaction.replied)await interaction.editReply(str);
      else await interaction.reply(str);
    }
    const channel = await guild.channels
      .fetch(gacha.channel) as TextBasedChannel;
    if(channel == null || channel.id !== gacha.channel){
      const str = `null channel`;
      logger.error(str);
      if(interaction.replied)await interaction.editReply(str);
      else await interaction.reply(str);
    }
    let check = await able(interaction, `ガチャ`, channel);
    if(!check)return; 
    bot.channel_used.set(interaction.channelId, true);
    const start_time = new Date().getTime();
    /***************sendgif***************/
    await interaction.reply(
      `${config.httpServer.urlBase}/gif/hit.gif` +
      `\n` +
      `loading!`
    );
    /****************init1****************/
    //times
    //pool
    //end
    //ans
    //target
    const times = (interaction.options as CIOR).getInteger('何回にしようかな') ?? 10;
    const pool = (interaction.options as CIOR).getString('どれにしようかな') ?? 'norm';
    let end: Message;
    let target: gachadata = {
      name: `norm`,
      pk: undefined,
      semi_pk: undefined,
      non_pk: undefined,
    };
    /**************setTarget**************/
    try{
      for(const search of gacha.Pickup)
        if(search.name === pool)
          target = search;
      if(target.name !== `norm`
          && target.pk === undefined)
        throw "no pk!can't be loaded.";
      if(target.name.startsWith(`fes`)
          && target.semi_pk === undefined)
        throw "no semi_pks!can't be loaded.";
    }catch(err: unknown){
      await interaction.editReply(`${err}`);
      logger.error(`${err}`);
      bot.channel_used.delete(interaction.channelId);
      return;
    }
    /****************init2****************/
    //star1 ~ 3
    //fes
    //star3book
    const fes = new Map();
    for(const search of studentBook.fes)fes.set(search[0],search[1]);
    const star1 = new Map();
    for(const search of studentBook.star1)star1.set(search[0],search[1]);
    const star2 = new Map();
    for(const search of studentBook.star2)star2.set(search[0],search[1]);
    const star3 = new Map();
    for(const search of studentBook.star3)star3.set(search[0],search[1]);
    const star3book = new Array<Array<string>>;
    for(const search of studentBook.star3){
      if(target.pk !== undefined && search[0] !== target.pk){
        star3book.push([search[0],search[1]]);
      }
      else if(target.pk === undefined){
        star3book.push([search[0],search[1]]);
      }
    }
    /****************pk****************/
    if(target.pk !== undefined && !target.pk.endsWith(`fes`)){
      const cur = star3.get(target.pk);
      fes.set(target.pk,cur as string);
      star3.delete(target.pk);
    }
    /****************nonpk****************/
    if(target.non_pk !== undefined){
      for(const search of target.non_pk){
        if(search.endsWith(`fes`)){
          const cur = fes.get(search);
          if(cur !== undefined){
            star3.set(search,cur);
          }
        }
      }
    }
    /***************VER:>10***************/
    if(times > 10){
      let ans: string = '';
      let pickup: number = 0;
      const res: number[] = [0, 0, 0];
      let rate: number = 1;
      let haspk: number = 1;
      if(pool.startsWith(`fes`))rate = 2;
      if(pool === `norm`)haspk = 0;
      const semi_pickup: number[] = [];
      let semi_sz: number = 0;
      if(target.semi_pk !== undefined){
        semi_sz = target.semi_pk.length;
        for(let i = 0; i < semi_sz; i++)
          semi_pickup.push(0);
      }
      const non_pickup: number[] = [];
      let non_sz: number = 0;
      if(target.non_pk !== undefined){
        non_sz = target.non_pk.length;
        for(let i = 0; i < non_sz; i++)
          non_pickup.push(0);
      }
      /*************gen*************/
      const result: number[] = [];
      await Fakerand(times, result);
      for(let i = 0; i < result.length; i++){
        /*************10th************/
        if((i + 1)% 10 == 0){
          if(result[i] <= 0.007 * haspk )pickup++;
          else if(semi_sz > 0 && 
            result[i] <= 0.007 + 0.003 * semi_sz){
            semi_pickup[await sinrand(semi_sz - 1)]++;
          }
          else if(non_sz > 0 && 
            result[i] <= 0.007 + (0.03 * rate - 0.007) / star3.size * non_sz){
            non_pickup[await sinrand(non_sz - 1)]++;
          }
          else if(result[i] <= 0.03 * rate)res[0]++;
          else res[1]++;
        }
        /************1~9th************/
        else{
          if(result[i] <= 0.007 * haspk)pickup++;
          else if(semi_sz > 0 
            && result[i] <= 0.007 + 0.003 * semi_sz){
            semi_pickup[await sinrand(semi_sz - 1)]++;
          }
          else if(non_sz > 0 && 
            result[i] <= 0.007 + (0.03 * rate - 0.007) / star3.size * non_sz){
            non_pickup[await sinrand(non_sz - 1)]++;
          }
          else if(result[i] <= 0.03 * rate)res[0]++;
          else if(result[i] <= 0.03 * rate + 0.185)res[1]++;
          else res[2]++;
        }
      }      
      /*************check***********/
      let count: number = 0;
      try{
        count = pickup +
          res[0] + res[1] + res[2];
        for(const comp of semi_pickup)count += comp;
        for(const comp of non_pickup)count += comp;
        if(count !== times)
          throw `times isn't right! mising ${times - count}`;
      }catch(err:unknown){
        await channel.send(`${err}`);
        logger.error(`${err}`);
        bot.channel_used.delete(interaction.channelId);
        return;
      }
      /**************ans************/
      let three: number = count - res[2] - res[1];
      ans += `ガチャ${result.length}回の結果は、\n`;
      if(target.pk !== undefined){
        ans += `${fes.get(target.pk)}` + `  x${pickup}\n`;
      }
      if(target.semi_pk !== undefined){
        let cur: number = 0;
        for(const search of target.semi_pk){
          ans += `${fes.get(search)}` + `  x${semi_pickup[cur]}\n`;
          cur++;
        }
      }
      if(target.non_pk !== undefined){
        let cur: number = 0;
        for(const search of target.non_pk){
          if(search.endsWith(`fes`))ans += `${fes.get(search)}` + `  x${non_pickup[cur]}\n`;
          else ans += `${star3.get(search)}` + `  x${non_pickup[cur]}\n`;
          cur++;
        }
      }
      if(target.pk !== undefined)ans += `  +\n`;
      ans += `天井x${Math.floor(times/200)}\n`;
      ans += `<:rain:1134552704086184066>  x${three}\n`;
      ans += `<:gold:1134552707642949732>  x${res[1]}\n`;
      ans += `<:blue:1134552709685592196>  x${res[2]}\n`;
      ans += `確率は ${Math.floor(three / times * 1000000) /10000} %\n`;
      ans += `<:stone:1135016872950116485> ${times * 120}個が`;
      ans += `<:megami:1135016875978399855> ${50 * three + 10 * res[1] + res[2]}個`;
      ans += `になりました`
      /*************output**********/
      await setTimeout(3000);
      end = await interaction.editReply(ans);      
    }
    /***************VER:<=10**************/
    else{
      await setTimeout(3000);
      const fir_msg = await interaction.editReply(`ドキドキ...`);
      let run = 1;
      let sum = 0;
      let pickup: number = 0;
      const res: number[] = [0, 0, 0];
      let rate: number = 1;
      let haspk: number = 1;
      if(pool.startsWith(`fes`))rate = 2;
      if(pool === `norm`)haspk = 0;
      const semi_pickup: number[] = [];
      let semi_sz: number = 0;
      if(target.semi_pk !== undefined){
        semi_sz = target.semi_pk.length;
        for(let i = 0;i < semi_sz; i++)
          semi_pickup.push(0);
      }
      const non_pickup: number[] = [];
      let non_sz: number = 0;
      if(target.non_pk !== undefined){
        non_sz = target.non_pk.length;
        for(let i = 0; i < non_sz; i++)
          non_pickup.push(0);
      }
      while(run > 0){
        let ans: string = '';
        sum += times;
        /*************gen*************/
        const result: number[] = [];
        await Fakerand(times, result);
        for(let i = 0; i < result.length; i++){
          /*************10th************/
          if((i + 1)% 10 == 0){
            if(result[i] <= 0.007 * haspk ){
              pickup ++;
              if(target.pk !== undefined && target.pk.endsWith(`fes`))ans += `${fes.get(target.pk)}`;
              else if(target.pk !== undefined && !target.pk.endsWith(`fes`))ans += `${star3.get(target.pk)}`;
            }
            else if(semi_sz > 0 && 
              result[i] <= 0.007 + 0.003 * semi_sz){
              if(target.semi_pk !== undefined){
                const ran = await sinrand(semi_sz - 1);
                ans += `${fes.get(target.semi_pk[ran])}`;
                semi_pickup[ran] ++;
              }
            }
            else if(non_sz > 0 && 
              result[i] <= 0.007 + (0.03 * rate - 0.007) / star3.size * non_sz){
              if(target.non_pk !== undefined){
                const ran = await sinrand(non_sz - 1);
                try{
                  if(ran < 0 || ran >= target.non_pk.length)throw "strange place"
                }catch(err:unknown){
                  await channel.send(`${err}`);
                  logger.error(`${err}`);
                  bot.channel_used.delete(interaction.channelId);
                  return;
                }
                const out = target.non_pk[ran];
                if(out.endsWith(`fes`))ans += `${fes.get(out)}`;
                else ans += `${star3.get(out)}`;
                non_pickup[ran] ++;
              }
            }
            else if(result[i] <= 0.03 * rate){
              const s3_sz: number = star3book.length;
              let ran = await sinrand(s3_sz - 1);
              const search: string = star3book[ran][0];
              ans += `${star3.get(search)}`;
              res[0] ++;
            }
            else{
              const s2_sz: number = studentBook.star2.length;
              const search: string = studentBook
                .star2[await sinrand(s2_sz - 1)][0];
              ans += `${star2.get(search)}`;
              res[1] ++;
            }
          }
          /************1~9th************/
          else{
            if(result[i] <= 0.007 * haspk ){
              pickup ++;
              if(target.pk !== undefined)ans += `${fes.get(target.pk)}`;
            }
            else if(semi_sz > 0 && 
              result[i] <= 0.007 + 0.003 * semi_sz){
              if(target.semi_pk !== undefined){
                const ran = await sinrand(semi_sz - 1);
                ans += `${fes.get(target.semi_pk[ran])}`;
                semi_pickup[ran] ++;
              }
            }
            else if(non_sz > 0 && 
              result[i] <= 0.007 + (0.03 * rate - 0.007) / star3.size * non_sz){
              if(target.non_pk !== undefined){
                const ran = await sinrand(non_sz - 1);
                const out = target.non_pk[ran];
                if(out.endsWith(`fes`))ans += `${fes.get(out)}`;
                else ans += `${star3.get(out)}`;
                non_pickup[ran] ++;
              }
            }
            else if(result[i] <= 0.03 * rate){
              const s3_sz: number = star3book.length;
              let ran = await sinrand(s3_sz - 1);
              const search: string = star3book[ran][0];
              ans += `${star3.get(search)}`;
              res[0] ++;
            }
            else if(result[i] <= 0.03 * rate + 0.185){
              const s2_sz: number = studentBook.star2.length;
              const search: string = studentBook
                .star2[await sinrand(s2_sz - 1)][0];
              ans += `${star2.get(search)}`;
              res[1] ++;
            }
            else{
              const s1_sz: number = studentBook.star1.length;
              const search: string = studentBook
                .star1[await sinrand(s1_sz - 1)][0];
              ans += `${star1.get(search)}`;
              res[2] ++;
            }
          }
          if((i + 1)% 5 == 0)ans += '\n';  
        }
        /************output***********/
        await channel.send(`今回ガチャの結果は、\n`);
        const after = await channel.send(ans);
        const rp = await after.reply(`続きますが先生( y / n )`);
        const filter = (m:Message) => (m.author.id === interaction.user.id && (
          m.content === 'y' || 
          m.content === 'n' ||
          m.content === 'Y' || 
          m.content === 'N'  
          ));
        const ncollector = await channel.awaitMessages({ filter, time: 5000, max: 1});
        const msg = ncollector.first();
        if(ncollector.size > 0 && msg !== undefined)await msg.reply(`いいよ、わかった`);
        else{
          await rp.reply(`ん？とりあえず決算に進むね`);
          run = 0;
          break;
        }
        if(msg.content === 'n' || msg.content === 'N'){
          await rp.reply(`じゃ決算に進むね`);
          run = 0;
          break;
        }
        const cur_time = new Date().getTime();
        const passed_time = Math.ceil((cur_time - start_time) / 1000);
        if(passed_time >= 900){
          const msg = await interaction.editReply(`時間だ`)
          await msg.reply(`決算に進むね`);
          run = 0;
          break;
        }
      }
      /*************check***********/
      let count: number = 0;
      try{
        count = pickup +
          res[0] + res[1] + res[2];
        for(const comp of semi_pickup)count += comp;
        for(const comp of non_pickup)count += comp;
        if(count !== sum)
          throw `times isn't right! mising ${sum - count}`;
      }catch(err:unknown){
        await channel.send(`${err}`);
        logger.error(`${err}`);
        bot.channel_used.delete(interaction.channelId);
        return;
      }
      /**************txt************/
      let three: number = count - res[2] - res[1];
      let text: string = '';
      text += `今までガチャ${sum}回の結果は、\n`;
      if(target.pk !== undefined){
        text += `${fes.get(target.pk)}` + `  x${pickup}\n`;
      }
      if(target.semi_pk !== undefined){
        let cur: number = 0;
        for(const search of target.semi_pk){
          text += `${fes.get(search)}` + `  x${semi_pickup[cur]}\n`;
          cur++;
        }
      }
      if(target.non_pk !== undefined){
        let cur: number = 0;
        for(const search of target.non_pk){
          if(search.endsWith(`fes`))text += `${fes.get(search)}` + `  x${non_pickup[cur]}\n`;
          else text += `${star3.get(search)}` + `  x${non_pickup[cur]}\n`;
          cur++;
        }
      }
      if(target.pk !== undefined)text += `  +\n`;
      text += `天井x${Math.floor(sum/200)}\n`;
      text += `<:rain:1134552704086184066>  x${three}\n`;
      text += `<:gold:1134552707642949732>  x${res[1]}\n`;
      text += `<:blue:1134552709685592196>  x${res[2]}\n`;
      text += `確率は ${Math.floor(three / sum * 1000000) /10000} %\n`;
      text += `<:stone:1135016872950116485> ${sum * 120}個が`;
      text += `<:megami:1135016875978399855> ${50 * three + 10 * res[1] + res[2]}個`;
      text += `になりました`
      end = await fir_msg.reply(text);
    }
    await end.reply(`うん、先生結果はどう`);
    /***************pk_undo***************/
    if(target.pk !== undefined && !target.pk.endsWith(`fes`)){
      const cur = fes.get(target.pk);
      star3.set(target.pk,cur as string);
      fes.delete(target.pk);
    }
    /**************nonpk_undo*************/
    if(target.non_pk !== undefined){
      for(const search of target.non_pk){
        if(search.endsWith(`fes`)){
          star3.delete(search);
        }
      }
    }
    bot.channel_used.delete(interaction.channelId);
  }
};

export const command = new BA_Gacha();

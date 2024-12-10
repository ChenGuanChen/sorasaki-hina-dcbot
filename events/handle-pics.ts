import { Message } from "discord.js";
export async function HandlePictures(m: Message){
    let chk = false;
    for(const i of m.attachments){
      const str = i[1].contentType;
      if(str === null)continue;
      if(str.includes('image')){
        chk = true;
        break;
      }
    }
    if(
      !m.author.bot &&
      m.attachments.size > 0 &&
      chk
    ){
      await m.react(`<:happy_mention:850358647171317781>`);
      await m.react(`<:angry_mention:850358998803939398>`);
    }
  }
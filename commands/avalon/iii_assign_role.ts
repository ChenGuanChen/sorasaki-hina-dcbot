import { Collection, TextBasedChannel, User } from 'discord.js';
import { logger } from '../../logger'
import { avalon } from '../../configs/avalon';
import { playerdata } from '../../interfaces/avalon-player';
import { draw } from './add_img';
export async function assign(
    players: Collection<string, User>, 
    arr: Array<number>,
    channel: TextBasedChannel
): Promise<Array<playerdata> | null>{
    try{
      const result = new Collection<string, playerdata>();
      let count = 0;
      for(let i = 0; i < 8; i ++){
        for(let j = 0; j < arr[i]; j ++){
            let pk = players.random(1);
            while(pk[0].id === undefined)pk = players.random(1);
            count ++;
            const tar_png = await draw(0, 0, `/files/game/avalon/cha/${avalon.names[i]}.png`, 116, 183);
            if(tar_png === undefined)throw `undefined png in assigning roles`;
            let data: playerdata = {
                player: pk[0],
                good: (i < 3),
                class: avalon.names[i],
                card: tar_png,
            }
            result.set(pk[0].id, data); 
            players.delete(pk[0].id);   
        }
      }
      const output: Array<playerdata> = [];
      while(result.size > 0){
        let pick = result.random(1);
        while(pick[0] === undefined || pick[0].player.id)
          pick = result.random(1);
        output.push(pick[0]);
        result.delete(pick[0].player.id);
      }
      return output;
    }catch(err: unknown){
      logger.error(`${err}`);
      await channel.send(`${err}`);
      return null;
    }
}
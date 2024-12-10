import { logger } from '../logger'
import { Collection } from 'discord.js';
export async function Fakerand(times : number, result : Array<number>){
    let checkpoint = Math.floor(Math.random() * (times + 1));//the checkpoint
    let luck = Math.random();
    if(luck < 0.5)luck = Math.random() * -1 * 0.2;
    else luck = Math.random() * 1 * 0.2;
    let rule : number = Math.random() + luck;
    let counter: number = 0;
    for(let i = 0; i < times; i ++ ){
      const way :number = Math.random(); // which way will be used this time
      const pass :number = Math.random(); // the rand of passing
      let weather = Math.random(); // if today's weather is good (change luck)
      if(weather < 0.5){
        luck = Math.random();
        if(luck < 0.5)luck = Math.random() * -1 * 0.2;
        else luck = Math.random() * 1 * 0.2;
      }
      if(counter && counter % checkpoint == 0)rule = Math.random() + luck;
      let seed = Math.random();
      if(way >= 0.5){
        if(pass >= rule)result.push(seed);
        else i --;
      }
      else{
        if(pass < rule)result.push(seed);
        else i --;
      }
      counter ++;
    }
}
export async function sinrand(max : number): Promise<number>{
    let rule : number = Math.random();
    for(let i = 0; i < 1; i ++ ){
      const way :number = Math.random(); // which way will be used this time
      const pass :number = Math.random(); // the rand of passing
      let luck = Math.random();
      if(luck < 0.5)rule = Math.random();
      let seed = Math.random();
      if(way >= 0.5){
        if(pass >= rule)return Math.floor(seed * (max + 1));
        else i --;
      }
      else{
        if(pass < rule)return Math.floor(seed * (max + 1));
        else i --;
      }
    }
    return Math.floor(Math.random() * (max + 1));
}
export async function shuffle(four?: number): Promise<Array<number>> {
  try{
    const deck = new Collection<number ,number>();
    let rate = four ?? 1;
    for(let i = 1; i <= 52 * rate; i ++)deck.set(i,i);
    if(deck.size === 0)throw `null deck in generate.shuffle`
    const result: Array<number> = [];
    while(deck.size > 0){
      const draw = deck.random();
      if(draw === undefined) throw `draw undefined in generate.shuffle`
      result.push(draw);
      deck.delete(draw);
    }
    return result;
  }catch(err: unknown){
    logger.error(`${err}`);
    return [];
  }
}

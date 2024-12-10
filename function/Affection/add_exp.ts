import { CommandInteraction } from 'discord.js';
import { affection, affection_exp} from '../../index'
import { format } from '../../interfaces/mongo-format';
import { Affection } from '../../configs/affection' 
import { logger } from '../../logger';

export async function add_exp(
    id: string,
    amount: number,
): Promise<number>{
    try{
        await affection_exp.updateOne(
            {userid: id},
            {
              $inc:{
                value: amount,
              }
            },
            {upsert: true}
        );
        const exp = await affection_exp.findOne<format>(
            {userid: id}
        );
        const lvl = await affection.findOne<format>(
            {userid: id}
        );
        if(!exp)throw 'null affection exp';
        if(!lvl)throw 'null affection lvl';
        let cnt = 0;
        if(exp.value >= 0){
            for(const search of Affection.stage){
                if(exp.value >= Affection.stage[cnt])
                    cnt++;
            }
            await affection.updateOne(
                {userid: id},
                {
                    $set:{
                        value: cnt,
                    }
                },
                {upsert: true},
            );
        }
        else{
            for(const search of Affection.neg_stage){
                if(exp.value < Affection.neg_stage[cnt])
                    cnt++;
            }
            await affection.updateOne(
                {userid: id},
                {
                    $set:{
                        value: -cnt,
                    }
                },
                {upsert: true},
            );
        }
        return 1;
    }catch(err: unknown){
        logger.error(`${err}`);
        return -1;
    }
}
import { CommandInteraction } from 'discord.js';
import { mood, mood_cd} from '../../index'
import { sinrand } from '../rand';
import { logger } from '../../logger';
import { constant } from '../../configs/constants';

export async function cur_mood(
    interaction: CommandInteraction,
    req?: number,
): Promise<number>{
    try{
        const id = interaction.user.id;
        const search = await mood_cd.findOne({userid: id});
        if(search !== null && req === undefined){
            const result = await mood.findOne({userid: id});
            if(result)return result.value;  
        }
        const rand = await sinrand(2);
        await mood.updateOne(
            {userid: id},
            {
                $set: {
                    value: rand,
                }
            },
            {upsert: true}
        );
        const cur = new Date().getTime();
        await mood_cd.updateOne(
            {userid: id},
            {
                $set: {
                    value: cur + constant.hr8,
                }
            },
            {upsert: true}
        );
        const latest = await mood.findOne({userid: id});
        if(latest === null)throw `find nothing!`;
        return latest.value;    
    }catch(err: unknown){
        logger.error(`${err}`);
        return -1;
    }
}
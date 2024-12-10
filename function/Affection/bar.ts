import { 
    CommandInteraction,
    CommandInteractionOptionResolver, 
} from 'discord.js';
import { affection, affection_exp} from '../../index'
import { logger } from '../../logger';
import { format } from '../../interfaces/mongo-format'; 
import { Affection } from '../../configs/affection'; 
type CIOR = CommandInteractionOptionResolver;
export async function bar(interaction: CommandInteraction, opt?: boolean): Promise<string>{
    try{
        let id: string;
        if(opt === false){
            const tar = (interaction.options as CIOR).getUser(`誰の資料を覗く`);
            if(!tar)throw "null tar in bar.ts when true";
            else id = tar.id;
        }
        else id = interaction.user.id;
        const search = await affection.findOne<format>({userid: id});
        const search1 = await affection_exp.findOne<format>({userid: id});
        if(!search){       
            await affection.updateOne(
                {userid: id},
                {
                    $set: {
                        value: 1
                    }
                },
                {upsert: true}
            );    
            await affection_exp.updateOne(
                {userid: id},
                {
                    $set: {
                        value: 0
                    }
                },
                {upsert: true}
            );
        }
        const lvl = search? search.value: 1;
        const exp = search1? search1.value: 0;
        let str = ``;
        if(opt === undefined)str += `[好感度 lv. ${lvl}]:[`;
        else str += `lv. ${lvl}[`;
        let ratio: number;
        if(exp < 0){
            ratio = 
                (exp - Affection.neg_stage[-lvl + 1]) / 
                (Affection.neg_stage[-lvl] - Affection.neg_stage[-lvl + 1]);
        }
        else{
            ratio = 
                (exp - Affection.stage[lvl - 1]) / 
                (Affection.stage[lvl] - Affection.stage[lvl - 1]);
        }
        const percentage = Math.floor(ratio * 100);
        for(let cur = 0; cur < 10; cur ++){
            if(cur < ratio * 10)str += `#`;
            else str += `..`;
        }
        str += `]${percentage}%`;
        return str;           
    }catch(err: unknown){
        logger.error(`${err}`);
        return '';
    }
}
import { CommandInteraction, TextBasedChannel, User } from 'discord.js';
import { Command } from '../../classes/command';
import { bot,} from '../../index';
import { avalon } from '../../configs/avalon';
import { playerdata } from '../../interfaces/avalon-player';
import { logger } from '../../logger';
import { draw } from './add_img';  
import { gather } from './i_gather';
import { decide } from './ii_decide_role';
import { assign } from './iii_assign_role'; 
import { deal } from './iv_deal'; 
import { multichoice, sinchoice } from './v_str_menu';
import { able } from '../../function/permission';
import { vote } from './vi_vote';
import { cup } from './vii_cup';

class Avalon extends Command{

    get name(){return `avalon`;}
    get description(){return `avalon`;}
    get catagory(){return `avalon`;}
    get dataname(){return `main.ts`;}
  
    async execute(interaction: CommandInteraction): Promise<void>{
        const channel = interaction.channel as TextBasedChannel;
        const usr =interaction.user;
        try{      
            const ck = await able(interaction, `アヴァロン`, channel);
            if(!ck) return; //if unavailable
            bot.channel_used.set(interaction.channelId, true);

            //I
            const players = await gather(interaction);
            if(players === null){
                await interaction.editReply(`player.tsにエラー。`);
                return;
            }     
            else await interaction.editReply(`うん、役割の配置設定に進む`);

            //II
            const role = await decide(channel, players.size, usr);
            if(role.length < 1)
                throw `アクティブな放棄またはエラーによる設定停止。`;

            //III
            const order = await assign(players, role, channel);
            if(order === null)
                throw `assign_role.tsにエラー。`;

            //IV
            const dealt = await deal(order, role, channel);
            if(dealt)
                throw dealt;

            //init_msg
            let end = false;
            let cur = 0, success = 0, fail = 0;
            let goddess = order[order.length - 1];
            let order_str = `このゲームのローテーションの順番は以下の通り\n`;
            for(let i = 0; i < order.length; i ++)
                order_str += `${i+1}. ${order[i].player}\n`;
            if(role[8] > 0) 
                order_str = order_str + `今の湖の女神は${goddess.player}に憑依したのだ`;
            await channel.send(order_str);
      
            //decide megami
            const megami: User[] =[];
            megami.push(goddess.player);
      
            //load map
            let new_pic = await draw(0, 0, avalon.map[order.length - 5], 868, 600);
            if(new_pic === undefined)
                throw "add_imgにエラー: loading first map";
            await channel.send({files: [new_pic]});

            /**
            * !!
            * round loop
            * !!
            */
            for(let round = 0; round < 5 && !end; round ++){
                await channel.send(`ラウンド${round + 1}:`);
          
                let temp_pic = await draw(0, 0, '', 868, 600, new_pic);
                if(temp_pic === undefined)
                    throw `undefined temp_pic`;
        
                //assignment pole loop
                
                let out: playerdata[] = [];
                let vf = 0, run = true;
                while(run){
                    let boss = order[cur % order.length];
                    await channel.send(
                        `今${boss.player}がマスター\n` +
                        `このラウンドは候補者${avalon.mission[order.length - 5][round]}` +
                        `名が必要`
                    );
                    
                    //v
                    const tmpout = await multichoice(
                        channel, 
                        boss, 
                        'Candidates', 
                        'ミッションに出る人選んで', 
                        order,
                        avalon.mission[order.length - 5][round]
                    );
                    if(typeof tmpout === 'string')
                        throw tmpout;
                    out = tmpout;
                    
                    //vi
                    const vote_result = await vote(channel, order.length, boss);
                    if(typeof vote_result === 'string')
                        throw vote_result;
                    if(vote_result){
                        await channel.send(
                            `投票結果は承認されたから、これでミッションに出ます`
                        );
                        run = false;
                    }
                    else{
                        await channel.send(
                            `提案は可決されなかったから、もう一度10分以内で話し合って`
                        )
                        temp_pic = await draw(
                            avalon.vtf_pos[vf][0], 
                            avalon.vtf_pos[vf][1],
                            avalon.vote_f,
                            868,
                            600,
                            temp_pic,
                        );
                        if(temp_pic === undefined)
                            throw `temp_pic draw fails in draw_img`;
                        await channel.send({files: [temp_pic]});
                        vf ++, cur ++, out = [];
                        if(vf >= 5)
                            end = true, run = false, fail = 5;
                    }
                }
                if(end)break;
                vf = 0;
                if(out.length !== avalon.mission[order.length - 5][round])
                    throw `任務でるプレーヤーのリストにエラー`;
                await channel.send({files: [new_pic]});
                await channel.send(
                    `じゃ任務を行う\n` +
                    `リストに乗ってる人はDMを見て任務を成功させるかどうかを選択して`
                );

                //vii
                const dcupcnt = await cup(channel, out);
                if(typeof dcupcnt === 'string')
                    throw dcupcnt;
                let pic_add = avalon.mis.suc;
                if(
                    (order.length > 6 && round === 3  && dcupcnt > 1 ) ||
                    (order.length < 7 && round === 3  && dcupcnt > 0 ) ||
                    (round !== 3 && dcupcnt > 0)
                ){
                    pic_add = avalon.mis.fail;
                    fail ++;
                }
                else
                    success ++;
                await channel.send(`このラウンドのミッションが成功したみたい、おめでとう`);
                    new_pic = await draw(
                    avalon.mis_pos[fail + success][0], 
                    avalon.mis_pos[fail + success][1],
                    pic_add,
                    868,
                    600,
                    new_pic,
                );
                if(new_pic === undefined)
                    throw `draw fails in draw_img`;
                await channel.send({files: [new_pic]});
                if(success > 2 || fail > 2){
                    end = true;
                    break;
                }
                if(role[8] && round > 0){
                    const tars = order.filter(
                        (value: playerdata) => (
                            !megami.includes(value.player)
                        )
                    );

                    //v
                    const tar = await sinchoice(
                        channel, goddess,
                        `もうすぐ女神の時間だ\n互いに10分以内で話し合って`,
                        `が調べる対象を決めて\nもし対象を決めたら、いつでも『d』とタイプして知らせて\n`,
                        `今は女神の時間だ、`, `はDMを見て調べる対象を選んで`,
                        `target`, '調べたい対象を選んで', tars, order, 
                        `を対象に選んだ`
                    );
                    if(typeof tar === 'string')
                        throw tar;
                    if(tar.good)await goddess.player.send(`${tar.player}は正義の方だ`);
                    else await goddess.player.send(`${tar.player}は邪悪の方だ`);
                    megami.push(tar.player);
                    goddess = tar;
                    await channel.send(`湖の女神が憑依した対象は${goddess.player}になった`);
                }
            cur ++;
        }
        if(fail > 2){
            const winners = order.filter(
                (value: playerdata) => (
                    !value.good
                )
            );
            let win_str = '';
            for(const search of winners)
                win_str += `${search.player}\n`;
            await channel.send(
                `ゲーム終了、邪悪の勝ち\n` +
                `winners:\n` +
                win_str
            );
        }
        else if(success > 2){
            await channel.send(`ミッションが三回成功したから、`);
            const assassin = order.filter(
                (value: playerdata) => (
                    value.class === `暗殺者 (assassin)`
                )
            )[0];
            const good = order.filter(
                (value: playerdata) => (
                    value.good
                )
            );
            if(role[5] > 0){
                const tar = await sinchoice(
                    channel,
                    assassin,
                    `邪悪な側の人は、5分以内に暗殺対象について話し合って\nあとで`,
                    `が暗殺対象を決めて\nもし対象を決めたら、いつでも『d』とタイプして知らせて\n`,
                    `時間きれだ、`, `はDMを見て暗殺対象を選んで`,
                    `target`, `暗殺したい対象を選んで`,
                    good, order,
                    `を暗殺した！`
                )
                if(typeof tar === 'string')
                    throw tar;
                let win_str = '';
                if(tar.class === 'マーリン (Merlin)'){
                    for(const search of order){
                        if(!good.includes(search))
                            win_str += `${search.player}\n`;
                    }
                    await channel.send(
                        `${tar.player}はマーリン (Merlin)だ！\n` +
                        `マーリン (Merlin)が死んだから、邪悪の勝ち\n` +
                        `winners\n` + win_str
                    );
                }
                else{
                    for(const search of good)
                        win_str += `${search.player}\n`;
                    await channel.send(
                        `${tar.player}はマーリン (Merlin)じゃない\n` +
                        `これによって、正義の勝ち\n` +
                        `winners\n` + win_str
                    );
                }
            }
            else{
                let win_str = '';
                for(const search of good)
                    win_str += `${search.player}\n`;
                await channel.send(
                    `暗殺者 (assassin)がいないから、正義の勝ち\n` +
                    `winners\n` + win_str
                );
            }
            bot.channel_used.delete(interaction.channelId);
        }
        else 
            throw `unexpected result!`;
    }catch(err: unknown){
      const content = `ゲームが失敗した(原因:${err})`;
      logger.error(content);
      await channel.send(content);
    }
  }
};
  
export const command = new Avalon();
  
import { game } from '../configs/poker'
const fee = game.play_crit;
export const details = new Map([
    ["buy",
      `name: Buy\n` +
      `call method: /buy\n` +
      `function: hina's affection + 5\n` +
      `                   stones - 100\n`  +
      `                   --input: no\n`  +
      `                   --public: yes\n` +
      `                   --reply: there are two kinds of replys:\n` + 
      `                                  (1) お金が足りないですか。\n` + 
      `                                         ううん、大丈夫だよ\n` +
      `                                         -- stones  aren't enough\n` +
      `                                  (2) (/////) + affection bar + png\n` +
      `                                         -- succeeded\n` +
      `                   --await interaction: no\n`+
      `                   --cd: 24 hr\n` +
      `                   !! will be cleared out at 4 a.m. everyday !!\n`],
    ["event",
      `name: Event\n` +
      `call method: /event\n` +
      `function: know hina's current mood\n` +
      `                   --input: no\n`  +
      `                   --public: yes\n` +
      `                   --reply: there are three kinds of replys:\n` + 
      `                                  (1) hina in pajama\n` +
      `                                         -- wants to be praised\n` +
      `                                  (2) hina holds your hand\n` +
      `                                         -- wants to date\n` +
      `                                  (3) hina wants nadenade\n` +
      `                                         -- wants nadenade\n` +
      `                   --await interaction: no\n`+
      `                   --cd: 8 hr\n` +
      `                   !! will be cleared out at 4 a.m. everyday !!\n`],
    ["action",
      `name: Action\n` +
      `call method: /action\n` +
      `function: 1/3 chance to gain hina's affection\n` +
      `                   !! will know hina's current mood by /event\n` +
      `                   --input: one out of the three choices\n`  +
      `                   --public: yes\n` +
      `                   --reply: there are two kinds of replys:\n` + 
      `                                  (1) (/////) + affection bar + png\n` +
      `                                         -- succeeded\n` +
      `                                  (2) うん、ありがとう\n` +
      `                                         -- failed\n` +
      `                   --await interaction: no\n`+
      `                   --cd: 8 hr\n` +
      `                   !! will be cleared out at 4 a.m. everyday !!\n`],
    ["alarm",
      `name: add_Alarm\n` +
      `call method: /alarm\n` +
      `function: add a new alarm or update the latest one\n` +
      `                   !!so each person only has one alarm\n` +
      `                   --input: + year\n`  +
      `                                   + month\n`  +
      `                                   + date\n`  +
      `                                   + hour\n`  +
      `                                   + minute\n`  +
      `                                   !!default of the options which are \n`  +
      `                                          left blank is current time\n`  +
      `                                   ex: now is 2023/9/3, 16:40 \n`  +
      `                                          (blank) (blank) (blank) 17 50\n`  +
      `                                           will be 2023/9/3, 17:50\n`  +
      `                   --public: yes\n` +
      `                   --reply: うん、その時先生に声掛けるね\n`  +
      `                                   if succeed\n` +
      `                   --await interaction: no`],
    ["reminder",
      `name: add_BA_Alarm\n` +
      `call method: /reminder\n` +
      `function: add a new BA stamina alarm or update the latest one\n` +
      `                   !!so each person only has one alarm\n` +
      `                   --input: + current remain stamina (1~300)\n`  +
      `                                  + max stamina (1~300)\n`  +
      `                   --public: yes\n` +
      `                   --reply: うん、その時先生に声掛けるね\n`  +
      `                                   if succeed\n` +
      `                   --await interaction: no`],
    ["check",
      `name: file_Preload\n` +
      `call method: /fp\n` +
      `function: check if you have set an alarm\n` +
      `                   --input: not required\n`  +
      `                   --public: yes\n` +
      `                   --reply: there are two kinds of replys:\n` +
      `                                  (1) ここにあったよ先生 + alarm \n` +
      `                                         -- the alarm\n` +
      `                                  (2) 記録がないみたい先生\n` +
      `                                         -- there's no alarm\n` +
      `                   --await interaction: no`],
    ["lot size gahca",
      `name: BA_gacha.lot size gacha\n` +
      `call method: /gacha\n` +
      `function:\n` +
      `--input: + target pool\n`  +
      `                   ~ optional: yes\n`  +
      `                   ~ default: no pickup\n`  +
      `                + times\n`  +
      `                   ! optional: no!! \n`  +
      `                   !! will function as 2. if times isn't input !!\n`  +
      `                   ~ range: 11 ~ 10000 \n`  +
      `--public: yes\n` +
      `--reply: ガチャ (times) 回の結果は、\n` +
      `               (pk)  x (number of drawed pks) .etc\n` +
      `               天井  x (times / 200)\n` +
      `               color  x (number of drawed color) .etc\n` +
      `               確率は (rate of star3) %\n` +
      `               <:stone:1135016872950116485> (1200 * times)個が` +
      `<:megami:1135016875978399855> (number of megamis)個になりました\n` + 
      `--await interaction: no`],
    ["continuable gacha",
    `name: BA_gacha.continuable gacha within 10 draws\n` +
    `call method: /gacha\n` +
    `function:\n` +
    `--input: + target pool\n`  +
    `                   ~ optional: yes\n`  +
    `                   ~ default: no pickup\n`  +
    `                + times\n`  +
    `                   ~ optional: yes \n`  +
    `                   ~ default: 10\n`  +
    `                   !! will function as 1. if times > 10 !!\n`  +
    `                   ~ range: 1 ~ 10\n`  +
    `--public: yes\n` +
    `--reply: + after every (times) draws\n` +
    `                   ~ 今回ガチャの結果は、\n` +
    `                      (student) x (times)\n` +
    `                      続きますが先生( y / n )\n` +
    `                + after receiving interaction\n` +
    `                   ~ if y: いいよ、わかった\n` +
    `                   ~ if n: じゃ決算に進むね\n` +
    `                   ~ if receive nothing: ん？とりあえず決算に進むね\n` +
    `                + final result\n` +
    `                   ~ ガチャ (times) 回の結果は、\n` +
    `                      (pk)  x (number of drawed pks) .etc\n` +
    `                      天井  x (times / 200)\n` +
    `                      color  x (number of drawed color) .etc\n` +
    `                      確率は (rate of star3) %\n` +
    `                      <:stone:1135016872950116485> (120 * times * n)個が` +
    `<:megami:1135016875978399855> (number of megamis)個になりました\n` + 
    `--await interaction: yes\n` +
    `                + after every (times) draws\n` +
    `                   ~ if y: draw another (times) draws\n` +
    `                   ~ if n: enter final result part\n` +
    `                   ~ valid duration: 5 sec\n`  + 
    `--total valid duration: 10 min`],
    ["shoot",
    `name: reddog, 射龍門, whatever\n` +
    `call method: /shoot\n` +
    `function: play and win/lose stones\n` +
    `--input: not required\n` +
    `--fee: ${fee} stones\n` +
    `--rule: draw 2 cards first\n` + 
    `                + order of the ranks: A > K > Q > ... > 3 > 2\n`  +
    `                + if different ranks\n`  +
    `                   ~ if consecutive: auto end\n`  +
    `                   ~ draw and if the third card\n`  +
    `                       (1) ranks between the 2 cards\n` +
    `                                         -- win ${fee * 2} stones\n`  +
    `                       (2) ranks lower or higher than the 2 cards\n` +
    `                                         -- lose ${fee} stones\n`  +
    `                       (3) has the same rank with either card\n` +
    `                                         -- lose ${fee * 2} stones\n`  +
    `                + if same rank\n`  +
    `                   ~ guess the third card will be higher or lower \n`  +
    `                   ~ draw the third card and if\n`  +
    `                       (1) guess is correct\n` +
    `                                         -- win ${fee * 2} stones\n`  +
    `                       (2) guess is wrong\n` +
    `                                         -- lose ${fee} stones\n`  +
    `                       (3) has the same rank\n` +
    `                                         -- lose ${fee * 3} stones\n`  +
    `--public: yes\n` +
    `--reply: + the result of the draw\n` +
    `                + ask if continue ( y / n )\n` +
    `                + after receiving interaction\n` +
    `                   ~ if y: いいよ、わかった\n` +
    `                   ~ if n: うん、まだ来て + your remaing stones\n` +
    `                   ~ if receive nothing: ん？まあ、まだ来て \n` +
    `                (+ ask higher or lower ( h / l ))\n` +
    `                + your remaing stones + final result\n` +
    `--await interaction: yes\n` +
    `                + after the questions\n` +
    `                   ~ if y (h /l): draw the 3rd card\n` +
    `                   ~ if n: enter result part\n` +
    `                   ~ valid duration: 5 sec`],
    ["work",
      `name: Mission\n` +
      `call method: /work\n` +
      `function: gain stones\n` +
      `                   --input: not required\n`  +
      `                   --public: yes\n` +
      `                   --reply: there are 4 kinds of reply\n` +
      `                                  (1) うん、任せて\n` +
      `                                         -- there was no mission and \n` +
      `                                              now you start one\n` +
      `                                  (2) 私らしくないミスを...\n` +
      `                                         ごめん先生... + 持てる(stones)\n` +
      `                                         -- ends a mission and \n` +
      `                                              stones + ${fee * 2}\n` +
      `                                  (3) ミッション完了、報告は後で渡す + 持てる(stones)\n` +
      `                                         -- ends a mission and \n` +
      `                                              stones + ${fee * 4}\n` +
      `                                  (4) 大成功だったよ先生 + 持てる(stones)\n` +
      `                                         -- ends a mission and \n` +
      `                                              stones + ${fee * 6}\n` +
      `                   --await interaction: no\n`+
      `                   --cd: 12 hr\n` ],
    ["draw",
      `name: Omikuji\n` +
      `call method: /draw\n` +
      `function: test luck\n` +
      `                   --input: not required\n`  +
      `                   --public: yes\n` +
      `                   --reply: the result\n` +
      `                   --await interaction: no\n`+
      `                   --cd: 8 hr\n`  +
      `                   !! will be cleared out at 4 a.m. everyday !!\n` ],
    ["pfp", 
      `name: ProfilePicture\n` +
      `call method: /pfp\n` +
      `function: view bot's icon\n` +
      `                   --input: not required\n`  +
      `                   --public: yes\n` +
      `                   --reply: bot's icon (.png)\n` +
      `                   --await interaction: no`],
    ["test",
      `name: Test\n` +
      `call method: /test\n` +
      `function: test some features\n` +
      `                   current target feature will be in the description\n` +
      `                   --input: depends on the target feature\n`  +
      `                   --public: no\n` +
      `                   --reply: depends on the target feature\n` +
      `                   --await interaction: depends on the target feature\n` +
      `                   --has permmision: @窩都不會 & @maruma`],
    ["help", 
      `name: Help\n` +
      `call method: /help\n` +
      `function: view bot's icon\n` +
      `                   --input: input the target command you want \n`  +
      `                                  to see the details of\n`  +
      `                   --public: no\n` +
      `                   --reply: the details of the command\n` +
      `                   --await interaction: no`],
    ["now",
      `name: Now\n` +
      `call method: /now\n` +
      `function: check if bot is in use in this channel\n` +
      `                   --input: not required\n`  +
      `                   --public: no\n` +
      `                   --reply: there are two kinds of replys:\n` + 
      `                                  (1) ちょっと待ってて、忙しいから。。。\n`  +
      `                                         -- bot is in use\n` +
      `                                  (2) うん、なに\n`  +
      `                                         -- bot isn't in use\n` +
      `                   --await interaction: no`],
    ["ping",
      `name: Ping\n` +
      `call method: /ping\n` +
      `function: view ping\n` +
      `                   --input: not required\n`  +
      `                   --public: no\n` +
      `                   --reply: ping (ms)\n` +
      `                   --await interaction: no`],
    ["status",
      `name: Status\n` +
      `call method: /status\n` +
      `function: view your status\n` +
      `                   --input: not required\n`  +
      `                   --public: yes\n` +
      `                   --reply: ♢ 名前: (name)\n` + 
      `                                  ♢ 宝石: (stones)\n` +
      `                                  ♢ ヒナの好感度: (hina's affection toward you)\n` +
      `                                  ♢ ミッション: if you have a mission\n` +
      `                                  ♢ アラーム: if you have an alarm\n` +
      `                   --await interaction: no`],
    ["timeout",
      `name: Timeout\n` +
      `call method: /timeout\n` +
      `function: timeout someone\n` +
      `                   --input: + target \n`  +
      `                                  (everyone except admin & bot)\n`  +
      `                                  + time length(sec) (1~86400)\n`  +
      `                   --public: yes\n` +
      `                   --reply: there are four kinds of replys:\n` + 
      `                                  (1) 先生の権限が足りないみたい。\n` +
      `                                        -- you aren't a mod\n` +
      `                                  (2) 私そんな権限がない\n` +
      `                                        -- the target is the admin or a bot\n` +
      `                                  (3) (target) の刑期が (duration) s になりました。\n` +
      `                                        -- target's timeout duration is updated\n` +
      `                                  (4) (target) が逮捕されました。\n` +
      `                                        -- you successfully timeout the target\n` +
      `                   --await interaction: no` ],
]);
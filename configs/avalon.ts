import { constant } from "./constants"
export const avalon = {
	time:{
		waiting_player: constant.min5,
		discussion: constant.min10,
		voting: constant.min5,
		dm_choosing: constant.min1,
	},
	happy:{
		full: `<:happy_mention:850358647171317781>`,
		id: `850358647171317781`
	},
	angry:{
		full: `<:angry_mention:850358998803939398>`,
		id: `850358998803939398`
	},
	map: [
		`/files/game/avalon/map/5.png`,
		`/files/game/avalon/map/6.png`,
		`/files/game/avalon/map/7.png`,
		`/files/game/avalon/map/8.png`,
		`/files/game/avalon/map/9.png`,
		`/files/game/avalon/map/10.png`,	
	],
	cup: {
		clean: `/files/game/avalon/cup/0.png`,
		dirty: `/files/game/avalon/cup/1.png`,	
	},
	mis: {
		suc: `/files/game/avalon/mission/0.png`,
		fail: `/files/game/avalon/mission/1.png`,
	},
	vote_f: `/files/game/avalon/vote_f/vote_f.png`,
	mis_pos: [
		[40, 230],
		[196, 230],
		[353, 230],
		[511, 230],
		[668, 230],	
	],
	vtf_pos: [
		[51, 452],
		[169, 452],
		[286, 452],
		[402, 452],
		[518, 452],
	],
	roles: [ 
		[//5
			1, //merlin
			1, //percival
			1, //royal dumb
			0, //mordred
			1, //morgana
			0, //assassin
			1, //evil dumb
			0, //oberon
			0, //megami
		],
		[//6
			1, //merlin
			1, //percival
			2, //royal dumb
			0, //mordred
			1, //morgana
			0, //assassin
			1, //evil dumb
			0, //oberon
			0, //megami
		],
		[//7
			1, //merlin
			1, //percival
			2, //royal dumb
			0, //mordred
			1, //morgana
			0, //assassin
			1, //evil dumb
			1, //oberon
			0, //megami
		],
		[//8
			1, //merlin
			1, //percival
			3, //royal dumb
			0, //mordred
			1, //morgana
			1, //assassin
			1, //evil dumb
			0, //oberon
			1, //megami
		],
		[//9
			1, //merlin
			1, //percival
			4, //royal dumb
			1, //mordred
			1, //morgana
			1, //assassin
			0, //evil dumb
			0, //oberon
			1, //megami
		],
		[//10
			1, //merlin
			1, //percival
			4, //royal dumb
			1, //mordred
			1, //morgana
			1, //assassin
			0, //evil dumb
			1, //oberon
			1, //megami
		],
	],
	mission: [ 
		[//5
			2, 
			3, 
			2, 
			3, 
			3,
		],
		[//6
			2, 
			3, 
			4, 
			3, 
			4,
		],
		[//7
			2,
			3,
			3,
			4,
			4,
		],
		[//8
			3,
			4,
			4,
			5,
			5,
		],
		[//9
			3,
			4,
			4,
			5,
			5,
		],
		[//10
			3,
			4,
			4,
			5,
			5,
		],
	],
	names: [ 
		'マーリン (Merlin)', 
		'パーシヴァル (Percival)', 
		`正義のバカ (royal dumb)`, 
		`モードレッド (Mordred)`, 
		`モルガナ (Morgana)`, 
		`暗殺者 (assassin)`, 
		`邪悪のバカ (evil dumb)`, 
		`オベロン (Oberon)`,
		`湖の女神`,
	],
	instruct:[
		[
			"マーリン (Merlin)",
			"日本語:\n" +
			"誰が「モードレッド以外の邪悪」なのかを知ることが出来ます。\n" + 
			"ただし、最後に暗殺されてしまうと敗北となる為、\n" +
			"自分がマーリンだと知られないように振舞う必要があります\n。" +
			"CN:\n" +
			"你會知道邪惡方除了莫德雷德的全部人。\n" + 
			"然而，為了不在最後因為被暗殺而輸掉，\n" +
			"你可能會需要努力一些來隱藏自己\n。" 
		],
		[
			"パーシヴァル (Percival)",
			"日本語:\n" +
			"マーリン や モルガナ の二人を知ることが出来ますが、\n" + 
			"誰がニセモノか、自分で判断してください。\n" +
			"CN:\n" +
			"你會知道梅林和莫甘娜的兩個人。\n" + 
			"但誰是誰請自行判斷\n。" 
		],
		[
			"正義のバカ (royal dumb)",
			"日本語:\n" +
			"バガです\n" +
			"CN:\n" +
			"你是笨蛋\n。" 
		],
		[
			"モードレッド (Mordred)",
			"日本語:\n" +
			"オベロン以外の仲間達を知ることが出来ます。\n" + 
			"更に、マーリンはあなたを邪悪と認識できない\n" +
			"CN:\n" +
			"你會知道除了奧伯龍的夥伴們。\n" + 
			"梅林還不會知道你是邪惡方這件事\n。" 
		],
		[
			"モルガナ (Morgana)",
			"日本語:\n" +
			"オベロン以外の仲間達を知ることが出来ます。\n" + 
			"更に、パーシヴァルと正義のバカ達を自分が本物のマーリンだと騙せる\n" +
			"CN:\n" +
			"你會知道除了奧伯龍的夥伴們。\n" +  
			"你還能騙珀西瓦爾和正義的笨蛋們自己是梅林\n。" 
		],
		[
			"暗殺者 (assassin)",
			"日本語:\n" +
			"オベロン以外の仲間達を知ることが出来ます。\n" + 
			"更に、邪悪が負けた時正義の一人を対象として暗殺する事ができます\n" +
			"対象がマーリンの場合は邪悪が勝つ事になります。\n" +
			"CN:\n" +
			"你會知道除了奧伯龍的夥伴們。\n" + 
			"你還能騙珀西瓦爾和正義的笨蛋們自己是梅林\n。" 
		],
		[
			"邪悪のバカ (evil dumb)",
			"日本語:\n" +
			"バガです\n" +
			"EN:\n" +
			"You are dumb.\n" +
			"CN:\n" +
			"你是笨蛋\n。" ],
		[
			"オベロン (Oberon)",
			"日本語:\n" +
			"バカみたい。\n" +
			"CN:\n" +
			"BAKAMITAI\n。" 
		],
		[
			"true",
			"日本語:\n" +
			"任務を三回成功させれば勝ちだが、\n" +
			"その後にマーリンが暗殺されたら負けになります。\n" +
			"CN:\n" +
			"讓任務成功三次就能贏，\n。" +
			"但之後如果梅林被暗殺就會輸\n。" 
		],
		[
			"false",
			"日本語:\n" +
			"任務を三回失敗させるか、\n" +
			"マーリンを暗殺すれば勝ちます。\n" +
			"CN:\n" +
			"讓任務失敗三次，\n。" +
			"或暗殺梅林就會贏\n。" 
		],
	] as Iterable<readonly[string, string]>,
}
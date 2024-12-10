import { APIApplicationCommandOptionChoice } from "discord.js"
export const gacha = {
	channel: `1136269004156186634`,
	Pool: [
		{name: `fes3_hina`, value: `fes3_hina`},
		{name: `fes3_hoshino`, value: `fes3_hoshino`},
		{name: `Aru_dress`, value: `Aru_dress`},
		{name: `Kayoko_dress`, value: `Kayoko_dress`},
		{name: `normal`, value: `norm`},
	] as Array<APIApplicationCommandOptionChoice<string>>,
	Pickup: [
		{
			name: `fes3_hina`,
			pk: `Hina_dress_3_fes`,
			semi_pk: [`Mika_3_fes`, `Hoshino_swimsuit_3_fes`, `Wakamo_3_fes`, `Hanako_swimsuit_3_fes`],
			non_pk: undefined,
		},
		{
			name: `fes3_hoshino`,
			pk: `Hoshino_swimsuit_3_fes`,
			semi_pk: [`Mika_3_fes`, `Hina_dress_3_fes`, `Wakamo_3_fes`, `Hanako_swimsuit_3_fes`],
			non_pk: undefined,
		},
		{
			name: `Aru_dress`,
			pk: `Aru_dress_3`,
			semi_pk: undefined,
			non_pk: [`Kayoko_dress_3`,],
		},
		{
			name: `Kayoko_dress`,
			pk: `Kayoko_dress_3`,
			semi_pk: undefined,
			non_pk: [`Aru_dress_3`, ],
		},
		{
			name: `norm`,
			pk: undefined,
			semi_pk: undefined,
			non_pk: undefined,
		}
	]
}
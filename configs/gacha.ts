import { APIApplicationCommandOptionChoice } from "discord.js"
export const gacha = {
	channel: `1136269004156186634`,
	Pool: [
		{name: `fes3.5_Hoshino`, value: `fes3.5_Hoshino`},
		{name: `fes3.5_Kuroko`, value: `fes3.5_Kuroko`},
		{name: `Saori_swimsuit`, value: `Saori_swimsuit`},
		{name: `Hiori_swimsuit`, value: `Hiori_swimsuit`},
		{name: `normal`, value: `norm`},
	] as Array<APIApplicationCommandOptionChoice<string>>,
	Pickup: [
		{
			name: `fes3.5_Hoshino`,
			pk: `Hoshino_armed_3_fes`,
			semi_pk: [`Mika_3_fes`, `Hoshino_swimsuit_3_fes`, `Wakamo_3_fes`, `Hanako_swimsuit_3_fes`, `Hina_dress_3_fes`, `Kuroko_terror_3_fes`],
			non_pk: undefined,
		},
		{
			name: `fes3.5_Kuroko`,
			pk: `Kuroko_terror_3_fes`,
			semi_pk: [`Mika_3_fes`, `Hoshino_swimsuit_3_fes`, `Wakamo_3_fes`, `Hanako_swimsuit_3_fes`, `HIna_dress_3_fes`, `Hoshino_ared_3_fes`, ],
			non_pk: undefined
		},
		{
			name: `Saori_swimsuit`,
			pk: `Saori_swimsuit_3_fes`,
			semi_pk: undefined,
			non_pk: [`Hiori_swimsuit_3_fes`,],
		},
		{
			name: `Hiori_swimsuit`,
			pk: `Hiori_swimsuit_3_fes`,
			semi_pk: undefined,
			non_pk: [`Saori_swimsuit_3_fes`],
		},
		{
			name: `norm`,
			pk: undefined,
			semi_pk: undefined,
			non_pk: undefined,
		}
	]
}
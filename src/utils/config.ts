import {
    SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction,
    ActivityType,
    ColorResolvable,
    Guild, Role,
} from "discord.js"

export interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export const Color: {primary: ColorResolvable, accent: ColorResolvable} = {
    primary: "#cc0000",
    accent: "#ffaaaa"
}

export interface Activity {
    name: string,
    type: ActivityType
}

export const activities: Activity[] = [
    { name: "Losowanie ocen praktykantów", type: ActivityType.Playing },
    { name: "Upiększanie postu na LinkedIn", type: ActivityType.Competing },
    { name: "Sklejanie thinkpada", type: ActivityType.Watching },
    { name: "Pomaganie w pieczeniu kremówek", type: ActivityType.Playing },
    { name: "Pisanie \"LGTM 🚀\" w review", type: ActivityType.Playing },
    { name: "Nastawianie zegarka", type: ActivityType.Competing },
    { name: "Usuwanie bazy danych", type: ActivityType.Streaming }
]

export async function fetchRoles(guild: Guild): Promise<(Role | null)[]> {
    return [
        await guild.roles.fetch("1489217501207199894"), // @powiadomienia-aktualnosci-gi
        await guild.roles.fetch("1489217766463504555"), // @powiadomienia-mypolitics
        await guild.roles.fetch("1489217787543945247"), // @powiadomienia-integracje
        await guild.roles.fetch("1489217846415458366"), // @powiadomienia-dzialaj-org
        await guild.roles.fetch("1489217877453045901")  // @powiadomienia-ngo-manager
    ]
}

export const emojis: string[] = [ // Emoji markdown syntax: <:name:id>
    "<:gi:1335711671867670589>",
    "<:mypolitics:1489263474247860254>",
    "<:piatka:1444813995713364208>",
    "<:dzialajorg:1489263534570475570>",
    "<:merged:1343666870326399057>"
]

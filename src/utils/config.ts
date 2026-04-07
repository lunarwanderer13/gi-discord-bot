import {
    SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction, // imports for commands
    ActivityType,                // imports for activities
    ColorResolvable,             // imports for colors
    Guild, Role,                 // imports for roles
} from "discord.js"

// Command interface
export interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

// Embed colors used by the bot
export const Color: {primary: ColorResolvable, accent: ColorResolvable} = {
    primary: "#cc0000",
    accent: "#ffaaaa"
}

// Activity interface
export interface Activity {
    name: string,
    type: ActivityType
}

// Array of possible activities for the bot to choose from
export const activities: Activity[] = [
    { name: "Losowanie ocen praktykantów", type: ActivityType.Playing },
    { name: "Upiększanie postu na LinkedIn", type: ActivityType.Competing },
    { name: "Sklejanie thinkpada", type: ActivityType.Watching },
    { name: "Pomaganie w pieczeniu kremówek", type: ActivityType.Playing },
    { name: "Pisanie \"LGTM 🚀\" w review", type: ActivityType.Playing },
    { name: "Nastawianie zegarka", type: ActivityType.Competing },
    { name: "Usuwanie bazy danych", type: ActivityType.Streaming }
]

// Get random activity from the array above
export function getRandomActivity(): Activity {
    return activities[Math.floor(Math.random() * activities.length)]
}

// Fetch all the notification roles
export async function fetchRoles(guild: Guild): Promise<(Role | null)[]> {
    return [
        await guild.roles.fetch("1489217501207199894"), // @powiadomienia-aktualnosci-gi 
        await guild.roles.fetch("1489217787543945247"), // @powiadomienia-integracje
        await guild.roles.fetch("1489217766463504555"), // @powiadomienia-mypolitics
        await guild.roles.fetch("1489217846415458366"), // @powiadomienia-dzialaj-org
        await guild.roles.fetch("1489217877453045901")  // @powiadomienia-ngo-manager
    ]
}

// Array of emojis, each representing one of the notification roles, in order
export const emojis: string[] = [ // Emoji markdown syntax: <:name:id>
    "<:gi:1335711671867670589>",
    "<:piatka:1444813995713364208>",
    "<:mypolitics:1489263474247860254>",
    "<:dzialajorg:1489263534570475570>",
    "<:merged:1343666870326399057>"
]

// Log function for logging both successful operations and errors
export function log(level: string, message: string): void {
    const timestamp: string = new Date().toISOString()
    console.log(`[${timestamp}] [${level}]: ${message}`)
}


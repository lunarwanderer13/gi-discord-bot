import { Client, GatewayIntentBits, Partials } from "discord.js"
import { Command } from "./utils/config"
import "dotenv/config"

// Import commands
import { Ping } from "./commands/ping"
import { SendMessage } from "./commands/send_message"

// Import events
import clientReady from "./events/clientReady"
import interactionCreate from "./events/interactionCreate"
import messageReaction from "./events/messageReaction"
import guildMemberAdd from "./events/guildMemberAdd"

export const client: Client<boolean> = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User
    ]
})

export const Commands: Command[] = [
    Ping,
    SendMessage
]

clientReady(client)
interactionCreate(client)
messageReaction(client)
guildMemberAdd(client)

// Login with the bot
client.login(process.env.TOKEN)

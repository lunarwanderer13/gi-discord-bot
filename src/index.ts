import { Client, GatewayIntentBits } from "discord.js"
import { Command } from "./utils/config"
import "dotenv/config"

// Import commands
import { Ping } from "./commands/ping"

// Import events
import clientReady from "./events/clientReady"
import interactionCreate from "./events/interactionCreate"

export const client: Client<boolean> = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.Guilds
    ]
})

export const Commands: Command[] = [
    Ping
]

clientReady(client)
interactionCreate(client)

// Login with the bot
client.login(process.env.TOKEN)

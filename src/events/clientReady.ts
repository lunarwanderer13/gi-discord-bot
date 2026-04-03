import { Client, ClientUser, REST, Routes, ActivityType } from "discord.js"
import { Commands } from "./../index"
import { activities, Activity } from "./../utils/config"
import "dotenv/config"

export default (client: Client): void => {
    client.on("clientReady", async () => {
        if (!client.user || !client.application) return

        const app: ClientUser = client.user
        const restart: boolean = false
        const rest: REST = new REST().setToken(process.env.TOKEN!)

        if (restart) {
            // Remove global commands
            await rest.put(Routes.applicationCommands(app.id),  { body: [] })

            // Remove guild commands
            client.guilds.cache.forEach(async guild => {
                await rest.put(Routes.applicationGuildCommands(app.id, guild.id), { body: [] })
            })
        }

        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!), { body: Commands.map(command => command.data.toJSON()) })

        let activity: Activity = activities[Math.floor(Math.random() * activities.length)]
        app.setPresence({
            activities: [activity],
            status: "dnd",
        })

        console.log(`Logged in as ${client.user.username}`)
    })
}

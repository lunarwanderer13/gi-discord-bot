import { Client, ClientUser, REST, Routes } from "discord.js"
import { Commands } from "./../index"
import { getRandomActivity } from "./../utils/config"
import "dotenv/config"
import schedule from "node-schedule"

// Event ran on first heartbeat
export default (client: Client): void => {
    client.on("clientReady", async () => {
        // Satisfy sensitive typescript-chan's needs
        if (!client.user || !client.application) return

        const app: ClientUser = client.user
        const restart: boolean = false // if set to true, bot will delete all commands and re-add them
                                       // this is useful for removing deprecated commands or migrating the bot to a different server
        const rest: REST = new REST().setToken(process.env.TOKEN!)

        if (restart) {
            // Remove global commands
            await rest.put(Routes.applicationCommands(app.id),  { body: [] })

            // Remove guild commands
            client.guilds.cache.forEach(async guild => {
                await rest.put(Routes.applicationGuildCommands(app.id, guild.id), { body: [] })
            })
        }

        // Add guild commands to the bot
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!), { body: Commands.map(command => command.data.toJSON()) })

        // Set the presence to do-not-disturb and random activity
        app.setPresence({
            activities: [getRandomActivity()],
            status: "dnd",
        })

        // Refresh the random activity everyday
        schedule.scheduleJob("0 0 * * *", () => {
            app.setActivity(getRandomActivity())
        })

        console.log(`Logged in as ${client.user.username}`)
    })
}

import { Client, ClientUser, REST, Routes } from "discord.js"
import { Commands } from "./../index"
import { getRandomActivity } from "./../utils/config"
import "dotenv/config"
import schedule from "node-schedule"

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

        app.setPresence({
            activities: [getRandomActivity()],
            status: "dnd",
        })

        schedule.scheduleJob("0 0 * * *", () => {
            app.setActivity(getRandomActivity())
        })

        console.log(`Logged in as ${client.user.username}`)
    })
}

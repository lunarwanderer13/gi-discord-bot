import { Client, ClientUser, REST, Routes } from "discord.js"
import { Commands } from "./../index"
import { Command, Activity, getRandomActivity, log } from "./../utils/config"
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
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
            { body: Commands.map((command: Command, index: number) => {
                if (!command) {
                    log("ERROR", `Command at index ${index} is undefined`)
                    return undefined
                }

                if (!command.data) {
                    log("ERROR", `Command at index ${index} is missing data`)
                    return undefined
                }

                log("LOG", `Loaded /${command.data.name}`)
                return command.data.toJSON()
            })}
        )

        // Set the presence to do-not-disturb and random activity
        let initial_activity: Activity = getRandomActivity()
        app.setPresence({
            activities: [initial_activity],
            status: "dnd",
        })
        log("LOG", `Set the initial activity to ${initial_activity.name}`)

        // Refresh the random activity everyday
        schedule.scheduleJob("0 0 * * *", () => {
            let new_activity: Activity = getRandomActivity()
            app.setActivity(new_activity)
            log("LOG", `Changed activity to ${new_activity.name}`)
        })

        log("LOG", `Logged in as ${client.user.username}`)
    })
}

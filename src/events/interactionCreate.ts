import { Client, Interaction, ChatInputCommandInteraction, MessageFlags } from "discord.js"
import { Commands } from "./../index"

// Event ran whenever a command is ran
async function handleSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const slashCommand = Commands.find(command => command.data.name === interaction.commandName)

    // If there's any kind of error while running the command, stop the process to prevent a crash
    if (!slashCommand) {
        interaction.reply({
            content: "An error has occured",
            flags: MessageFlags.Ephemeral
        })
        return
    }

    // Execute the command
    await slashCommand.execute(interaction)
}

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) await handleSlashCommand(interaction)
    })
}

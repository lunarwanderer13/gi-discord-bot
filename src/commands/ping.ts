import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js"
import { Command } from "./../utils/config"

// Test command for checking if the bot even works
export const Ping: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        // Reply to the user with the latency, only visible to them
        await interaction.reply({
            content: `Pong! *${interaction.client.ws.ping}ms*`,
            flags: MessageFlags.Ephemeral
        })
    }
}

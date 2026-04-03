import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, TextBasedChannel, Role, EmbedBuilder, MessageFlags } from "discord.js"
import { Command, Color, fetchRoles, emojis } from "./../utils/config"
import fs from "fs"

export const SendMessage: Command = {
    data: new SlashCommandBuilder()
        .setName("send-message")
        .setDescription("Sends the message members will react to to get roles.")
        .setContexts([0])

        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel in which the message will be sent.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const channel_option = interaction.options.getChannel("channel") ?? interaction.channel
        const channel: TextBasedChannel = channel_option as TextBasedChannel

        if (!interaction.guild || !channel_option || channel_option.type !== ChannelType.GuildText || !channel.isTextBased() || !channel.isSendable()) {
            await interaction.reply({ content: "Please provide a valid TextBasedChannel", flags: MessageFlags.Ephemeral })
            return
        }

        // Defer reply to avoid the UnknownInteraction error by timing out
        interaction.deferReply({ flags: MessageFlags.Ephemeral })

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)
            .setTitle("Self-role serwera GI")

        let description: string = "Dodaj reakcję aby otrzymać rolę:\n"

        const roles: (Role | null)[] = await fetchRoles(interaction.guild)

        roles.forEach((value: Role | null, index: number) => {
            if (value) description += `${emojis[index]} @${value.name}\n`
        })

        embed.setDescription(description)

        try {
            const message = await channel.send({ embeds: [embed] })
            
            emojis.forEach(async (value: string) => {
                await message.react(value)
            })
            await message.react("🔍")

            fs.writeFileSync("message.txt", message.id, "utf-8")

            await interaction.editReply({ content: "Message sent" })
            return
        } catch {
            interaction.editReply({ content: "I cannot send a message in that channel" })
            return
        }
    }
}

import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, TextBasedChannel, Role, EmbedBuilder, MessageFlags } from "discord.js"
import { Command, Color } from "./../utils/config"

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

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)
            .setTitle("Self-role serwera GI")

        let description: string = "Dodaj reakcję aby otrzymać rolę:\n"
        const roles: (Role | null)[] = [
            await interaction.guild.roles.fetch("1489217501207199894"), // @powiadomienia-aktualnosci-gi
            await interaction.guild.roles.fetch("1489217766463504555"), // @powiadomienia-mypolitics
            await interaction.guild.roles.fetch("1489217787543945247"), // @powiadomienia-integracje
            await interaction.guild.roles.fetch("1489217846415458366"), // @powiadomienia-dzialaj-org
            await interaction.guild.roles.fetch("1489217877453045901")  // @powiadomienia-ngo-manager
        ]
        const emojis: string[] = [ // Emoji markdown syntax: <:name:id>
            "<:gi:1335711671867670589>",
            "<:mypolitics:1489263474247860254>",
            "<:piatka:1444813995713364208>",
            "<:dzialajorg:1489263534570475570>",
            ":five:"
        ]

        roles.forEach((value: Role | null, index: number) => {
            if (value) description += `${emojis[index]} @${value.name}\n`
        })

        embed.setDescription(description)

        try {
            const message = await channel.send({ embeds: [embed] })
            await interaction.reply({ content: "Message sent", flags: MessageFlags.Ephemeral })

            emojis.forEach(async (value: string) => {
                await message.react(value)
            })
            return
        } catch {
            interaction.reply({ content: "I cannot send a message in that channel", flags: MessageFlags.Ephemeral })
            return
        }
    }
}

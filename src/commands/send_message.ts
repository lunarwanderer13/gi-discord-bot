import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, TextBasedChannel, Role, EmbedBuilder, MessageFlags } from "discord.js"
import { Command, Color, fetchRoles, emojis } from "./../utils/config"
import fs from "fs"

// Sends the message members can manage their roles with by reacting to it
export const SendMessage: Command = {
    data: new SlashCommandBuilder()
        .setName("send-message")
        .setDescription("Sends the message members will react to to get roles.")
        .setContexts([0]) // Command only usable in guilds

        // Channel to which the message will be sent (defaults to current channel)
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel in which the message will be sent.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const channel_option = interaction.options.getChannel("channel") ?? interaction.channel
        const channel: TextBasedChannel = channel_option as TextBasedChannel

        // Check if the channel is viable for sending the message
        if (!interaction.guild || !channel_option || channel_option.type !== ChannelType.GuildText || !channel.isTextBased() || !channel.isSendable()) {
            await interaction.reply({ content: "Please provide a valid TextBasedChannel", flags: MessageFlags.Ephemeral })
            return
        }

        // Defer reply to avoid the UnknownInteraction error by timing out
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        // Embed that will be sent in the selected channel
        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)
            .setTitle("Ustawienia powiadomień")
            .setDescription("Domyślnie, jesteś powiadamiany oznaczeniem o każdym działaniu w GI. Aby przełączać ustawienia powiadomień, kliknij jedną z poniższych reakcji.")
            .setFields(
                {
                    name: `${emojis[0]} Aktualności GI`,
                    value: "W tej roli powiadomimy Cię o wszystkich aktualnościach związanych z GI: o tym jak gdzieś się pojawiamy, o zaplanowanych wyjazdach i wydarzeniach z życia Fundacji.",
                    inline: false
                },
                {
                    name: `${emojis[1]} Integracje Fundacji`,
                    value: "Integracje online oraz stacjonarne odbywają się regularnie - dzięki tej grupie powiadomień nie przegapisz informacji o kolejnym wydarzeniu!",
                    inline: false
                },
                {
                    name: `${emojis[2]} Nowości w produkcie myPolitics`,
                    value: "myPolitics to nasz największy produkt - ciągle go rozwijamy, i będziemy informować co się zmienia dla użytkowników jak i developerów.",
                    inline: false
                },
                {
                    name: `${emojis[3]} Nowości w produkcie Działaj.org`,
                    value: "Działaj.org to nasza platforma służąca łączeniu ambitnych wolontariuszy z organizacjami przyjmującymi na praktykę czy staż. Platforma niedługo zbierze pierwsze ogłoszenia.",
                    inline: false
                },
                {
                    name: `${emojis[4]} Nowości w produkcie NGO Manager`,
                    value: "NGO Manager to nasza aplikacja wspierająca inne NGO w sprawach administracyjnych i dokumentowych.",
                    inline: false
                },
                {
                    name: "---",
                    value: "Jeżeli nie jesteś pewien jakie masz obecnie role - kliknij 🔍 - bot automatycznie wyśle Ci wiadomość z listą powiadomień, które subskrybujesz.",
                    inline: false
                }
            )

        try {
            // Send the embed
            const message = await channel.send({ embeds: [embed] })
            
            // Add respective reactions to the embed
            emojis.forEach(async (value: string) => {
                await message.react(value)
            })
            await message.react("🔍")

            // Save message id for further usage
            fs.writeFileSync("message.txt", message.id, "utf-8")

            // Successful reply
            await interaction.editReply({ content: "Message sent" })
            return
        } catch {
            // Failed reply
            await interaction.editReply({ content: "I cannot send a message in that channel" })
            return
        }
    }
}

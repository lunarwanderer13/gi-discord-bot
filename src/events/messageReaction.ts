import { Client, User, PartialUser, GuildMember, MessageReaction, PartialMessageReaction, Role, EmbedBuilder } from "discord.js"
import { Color, fetchRoles, emojis } from "src/utils/config"
import fs from "fs"

export default (client: Client): void => {
    client.on("messageReactionAdd", async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): Promise<void> => {
        // Check for partials and nulls
        if (reaction.partial || !reaction) reaction = await reaction.fetch()
        if (reaction.message.partial || !reaction.message) reaction.message = await reaction.message.fetch()
        if (user.partial || !user) user = await user.fetch()
        if (!reaction.message.guild) return

        // Check for bot reaction
        if (user.id === process.env.CLIENT_ID!) return

        // Check for reaction message
        const self_role_message_id: string = fs.readFileSync("message.txt", "utf-8")
        if (reaction.message.id != self_role_message_id) return

        const roles: (Role | null)[] = await fetchRoles(reaction.message.guild)

        const member: GuildMember = await reaction.message.guild.members.fetch({ user: user.id, force: true })
        if (!member) return

        let dm_embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)

        let role: Role | null = roles[0]
        let role_lookup: boolean = false
        let title: string = "łączyłeś powiadomienia o "

        switch (reaction.emoji.name) {
            case "gi":
                role = roles[0]
                title += "aktualnościach w GI"
                break
            case "mypolitics":
                role = roles[1]
                title += "nowościach w myPolitics"
                break
            case "piatka":
                role = roles[2]
                title += "integracjach w Fundacji"
                break
            case "dzialajorg":
                role = roles[3]
                title += "nowościach w Działaj.org"
                break
            case "merged":
                role = roles[4]
                title += "nowościach w Asystent NGO"
                break
            default:
                role_lookup = true
        }
        if (!role) return

        if (!role_lookup) {
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role.id)
                title = "Wy" + title
            } else {
                await member.roles.add(role.id)
                title = "W" + title
            }
            dm_embed.setTitle(title)
        } else {
            dm_embed.setTitle("Twoje ustawienia powiadomień")
        }

        let response: string = "Subskrybujesz następujące powiadomienia:\n"
        let equipped_roles: number = 0

        // To be optimized
        roles.forEach((value: Role | null) => {
            if (value && member.roles.cache.has(value.id)) {
                switch (value.id) {
                    case roles[0]!.id:
                        response += `- ${emojis[0]} Aktualności w GI\n`
                        break
                    case roles[1]!.id:
                        response += `- ${emojis[1]} Nowości w produkcie myPolitics\n`
                        break
                    case roles[2]!.id:
                        response += `- ${emojis[2]} Integracje Fundacji\n`
                        break
                    case roles[3]!.id:
                        response += `- ${emojis[3]} Nowości w produkcie Działaj.org\n`
                        break
                    case roles[4]!.id:
                        response += `- ${emojis[4]} Nowości w produkcie Asystent NGO\n`
                        break
                }
                equipped_roles++
            }
        })

        if (equipped_roles === 0) response = `Nie masz włączonych żadnych powiadomień, możesz je dodać na <#${reaction.message.channelId}>`

        dm_embed.setDescription(response)

        user.send({ embeds: [dm_embed] })

        // Remove reaction right after reacting
        reaction.users.remove(member.id)
    })
}

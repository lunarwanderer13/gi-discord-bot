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

        let role: Role | null = roles[0]
        switch (reaction.emoji.name) {
            case "gi":
                role = roles[0]
                break
            case "mypolitics":
                role = roles[1]
                break
            case "piatka":
                role = roles[2]
                break
            case "dzialajorg":
                role = roles[3]
                break
            case "merged":
                role = roles[4]
                break
        }
        if (!role) return

        const member: GuildMember = await reaction.message.guild.members.fetch({ user: user.id, force: true })
        if (!member) return

        let dm_embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)

        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role.id)
            dm_embed.setTitle(`Hej! Odznaczyłeś rolę @${role.name}!`)
        } else {
            await member.roles.add(role.id)
            dm_embed.setTitle(`Hej! Zaznaczyłeś rolę @${role.name}!`)
        }

        let response: string = "Jesteś zasubskrybowany do następujących powiadomień:\n"

        roles.forEach((value: Role | null, index: number) => {
            if (value && member.roles.cache.has(value.id)) response += `${emojis[index]} @${value.name}\n`
        })

        dm_embed.setDescription(response)

        user.send({ embeds: [dm_embed] })

        // Remove reaction right after reacting
        reaction.users.remove(member.id)
    })
}

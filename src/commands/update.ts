import { SlashCommandBuilder, ChatInputCommandInteraction, User, Guild, GuildMember, Role, MessageFlags } from "discord.js"
import { Command, fetchRoles } from "./../utils/config"

// Updates the roles of every member to default five notifications
export const UpdateRoles: Command = {
    data: new SlashCommandBuilder()
        .setName("update-roles")
        .setDescription("Resets the notification roles of every member.")
        .setContexts([0]) // Command only usable in guilds

        .addUserOption(option => option
            .setName("user")
            .setDescription("If entered, only this user will have their roles reset.")
            .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        const target: User | null = interaction.options.getUser("user")
        let member_count: number = 0

        const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

        const guild: Guild | null = interaction.guild
        if (!guild) {
            await interaction.editReply({ content: "This command can only be used in a guild." })
            return
        }

        const roles: Role[] = (await fetchRoles(guild)).filter((r): r is Role => r !== null)

        if (target) {
            let member: GuildMember = await guild.members.fetch({ user: target.id, force: true })
            if (!member) {
                await interaction.editReply({ content: "This user is not a member." })
                return
            }

            await member.roles.add(roles.map(r => r.id))
            member_count++
        } else {
            await guild.members.fetch()

            for (const member of guild.members.cache.values()) {
                await member.roles.add(roles.map(r => r.id))
                member_count++
                await interaction.editReply({ content: `Working... *[${member_count}/${guild.memberCount}]*` })
                await delay(1000)
            }
        }

        await interaction.editReply({ content: `Task done! Iterated through ${member_count} members.` })
    }
}

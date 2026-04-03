import { Client, GuildMember, Role } from "discord.js"
import { fetchRoles } from "src/utils/config"

export default (client: Client): void => {
    client.on("guildMemberAdd", async (member: GuildMember): Promise<void> => {
        const roles: (Role | null)[] = await fetchRoles(member.guild)
        
        // Give all roles by default
        await member.roles.add(
            roles
                .filter((role): role is Role => role !== null)
                .map(role => role.id)
        )
    })
}

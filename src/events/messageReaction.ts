import { Client, User, PartialUser, MessageReaction, PartialMessageReaction } from "discord.js"
import fs from "fs"

export default (client: Client): void => {
    client.on("messageReactionAdd", async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
        // Check for partials and nulls
        if (reaction.partial || !reaction) reaction = await reaction.fetch()
        if (reaction.message.partial || !reaction.message) reaction.message = await reaction.message.fetch()
        if (user.partial || !user) user = await user.fetch()

        // Check for bot reaction
        if (user.id === process.env.CLIENT_ID!) return

        // Check for reaction message
        const self_role_message_id: string = fs.readFileSync("message.txt", "utf-8")
        if (reaction.message.id != self_role_message_id) return

        console.log("reacted")
    })
}

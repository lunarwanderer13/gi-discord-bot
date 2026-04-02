import {
    SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction,
    ColorResolvable
} from "discord.js"

export interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export const Color: {primary: ColorResolvable, accent: ColorResolvable} = {
    primary: "#cc0000",
    accent: "#ffaaaa"
}


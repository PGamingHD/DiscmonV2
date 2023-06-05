import {
    APIEmbed,
    ApplicationCommandOptionType,
    ButtonStyle,
    CategoryChannel,
    ChannelType,
    ComponentType,
    EmbedBuilder,
    ForumChannel,
    NewsChannel,
    PrivateThreadChannel,
    PublicThreadChannel,
    StageChannel,
    TextChannel,
    VoiceChannel,
    APIInteractionDataResolvedChannel, GuildBasedChannel
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {Colours} from "../../@types/Colours";
import {PokemonServer} from "@prisma/client";
import {sleep} from "../../utils/misc";

export default new Command({
    name: 'settings',
    description: 'View all server settings',
    defaultMemberPermissions: 'Administrator',
    noDefer: true,
    run: async ({ interaction, client }) => {
        if (!interaction.guild) return;
        const serverData: PokemonServer | null = await db.getServer(interaction.guild.id);

        if (!serverData) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The guild data does not exist, please send a message to initialize it.')]});
        let channel: GuildBasedChannel | null;

        try {
            channel = await interaction.guild.channels.fetch(serverData.serverRedirect as string);

            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colours.MAIN)
                        .setTitle('⚙️ Guild Settings ⚙️')
                        .setDescription(`__**Main Settings**__\n**Redirect Channel:** ${serverData.serverRedirect !== null ? channel : 'Not Set'}`)
                        .setFooter({text: 'Guild settings can only be modified by guild Administrators.'})
                        .setThumbnail('https://cdn.discordapp.com/attachments/1010999257899204769/1057280575465082890/4482f729452089.55f35b167dbbe.png')
                ]
            });
        } catch (e: any) {
            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription(`Settings could not be fetched, please send the error code to a Developer.\n\n**Error Code:** \`${e.message}\``)]});
        }
    },
});

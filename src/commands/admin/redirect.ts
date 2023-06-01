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
    APIInteractionDataResolvedChannel
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {Colours} from "../../@types/Colours";

export default new Command({
    name: 'redirect',
    description: 'Redirect all Pokémon spawns to one channel',
    defaultMemberPermissions: 'Administrator',
    noDefer: true,
    options: [{
        name: 'spawns',
        description: 'Set new redirect channel',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'channel',
            description: 'The channel to redirect all Pokémon spawns to',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }]
    },{
        name: 'disable',
        description: 'Disable the Pokémon redirect',
        type: ApplicationCommandOptionType.Subcommand,
    }],
    run: async ({ interaction, client }) => {
        if (interaction.options.getSubcommand() === "spawns") {
            const channel:  CategoryChannel | NewsChannel | StageChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel<boolean> | VoiceChannel | ForumChannel | APIInteractionDataResolvedChannel | null = interaction.options.getChannel('channel');

            if (!interaction.channel) return;
            if (!interaction.guild) return;
            if (!channel) return;

            if (channel.type !== ChannelType.GuildText) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The channel must be a text channel, and nothing else.')]});

            await db.setRedirectChannel(interaction.guild.id, channel.id);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`Spawns will now be redirect to ${channel}!`)]});
        }

        if (interaction.options.getSubcommand() === "disable") {
            if (!interaction.channel) return;
            if (!interaction.guild) return;

            await db.setRedirectChannel(interaction.guild.id, null);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`Pokémons will no longer be redirected to a specific channel.`)]});
        }

        return;
    },
});

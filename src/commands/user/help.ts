import {
    APIEmbed,
    ApplicationCommandOptionType,
    ButtonStyle,
    ChannelType,
    ComponentType,
    EmbedBuilder
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {Pokemons, userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import {capitalizeFirst} from "../../utils/misc";
import sendPagination from "../../utils/messages/sendPagination";

export default new Command({
    name: 'help',
    description: 'View all our commands you can use.',
    requireAccount: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        const embeds: APIEmbed[] = [];
        embeds.push({
            title: 'Discmon Commands',
            color: Colours.MAIN,
            fields: [{
                name: 'User Commands',
                value: '\`catch\`, \`code\`, \`coins\`, \`pokedex\`, \`pokemon\`, \`pokemons\`, \`start\`',
            }, {
                name: 'Pokemon Commands',
                value: '\`battle\`, \`favorite\`, \`hint\`, \`release\`, \`select\`, \`sort\`',
            }, {
                name: 'Info Commands',
                value: '\`changelogs\`, \`leaderboard\`',
            }, {
                name: 'Shop Commands',
                value: '\`market\`, \`store\`',
            }, {
                name: 'Admin Commands',
                value: '\`settings\`, \`redirect\`',
            }],
            timestamp: `${new Date().toISOString()}`
        });

        return sendPagination(interaction, embeds, 60000, 60000, false, 0);
    },
});



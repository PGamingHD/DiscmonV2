import {
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

export default new Command({
    name: 'coins',
    description: 'View all your current coins owned',
    requireAccount: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        const usersData: userData | null = await db.findPokemonTrainer(interaction.user.id);
        if (!usersData) return;

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setAuthor({name: interaction.user.username + '\'s balance', iconURL: interaction.user.displayAvatarURL()}).setDescription(`• 🪙 ${usersData.userCoins.toLocaleString('en-US')} Pokécoins\n• 💎 ${usersData.userTokens.toLocaleString('en-US')} Pokétokens`).setTimestamp()]});
    },
});



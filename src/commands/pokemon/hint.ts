import {
    ActionRowBuilder,
    APIEmbed,
    ApplicationCommandOptionType, ButtonBuilder, ButtonStyle,
    ChannelType,
    EmbedBuilder,
    TextInputStyle
} from 'discord.js';
import { Command } from '../../structures/Command';
import {Colours} from "../../@types/Colours";
import db from "../../utils/database";
import {hintGame} from "../../utils/misc";
import {Pokemons, userData} from "@prisma/client";


export default new Command({
    name: 'hint',
    description: 'Hint a spawned Pokémon in this channel',
    requireAccount: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        if (!interaction.channel) return;

        const spawnedPoke: Pokemons | null = await db.findOneSpawnedPokemon(interaction.channel.id);
        const userData: userData | null = await db.findPokemonTrainer(interaction.user.id);
        if (!userData) return;

        if (!spawnedPoke) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('There is currently no spawned Pokémon in here.')]});
        if (userData.userCoins < 1000) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('You cannot afford to get a hint about the spawned Pokémon.')]});

        await db.setCoins(interaction.user.id, userData.userCoins - 1000);

        const hintReturn: string = await hintGame(spawnedPoke.pokemonName);

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You paid 1,000 Pokécoins and recieved the hint \`${hintReturn}\``)]});
    }
});
import {
    ActionRowBuilder,
    ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction,
    ButtonStyle, CacheType,
    ChannelType, ComponentType, Embed, EmbedBuilder, InteractionCollector, InteractionResponse
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {Pokemon, PokemonGender, PokemonNature, Pokemons, userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import {capitalizeFirst, generateFlake} from "../../utils/misc";

export default new Command({
    name: 'catch',
    description: 'Catch a pokémon that has been spawned',
    noDefer: true,
    options: [{
        name: 'name',
        description: 'What is the name of the pokemon?',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    run: async ({ interaction, client }) => {
        const dataExists: userData | null = await db.findPokemonTrainer(interaction.user.id);
        if (!dataExists) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setDescription('You do not seem to have an account, please register before trying to catch a Pokémon.').setColor(Colours.RED)]});
        let pokeName: string | null = interaction.options.getString('name');
        if (!pokeName) return;
        if (!interaction.channel) return;

        pokeName = pokeName.toLowerCase();
        pokeName = capitalizeFirst(pokeName);

        const findSpawnedPokemon: Pokemons | null = await db.findSpawnedPokemon(interaction.channel.id, pokeName);
        const getHighestPoke: Pokemons[] = await db.getPokemonNextPokeId(interaction.user.id);

        let incrementId;
        if (getHighestPoke.length === 0 && getHighestPoke[0].pokemonPlacementId === null) incrementId = 1;
        if (getHighestPoke.length >= 1 && getHighestPoke[0].pokemonPlacementId !== null) incrementId = getHighestPoke[0].pokemonPlacementId + 1;
        if (!incrementId) incrementId = 1;

        if (!findSpawnedPokemon) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The Pokémon name you guessed was wrong, is there a Pokémon spawned in here?')]});

        try {
            const spawnedMessage = await interaction.channel.messages.fetch(findSpawnedPokemon.spawnedMessage as string);
            await spawnedMessage.edit({embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription(`This Pokémon has been caught by user ${interaction.user}!`)]});
        } catch {}

        await db.setSpawnedOwner(findSpawnedPokemon.pokemonId, interaction.user.id, incrementId);

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You successfully caught a \`${findSpawnedPokemon.pokemonName}\` at level \`${findSpawnedPokemon.pokemonLevel}\`!`)]});
    },
});



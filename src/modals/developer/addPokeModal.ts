import {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder
} from 'discord.js';
import { Modal } from '../../structures/Modal';
import {Colours} from "../../@types/Colours";
import {Pokemon, PokemonNature, PokemonRarity, PokeType} from "@prisma/client";
import db from "../../utils/database";
import {capitalizeFirst, generateFlake} from "../../utils/misc";

export default new Modal({
    customId: 'addPokeModal',
    run: async ({interaction, client, args}) => {
        let pokeName: string = args.getTextInputValue('pokeName');
        let evolveName: string = args.getTextInputValue('evolveName');
        const pokeRarity: string = args.getTextInputValue('pokeRarity');
        const pokeType: string = args.getTextInputValue('pokeType');
        const evolveStage: string = args.getTextInputValue('evolveStage');

        pokeName = pokeName.toLowerCase();
        pokeName = capitalizeFirst(pokeName);

        evolveName = evolveName.toLowerCase();
        evolveName = capitalizeFirst(evolveName);

        const pokePicture: string = `https://img.pokemondb.net/sprites/home/normal/${pokeName.toLowerCase()}.png`;
        const pokeShinyPicture: string = `https://img.pokemondb.net/sprites/home/shiny/${pokeName.toLowerCase()}.png`;

        if (pokeRarity.toUpperCase() !== PokemonRarity.RARE && pokeRarity.toUpperCase() !== PokemonRarity.COMMON && pokeRarity.toUpperCase() !== PokemonRarity.UNCOMMON && pokeRarity.toUpperCase() !== PokemonRarity.LEGEND && pokeRarity.toUpperCase() !== PokemonRarity.ULTRABEAST && pokeRarity.toUpperCase() !== PokemonRarity.SHINY)
            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The rarity is invalid, please make sure to capitalize the rarity.')]});

        const alrExists: Pokemon | null = await db.getPokemon(pokeName);

        if (alrExists) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The Pokémon you tried to add already exists.')]});

        const pokemonType: PokeType[] = [
            PokeType.NORMAL,
            PokeType.FIRE,
            PokeType.WATER,
            PokeType.GRASS,
            PokeType.FLYING,
            PokeType.FIGHTING,
            PokeType.POISON,
            PokeType.ELECTRIC,
            PokeType.GROUND,
            PokeType.ROCK,
            PokeType.PSYCHIC,
            PokeType.ICE,
            PokeType.BUG,
            PokeType.GHOST,
            PokeType.STEEL,
            PokeType.DRAGON,
            PokeType.DARK,
            PokeType.FAIRY,
        ]

        const allTypes: string[] = pokeType.split(',');

        if (allTypes.length === 0) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The types field is empty, please atleast 1 type.')]});

        const pokemonTypes: any[] = [];
        for (const type of allTypes) {
            if (!pokemonType.includes(type.toUpperCase() as PokeType)) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('One of the entered Pokémon types are invalid.')]});

            pokemonTypes.push({pokemonType: type.toUpperCase(), typeUniqueId: generateFlake()});
        }

        const pokeNumber: number = await db.getPokemonCount() + 1;

        await db.addNewPokemon({
            pokemonId: generateFlake(),
            pokemonPokedex: pokeNumber,
            pokemonName: pokeName,
            pokemonPicture: pokePicture,
            pokemonRarity: pokeRarity.toUpperCase(),
            pokemonShinyPicture: pokeShinyPicture,
            pokemonEvolve: {
                create: {
                    evolveUniqueId: generateFlake(),
                    nextEvolveName: evolveName,
                    currentEvolveStage: parseInt(evolveStage)
                }},
            pokemonType: {
                create: pokemonTypes
            }});

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`The Pokémon \`${pokeName}\` has been added into the database successfully with all types & evolve data!`)]});
    },
});


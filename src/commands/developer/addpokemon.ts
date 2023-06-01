import {
    ActionRowBuilder,
    AnyComponentBuilder,
    APIEmbed,
    ApplicationCommandOptionType,
    ChannelType, EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';
import { Command } from '../../structures/Command';
import {Pokemon, PokemonRarity, PokeType} from "@prisma/client";
import {capitalizeFirst, generateFlake} from "../../utils/misc";
import {Colours} from "../../@types/Colours";
import db from "../../utils/database";

export default new Command({
    name: 'addpokemon',
    description: 'Add a new Pokémon to the database (DEVELOPER ONLY)',
    defaultMemberPermissions: 'Administrator',
    main: true,
    noDefer: true,
    options: [{
        name: 'name',
        description: 'What is the name of the pokemon?',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'pokerarity',
        description: 'common, uncommon, rare, legend, ultrabeast, shiny, one only!',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'poketype',
        description: 'The pokémons type, separate types with "," only!',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'evolvename',
        description: 'What is the name of the evolve of this pokemon? ("none" if no evolve)',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'evolvelevel',
        description: 'The level this pokémon will evolve into new pokémon',
        type: ApplicationCommandOptionType.Integer,
        required: true
    }, {
        name: 'currentstage',
        description: 'What stage of evolution this pokémon is in',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }],
    run: async ({ interaction, client }) => {
        let pokeName: string | null = interaction.options.getString('name');
        let evolveName: string | null = interaction.options.getString('evolvename');
        const pokeRarity: string | null = interaction.options.getString('pokerarity');
        const pokeType: string | null = interaction.options.getString('poketype');
        const evolveStage: number | null = interaction.options.getInteger('currentstage');
        const evolveLevel: number | null = interaction.options.getInteger('evolvelevel');

        if (!pokeName) return;
        if (!evolveName) return;
        if (!pokeRarity) return;
        if (!pokeType) return;
        if (!evolveStage) return;
        if (!evolveLevel) return;


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
                    nextEvolveLevel: evolveLevel,
                    currentEvolveStage: evolveStage,
                }},
            pokemonType: {
                create: pokemonTypes
            }});

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`The Pokémon \`${pokeName}\` has been added into the database successfully with all types & evolve data!`)]});
    },
});
import {
    APIEmbed,
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    TextInputStyle
} from 'discord.js';
import { Command } from '../../structures/Command';
import {Pokemon, PokemonRarity, PokeType} from "@prisma/client";
import {capitalizeFirst, generateFlake} from "../../utils/misc";
import {Colours} from "../../@types/Colours";
import db from "../../utils/database";

export default new Command({
    name: 'addpokemon',
    description: 'Add a new Pokémon to the database',
    developerRestricted: true,
    noDefer: true,
    options: [{
        name: 'pokedexid',
        description: 'The Pokédex ID of the Pokémon',
        type: ApplicationCommandOptionType.Integer,
        required: true
    },{
        name: 'name',
        description: 'What is the name of the pokemon?',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'pokerarity',
        description: 'common, uncommon, rare, legend, mythical, ultrabeast, shiny, developer, one only!',
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
    }, {
        name: 'hasalolan',
        description: 'Does the pokémon have alolan version or not?',
        type: ApplicationCommandOptionType.Boolean,
        required: true
    }, {
        name: 'ev_hp',
        description: 'The default HP EV for this Pokémon',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }, {
        name: 'ev_attack',
        description: 'The default Attack EV for this Pokémon',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }, {
        name: 'ev_def',
        description: 'The default Defense EV for this Pokémon',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }, {
        name: 'ev_spatk',
        description: 'The default Special Attack EV for this Pokémon',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }, {
        name: 'ev_spdef',
        description: 'The default Special Defense EV for this Pokémon',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }, {
        name: 'ev_speed',
        description: 'The default Speed EV for this Pokémon',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }],
    run: async ({ interaction, client }) => {
        const pokeId: number | null = interaction.options.getInteger('pokedexid');
        let pokeName: string | null = interaction.options.getString('name');
        let evolveName: string | null = interaction.options.getString('evolvename');
        const pokeRarity: string | null = interaction.options.getString('pokerarity');
        const pokeType: string | null = interaction.options.getString('poketype');
        const evolveStage: number | null = interaction.options.getInteger('currentstage');
        const evolveLevel: number | null = interaction.options.getInteger('evolvelevel');
        const hasAlolan: boolean | null = interaction.options.getBoolean('hasalolan');

        const evHP: number | null = interaction.options.getInteger('ev_hp');
        const evAttack: number | null = interaction.options.getInteger('ev_attack');
        const evDef: number | null = interaction.options.getInteger('ev_def');
        const evSpAtk: number | null = interaction.options.getInteger('ev_spatk');
        const evSpDef: number | null = interaction.options.getInteger('ev_spdef');
        const evSpeed: number | null = interaction.options.getInteger('ev_speed');

        if (!pokeId) return;
        if (!pokeName) return;
        if (!evolveName) return;
        if (!pokeRarity) return;
        if (!pokeType) return;
        if (!evolveStage) return;
        if (!evolveLevel) return;
        if (!hasAlolan === null) return;

        if (!evHP) return;
        if (!evAttack) return;
        if (!evDef) return;
        if (!evSpAtk) return;
        if (!evSpDef) return;
        if (!evSpeed) return;


        pokeName = pokeName.toLowerCase();
        pokeName = capitalizeFirst(pokeName);

        evolveName = evolveName.toLowerCase();
        evolveName = capitalizeFirst(evolveName);

        const pokePicture: string = `https://pgaminghd.github.io/discmon-images/pokemon-sprites/normal/${pokeId}.png`;
        const pokeShinyPicture: string = `https://pgaminghd.github.io/discmon-images/pokemon-sprites/shiny/${pokeId}.png`;

        let pokeAlolanPicture: string | null;
        if (hasAlolan) {
            pokeAlolanPicture = `https://pgaminghd.github.io/discmon-images/pokemon-sprites/alolan/normal/${pokeId}.png`;
        } else {
            pokeAlolanPicture = null;
        }


        if (pokeRarity.toUpperCase() !== PokemonRarity.RARE && pokeRarity.toUpperCase() !== PokemonRarity.COMMON && pokeRarity.toUpperCase() !== PokemonRarity.UNCOMMON && pokeRarity.toUpperCase() !== PokemonRarity.LEGEND && pokeRarity.toUpperCase() !== PokemonRarity.MYTHICAL && pokeRarity.toUpperCase() !== PokemonRarity.ULTRABEAST && pokeRarity.toUpperCase() !== PokemonRarity.SHINY && pokeRarity.toUpperCase() !== PokemonRarity.DEVELOPER)
            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The rarity is invalid, must be of a valid rarity.')]});

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

        if (allTypes.length === 0) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The types field is empty, please enter atleast 1 type.')]});

        const pokemonTypes: any[] = [];
        for (const type of allTypes) {
            if (!pokemonType.includes(type.toUpperCase() as PokeType)) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('One of the entered Pokémon types are invalid.')]});

            pokemonTypes.push({pokemonType: type.toUpperCase(), typeUniqueId: generateFlake()});
        }

        await db.addNewPokemon({
            pokemonId: generateFlake(),
            pokemonPokedex: pokeId,
            pokemonName: pokeName,
            pokemonPicture: pokePicture,
            pokemonRarity: pokeRarity.toUpperCase(),
            pokemonShinyPicture: pokeShinyPicture,
            pokemonAlolanPicture: pokeAlolanPicture,
            pokemonEvolve: {
                create: {
                    evolveUniqueId: generateFlake(),
                    nextEvolveName: evolveName,
                    nextEvolveLevel: evolveLevel,
                    currentEvolveStage: evolveStage,
                }},
            pokemonType: {
                create: pokemonTypes
            },
            pokemonEVs: {
                create: {
                    HP: evHP,
                    Attack: evAttack,
                    Defense: evDef,
                    SpecialAtk: evSpAtk,
                    SpecialDef: evSpDef,
                    Speed: evSpeed,
                }
            }
        });

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`The Pokémon \`${pokeName}\` has been added into the database successfully with all types & evolve data!`)]});
    },
});
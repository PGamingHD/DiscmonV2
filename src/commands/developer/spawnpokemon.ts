import {
    APIEmbed,
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    TextInputStyle
} from 'discord.js';
import { Command } from '../../structures/Command';
import {Pokemon, PokemonRarity, PokemonServer, PokeType} from "@prisma/client";
import {capitalizeFirst, generateFlake} from "../../utils/misc";
import {Colours} from "../../@types/Colours";
import db from "../../utils/database";
import forceSpawn from "../../utils/actions/forceSpawn";

export default new Command({
    name: 'spawnpokemon',
    description: 'Spawn a Pokémon into the server',
    developerRestricted: true,
    noDefer: true,
    options: [{
        name: 'pokename',
        description: 'The name of the pokémon you wish to spawn',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'pokelevel',
        description: 'The level the Pokémon should be spawned at',
        type: ApplicationCommandOptionType.Integer,
        required: true
    }, {
        name: 'maxiv',
        description: 'If the Pokémon should be max IV or randomized',
        type: ApplicationCommandOptionType.Boolean,
        required: true
    }],
    run: async ({ interaction, client }) => {
        let pokeName: string | null = await interaction.options.getString('pokename');
        const pokeLevel: number | null = await interaction.options.getInteger('pokelevel');
        const maxIV: boolean | null = await interaction.options.getBoolean('maxiv');

        if (!pokeName) return;
        if (!pokeLevel) return;
        if (maxIV === null) return;
        if (!interaction.guild) return;

        pokeName = capitalizeFirst(pokeName);

        const getPokemon: Pokemon | null = await db.getPokemon(pokeName);
        const getPokemonServer: PokemonServer | null = await db.getServer(interaction.guild.id);

        if (!getPokemon) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('No Pokémon was found with the specified name, is it valid?')]});
        if (!getPokemonServer) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('No Pokémon Server was found, please send a message first to initialize.')]})

        await forceSpawn(interaction, pokeName, getPokemonServer, pokeLevel, maxIV);

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`The Pokémon \`${pokeName}\` was successfully spawned with level \`${pokeLevel}\`!`)]});
    },
});
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
import {PokemonOrder, userData} from "@prisma/client";


export default new Command({
    name: 'sort',
    description: 'Select how to sort Pokémons by when showing caught ones',
    requireAccount: true,
    noDefer: true,
    options: [{
        name: 'sorting',
        description: 'The sorting algorithm to run by',
        type: ApplicationCommandOptionType.String,
        choices: [{
            name: 'ID',
            value: 'id',
        }, {
            name: 'IVs',
            value: 'iv'
        }, {
            name: 'Level',
            value: 'lvl'
        }, {
            name: 'Favorite',
            value: 'fav'
        }],
        required: true,
    }],
    run: async ({ interaction, client }) => {
        const sorting: string | null = interaction.options.getString('sorting');
        if (!sorting) return;

        const pokeTrainer: userData | null = await db.findPokemonTrainer(interaction.user.id);
        if (!pokeTrainer) return;

        let chosen: PokemonOrder;
        if (sorting === "id") {
            chosen = PokemonOrder.ID
        } else if (sorting === "iv") {
            chosen = PokemonOrder.IV
        } else if (sorting === "lvl") {
            chosen = PokemonOrder.LEVEL
        } else if (sorting === "fav") {
            chosen = PokemonOrder.FAVORITE
        } else {
            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The chosen sorting type is not valid, please try again')]});
        }

        if (pokeTrainer.pokemonOrder === chosen) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The chosen sorting type is already used, please choose another one.')]});

        await db.setTrainerOrder(interaction.user.id, chosen);

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully changed your Pokémon sorting to \`${chosen}\`!`)]});
    }
});
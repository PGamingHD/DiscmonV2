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
import {Pokemon, Pokemons, userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import {capitalizeFirst} from "../../utils/misc";
import {chunk} from 'lodash';
import sendPagination from "../../utils/messages/sendPagination";

export default new Command({
    name: 'pokedex',
    description: 'Get a pokédex of all Pokémons available',
    requireAccount: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        const pokedexMons: any = await db.getAllPokemons();
        const pokemonData: string[] = [];

        for (const pokemon of pokedexMons) {
            const types: string[] = [];
            for (const type of pokemon.pokemonType) {
                types.push(capitalizeFirst(type.pokemonType));
            }
            pokemonData.push(`\`${pokemon.pokemonPokedex}\` *${pokemon.pokemonName}* • *${types.join(', ')}* • __*${capitalizeFirst(pokemon.pokemonRarity)}*__`);
        }

        const pages: string[][] = chunk(pokemonData, 15);
        const embeds: APIEmbed[] = [];

        let currentPage: number = 0;
        for (const page of pages) {
            currentPage++;
            embeds.push({
                title: `🧰 __Pokémon Pokedex__ 🧰`,
                description: `${page.join('\n')}`,
                footer: {
                    text: `Page ${currentPage} of ${pages.length}`
                },
                color: Colours.MAIN
            })
        }

        return sendPagination(interaction, embeds, 120000, 120000, false);
    }
});



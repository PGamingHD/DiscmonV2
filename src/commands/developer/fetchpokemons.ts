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
import sendPagination from "../../utils/messages/sendPagination";
import {chunk} from 'lodash';

export default new Command({
    name: 'fetchpokemons',
    description: 'View all caught Pokémons & spawned',
    developerRestricted: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        const allPokemons: any = await db.findAllPokemons();
        const pokemonData: string[] = [];

        for (const pokemon of allPokemons) {
            const IVpercentage = pokemon.PokemonIVs.HP + pokemon.PokemonIVs.Attack + pokemon.PokemonIVs.Defense + pokemon.PokemonIVs.SpecialAtk + pokemon.PokemonIVs.SpecialDef + pokemon.PokemonIVs.Speed;
            const IVtotal: string = (IVpercentage / 186 * 100).toFixed(2);

            pokemonData.push(`***[${pokemon.pokemonCatch === true ? 'C' : 'S'}]*** ${pokemon.pokemonOwner === null ? '' : `\`${pokemon.pokemonOwner}\``} **${pokemon.pokemonName}** • Lvl. ${pokemon.pokemonLevel} • *IV ${IVtotal}%*`)
        }

        const pages: string[][] = chunk(pokemonData, 15);
        const embeds: APIEmbed[] = [];

        let currentPage: number = 0;
        for (const page of pages) {
            currentPage++;
            embeds.push({
                title: `👑 All Pokémons 👑`,
                description: `${page.join('\n')}`,
                footer: {
                    text: `Page ${currentPage} of ${pages.length}`
                },
                color: Colours.MAIN
            })
        }

        return sendPagination(interaction, embeds, 120000, 120000, true);
    }
});



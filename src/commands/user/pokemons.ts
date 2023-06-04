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
import {userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import sendPagination from "../../utils/messages/sendPagination";
import {chunk} from 'lodash';

export default new Command({
    name: 'pokemons',
    description: 'View all your caught Pokémons',
    requireAccount: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        const ownedPokemons: any = await db.getTrainerPokemons(interaction.user.id);
        const pokemonData: string[] = [];

        for (const pokemon of ownedPokemons) {
            const IVpercentage = pokemon.PokemonIVs.HP + pokemon.PokemonIVs.Attack + pokemon.PokemonIVs.Defense + pokemon.PokemonIVs.SpecialAtk + pokemon.PokemonIVs.SpecialDef + pokemon.PokemonIVs.Speed;
            const IVtotal: string = (IVpercentage / 186 * 100).toFixed(2);

            pokemonData.push(`${pokemon.pokemonSelected ? '**[**' : ''}\`${pokemon.pokemonPlacementId}\`${pokemon.pokemonSelected ? '**]**' : ''} ${pokemon.pokemonFavorite === true ? '⭐' : ''}${pokemon.pokemonPicture.includes('shiny') ? '✨' : ''}${pokemon.pokemonPicture.includes('alolan') ? '💿' : ''} **${pokemon.pokemonName}** • Lvl. ${pokemon.pokemonLevel} • *IV ${IVtotal}%*`)
        }

        const pages: string[][] = chunk(pokemonData, 15);
        const embeds: APIEmbed[] = [];

        let currentPage: number = 0;
        for (const page of pages) {
            currentPage++;
            embeds.push({
                title: `📦 __Your current Pokémons__ 📦`,
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



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
    noDefer: true,
    run: async ({ interaction, client }) => {
        const dataExists: userData | null = await db.findPokemonTrainer(interaction.user.id);
        if (!dataExists) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setDescription('You do not seem to have an account, please register before trying to catch a Pokémon.').setColor(Colours.RED)]});

        const ownedPokemons: any = await db.getTrainerPokemons(interaction.user.id);
        const pokemonData: string[] = [];

        for (const pokemon of ownedPokemons) {
            const IVpercentage = pokemon.PokemonIVs.HP + pokemon.PokemonIVs.Attack + pokemon.PokemonIVs.Defense + pokemon.PokemonIVs.SpecialAtk + pokemon.PokemonIVs.SpecialDef + pokemon.PokemonIVs.Speed;
            const IVtotal: string = (IVpercentage / 186 * 100).toFixed(2);

            pokemonData.push(`\`${pokemon.pokemonPlacementId}\` ${pokemon.pokemonFavorite === true ? '⭐' : ''}${pokemon.pokemonPicture.includes('shiny') ? '✨' : ''}${pokemon.pokemonPicture.includes('alolan') ? '💿' : ''} **${pokemon.pokemonName}** • Lvl. ${pokemon.pokemonLevel} • *IV ${IVtotal}%*`)
        }

        const pages: string[][] = chunk(pokemonData, 15);
        const embeds: APIEmbed[] = [];

        let currentPage: number = 0;
        for (const page of pages) {
            currentPage++;
            embeds.push({
                title: `📦 Your current Pokémons 📦`,
                description: `${page.join('\n')}`,
                footer: {
                    text: `Page ${currentPage} of ${pages.length}`
                },
                color: Colours.MAIN
            })
        }

        await sendPagination(interaction, embeds, 120000, 120000);

        return;
    },
});



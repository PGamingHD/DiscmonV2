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
import {Pokemons} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import sendPagination from "../../utils/messages/sendPagination";
import {capitalizeFirst} from "../../utils/misc";

export default new Command({
    name: 'pokemon',
    description: 'View details of your Pokémons',
    requireAccount: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        const ownedPokemons: any[] = await db.getTrainerPokemons(interaction.user.id);
        const findSelected: Pokemons | null = await db.findUserSelectedPokemon(interaction.user.id);
        if (!findSelected || !findSelected.pokemonPlacementId) return;

        if (ownedPokemons.length === 0) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setDescription('You do not have any Pokémons that could be shown.').setColor(Colours.RED)]});

        const embeds: APIEmbed[] = [];

        let currentPage: number = 0;
        let selectedNum: number = 0;
        for (const pokemon of ownedPokemons) {
            currentPage++;

            if (pokemon.pokemonId === findSelected.pokemonId) selectedNum = currentPage;

            let totalLevelXP;
            if (pokemon.pokemonLevel === 1) {
                totalLevelXP = 500;
            } else {
                totalLevelXP = pokemon.pokemonLevel * 750;
            }

            const IVpercentage = pokemon.PokemonIVs.HP + pokemon.PokemonIVs.Attack + pokemon.PokemonIVs.Defense + pokemon.PokemonIVs.SpecialAtk + pokemon.PokemonIVs.SpecialDef + pokemon.PokemonIVs.Speed;
            const IVtotal: string = (IVpercentage / 186 * 100).toFixed(2);

            embeds.push({
                title: `${pokemon.pokemonFavorite === true ? '⭐' : ''}${pokemon.pokemonPicture.includes('shiny') ? '✨' : ''}${pokemon.pokemonPicture.includes('alolan') ? '💿' : ''} Level. ${pokemon.pokemonLevel} ${pokemon.pokemonName}`,
                description: `__**Details**__\n**XP:** ${pokemon.pokemonLevel === 100 ? totalLevelXP : pokemon.pokemonXP}/${totalLevelXP}\n**Gender:** ${capitalizeFirst(pokemon.pokemonGender)}\n**Nature:** ${capitalizeFirst(pokemon.pokemonNature)}\n\n__**Stats**__\n**HP:** ${pokemon.PokemonIVs.HP}/31\n**Attack:** ${pokemon.PokemonIVs.Attack}\n**Defense:** ${pokemon.PokemonIVs.Defense}/31\n**Special Attack:** ${pokemon.PokemonIVs.SpecialAtk}/31\n**Special Defense:** ${pokemon.PokemonIVs.SpecialDef}/31\n**Speed:** ${pokemon.PokemonIVs.Speed}/31\n**Total IVs:** ${IVtotal}%\n\n__**Extras**__\n**ID:** ${pokemon.pokemonPlacementId}\n**Pokemon ID:** ${pokemon.pokemonId}`,
                image: {
                    url: pokemon.pokemonPicture
                },
                thumbnail: {
                    url: 'https://cdn.discordapp.com/attachments/1010999257899204769/1057280575465082890/4482f729452089.55f35b167dbbe.png'
                },
                footer: {
                    text: `Page ${currentPage} of ${ownedPokemons.length}`
                },
                color: Colours.MAIN
            })
        }

        return sendPagination(interaction, embeds, 120000, 120000, false, selectedNum - 1);
    },
});

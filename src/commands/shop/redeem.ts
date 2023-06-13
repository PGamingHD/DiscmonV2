import {
    ApplicationCommandOptionType,
    ButtonStyle,
    ChannelType,
    ComponentType,
    EmbedBuilder
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {Colours} from "../../@types/Colours";
import {Pokemons, userData} from "@prisma/client";
import {capitalizeFirst, generateFlake, randomizeGender, randomizeNature, randomizeNumber} from "../../utils/misc";

export default new Command({
    name: 'redeem',
    description: 'Use up your redeems to get something good',
    requireAccount: true,
    noDefer: true,
    options: [{
        name: 'pokemon',
        description: 'Redeem a Pokémon of your choice',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'name',
            description: 'Pokémon name to redeem for yourself',
            type: ApplicationCommandOptionType.String,
            required: true,
        }],
    }, {
        name: 'pokecoins',
        description: 'Redeem pokecoins and recieve 50,000 Pokécoins',
        type: ApplicationCommandOptionType.Subcommand,
    }],
    run: async ({ interaction, client }) => {
        if (interaction.options.getSubcommand() === "pokemon") {
            const name: string | null = interaction.options.getString('name');
            if (!name) return;

            const pokemon: any = await db.getPokemon(capitalizeFirst(name));
            const usersData: any = await db.findPokemonTrainer(interaction.user.id);
            if (!usersData) return;

            if (!pokemon) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The Pokémon you tried to redeem is not valid, please try another Pokémon.')]});
            if (usersData.userBag.userRedeems < 1) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('You do not have enough redeems to do this action.')]});

            const levelGeneration: number = await randomizeNumber(10, 30);
            const generatedId: string = generateFlake();

            const HPiv: number = await randomizeNumber(1, 31);
            const ATKiv: number = await randomizeNumber(1, 31);
            const DEFiv: number = await randomizeNumber(1, 31);
            const SPECATKiv: number = await randomizeNumber(1, 31);
            const SPECDEFiv: number = await randomizeNumber(1, 31);
            const SPEEDiv: number = await randomizeNumber(1, 31);

            const IVpercentage = HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
            const IVtotal: string = (IVpercentage / 186 * 100).toFixed(2);

            const getHighestPoke: Pokemons[] = await db.getPokemonNextPokeId(interaction.user.id);

            let incrementId;
            if (getHighestPoke.length === 0 && getHighestPoke[0].pokemonPlacementId === null) incrementId = 1;
            if (getHighestPoke.length >= 1 && getHighestPoke[0].pokemonPlacementId !== null) incrementId = getHighestPoke[0].pokemonPlacementId + 1;
            if (!incrementId) incrementId = 1;

            await db.spawnNewRedeemPokemon(generatedId, interaction.user.id, incrementId, pokemon.pokemonName, pokemon.pokemonPicture, randomizeGender(), randomizeNature(), levelGeneration, {
                HP: HPiv,
                Attack: ATKiv,
                Defense: DEFiv,
                SpecialAtk: SPECATKiv,
                SpecialDef: SPECDEFiv,
                Speed: SPEEDiv,
                pokemonTotalIVs: parseFloat(IVtotal),
            }, {
                HP: pokemon.pokemonEVs.HP,
                Attack: pokemon.pokemonEVs.Attack,
                Defense: pokemon.pokemonEVs.Defense,
                SpecialAtk: pokemon.pokemonEVs.SpecialAtk,
                SpecialDef: pokemon.pokemonEVs.SpecialDef,
                Speed: pokemon.pokemonEVs.Speed,
            });

            await db.setUserRedeems(interaction.user.id, usersData.userBag.userRedeems - 1);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully redeemed a level \`${levelGeneration}\` **${pokemon.pokemonName}**!`)]});
        }

        else if (interaction.options.getSubcommand() === "pokecoins") {
            const usersData: any = await db.findPokemonTrainer(interaction.user.id);
            if (!usersData) return;

            if (usersData.userBag.userRedeems < 1) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('You do not have enough redeems to do this action.')]});

            await db.setCoins(interaction.user.id, usersData.userCoins + 50000);
            await db.setUserRedeems(interaction.user.id, usersData.userBag.userRedeems - 1);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully redeemed 🪙 50,000 Pokécoins!`)]});
        }

        else {
            return;
        }
    },
});



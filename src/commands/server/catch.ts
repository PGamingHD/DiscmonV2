import {
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
import {capitalizeFirst} from "../../utils/misc";

export default new Command({
    name: 'catch',
    description: 'Catch a pokémon that has been spawned',
    requireAccount: true,
    noDefer: true,
    options: [{
        name: 'name',
        description: 'What is the name of the pokemon?',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    run: async ({ interaction, client }) => {
        let pokeName: string | null = interaction.options.getString('name');
        const usersData: any = await db.findPokemonTrainer(interaction.user.id);
        if (!usersData) return;
        if (!pokeName) return;
        if (!interaction.channel) return;

        pokeName = pokeName.toLowerCase();
        pokeName = capitalizeFirst(pokeName);

        const findSpawnedPokemon: Pokemons | null = await db.findSpawnedPokemon(interaction.channel.id, pokeName);
        const getHighestPoke: Pokemons[] = await db.getPokemonNextPokeId(interaction.user.id);

        let incrementId;
        if (getHighestPoke.length === 0 && getHighestPoke[0].pokemonPlacementId === null) incrementId = 1;
        if (getHighestPoke.length >= 1 && getHighestPoke[0].pokemonPlacementId !== null) incrementId = getHighestPoke[0].pokemonPlacementId + 1;
        if (!incrementId) incrementId = 1;

        if (!findSpawnedPokemon) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('The Pokémon name you guessed was wrong, is there a Pokémon spawned in here?')]});

        let challengeObject: any = {};
        if (Object.keys(challengeObject).length === 0) {
            for (const challenge of usersData.userChallenges) {
                const challengeToCatch = challenge.challengesToCatch;
                if (challengeToCatch.toLowerCase() === "shiny" && findSpawnedPokemon.pokemonPicture.includes('shiny') && !challenge.challengesCompleted) {
                    challengeObject = challenge;
                    break;
                }
            }
        }

        if (Object.keys(challengeObject).length === 0) {
            for (const challenge of usersData.userChallenges) {
                const challengeToCatch = challenge.challengesToCatch;
                const getPokemon = await db.getPokemon(findSpawnedPokemon.pokemonName);
                if (!getPokemon) return;
                if (challengeToCatch.toLowerCase() === "legendary" && getPokemon.pokemonRarity === "LEGEND" && !challenge.challengesCompleted) {
                    challengeObject = challenge;
                    break;
                }
            }
        }

        if (Object.keys(challengeObject).length === 0) {
            for (const challenge of usersData.userChallenges) {
                const challengeToCatch = challenge.challengesToCatch;
                if (challengeToCatch === findSpawnedPokemon.pokemonName && !challenge.challengesCompleted) {
                    challengeObject = challenge;
                    break;
                }
            }
        }

        if (Object.keys(challengeObject).length === 0) {
            for (const challenge of usersData.userChallenges) {
                const challengeToCatch = challenge.challengesToCatch;
                if (challengeToCatch.toLowerCase() === "any" && !challenge.challengesCompleted) {
                    challengeObject = challenge;
                    break;
                }
            }
        }

        if (Object.keys(challengeObject).length !== 0) {
            const challenge: any = await db.findChallenge(interaction.user.id, challengeObject.challengesId);
            let newChallenge: any = {};

            if (challenge && !challenge.challengesCompleted) {
                newChallenge = await db.incrementChallengeCaught(challenge.challengesId);
            }

            if (newChallenge && !newChallenge.challengesCompleted && newChallenge.challengesCaughtAmount === newChallenge.challengesAmount) {
                await db.setChallengeCompleted(newChallenge.challengesId);

                if (newChallenge.challengesCoinReward !== null) {
                    await db.setCoins(usersData.userId, usersData.userCoins + newChallenge.challengesCoinReward);
                }

                if (newChallenge.challengesTokenReward !== null) {
                    await db.setTokens(usersData.userId, usersData.userTokens + newChallenge.challengesTokenReward);
                }

                //ADD SAME FUNCTION IF POKEMON AWARD !== null HERE
            }
        }

        try {
            const spawnedMessage = await interaction.channel.messages.fetch(findSpawnedPokemon.spawnedMessage as string);
            await spawnedMessage.edit({embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription(`The Pokémon \`${findSpawnedPokemon.pokemonName}\` has been caught by user ${interaction.user}!`)]});
        } catch {}

        await db.setSpawnedOwner(findSpawnedPokemon.pokemonId, interaction.user.id, incrementId);

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You successfully caught a \`${findSpawnedPokemon.pokemonName}\` at level \`${findSpawnedPokemon.pokemonLevel}\`!`)]});
    },
});



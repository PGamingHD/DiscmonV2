import db from "../database";
import { Cron } from "croner";
import {
  GenerateFlake,
  RandomizeGender,
  RandomizeNature,
  RandomizeNumber,
} from "../misc";
import { PokemonRarity, Pokemons } from "@prisma/client";
import getModifiedSpawnRarity from "./getModifiedSpawnRarity";
import getSpawnRarity from "./getSpawnRarity";

export default async function (userId: string): Promise<void> {
  Cron("*/30 * * * * *", async () => {
    let newBuddyData = await db.GetOneBuddy(userId);
    const usersData: any = await db.FindPokemonTrainer(userId);
    if (!newBuddyData) return;

    if (!newBuddyData.catcherEnabled) return;

    if (
      newBuddyData.catcherNext <= Date.now() &&
      Number(newBuddyData.catcherRefill) + 60000 >= Date.now() &&
      Number(newBuddyData.catcherNext) !== 0
    )
      newBuddyData = await db.SetCatchAvailableStatus(
        newBuddyData.userId,
        true
      );

    if (newBuddyData.catchAvailable) {
      let getRarity: string = ``;

      let isShiny: boolean = false;
      if (newBuddyData.pokemonLuckUpgrade >= 1) {
        getRarity = await getModifiedSpawnRarity();
        const getModifier: string = await getModifiedSpawnRarity();

        if (getModifier === "SHINY") isShiny = true;
      } else {
        getRarity = await getSpawnRarity();
        const getModifier: string = await getSpawnRarity();

        if (getModifier === "SHINY") isShiny = true;
      }

      const getPokemons: number = await db.GetPokemonRarityCount(
        getRarity.toUpperCase() as PokemonRarity
      );
      const randomPokemon: number = await RandomizeNumber(1, getPokemons);

      const pokemonToSpawn: any = await db.GetRandomPokemon(
        getRarity.toUpperCase() as PokemonRarity,
        randomPokemon - 1
      );

      const levelGeneration: number = await RandomizeNumber(1, 20);
      const generatedId: string = GenerateFlake();

      const HPiv: number = await RandomizeNumber(1, 31);
      const ATKiv: number = await RandomizeNumber(1, 31);
      const DEFiv: number = await RandomizeNumber(1, 31);
      const SPECATKiv: number = await RandomizeNumber(1, 31);
      const SPECDEFiv: number = await RandomizeNumber(1, 31);
      const SPEEDiv: number = await RandomizeNumber(1, 31);

      const IVpercentage: number =
        HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
      const IVtotal: string = ((IVpercentage / 186) * 100).toFixed(2);

      const getHighestPoke: Pokemons[] = await db.GetPokemonNextPokeId(
        newBuddyData.userId
      );

      let incrementId;
      if (
        getHighestPoke.length === 0 &&
        getHighestPoke[0].pokemonPlacementId === null
      )
        incrementId = 1;
      if (
        getHighestPoke.length >= 1 &&
        getHighestPoke[0].pokemonPlacementId !== null
      )
        incrementId = getHighestPoke[0].pokemonPlacementId + 1;
      if (!incrementId) incrementId = 1;

      let challengeObject: any = {};
      if (Object.keys(challengeObject).length === 0) {
        for (const challenge of usersData.userChallenges) {
          const challengeToCatch = challenge.challengesToCatch;
          if (
            challengeToCatch.toLowerCase() === "shiny" &&
            pokemonToSpawn.pokemonPicture.includes("shiny") &&
            !challenge.challengesCompleted
          ) {
            challengeObject = challenge;
            break;
          }
        }
      }

      if (Object.keys(challengeObject).length === 0) {
        for (const challenge of usersData.userChallenges) {
          const challengeToCatch = challenge.challengesToCatch;
          const getPokemon = await db.GetPokemon(pokemonToSpawn.pokemonName);
          if (!getPokemon) return;
          if (
            challengeToCatch.toLowerCase() === "legendary" &&
            getPokemon.pokemonRarity === "LEGEND" &&
            !challenge.challengesCompleted
          ) {
            challengeObject = challenge;
            break;
          }
        }
      }

      if (Object.keys(challengeObject).length === 0) {
        for (const challenge of usersData.userChallenges) {
          const challengeToCatch = challenge.challengesToCatch;
          if (
            challengeToCatch === pokemonToSpawn.pokemonName &&
            !challenge.challengesCompleted
          ) {
            challengeObject = challenge;
            break;
          }
        }
      }

      if (Object.keys(challengeObject).length === 0) {
        for (const challenge of usersData.userChallenges) {
          const challengeToCatch = challenge.challengesToCatch;
          if (
            challengeToCatch.toLowerCase() === "any" &&
            !challenge.challengesCompleted
          ) {
            challengeObject = challenge;
            break;
          }
        }
      }

      if (Object.keys(challengeObject).length !== 0) {
        const challenge: any = await db.FindChallenge(
          userId,
          challengeObject.challengesId
        );
        let newChallenge: any = {};

        if (challenge && !challenge.challengesCompleted) {
          newChallenge = await db.IncrementChallengeCaught(
            challenge.challengesId
          );
        }

        if (
          newChallenge &&
          !newChallenge.challengesCompleted &&
          newChallenge.challengesCaughtAmount === newChallenge.challengesAmount
        ) {
          await db.SetChallengeCompleted(newChallenge.challengesId);

          if (newChallenge.challengesCoinReward !== null) {
            await db.SetCoins(
              usersData.userId,
              Number(usersData.userCoins) +
                Number(newChallenge.challengesCoinReward)
            );
          }

          if (newChallenge.challengesTokenReward !== null) {
            await db.SetTokens(
              usersData.userId,
              usersData.userTokens + newChallenge.challengesTokenReward
            );
          }

          //ADD SAME FUNCTION IF POKEMON AWARD !== null HERE
        }
      }

      await db.SpawnNewRedeemPokemon(
        generatedId,
        newBuddyData.userId,
        incrementId,
        pokemonToSpawn.pokemonName,
        isShiny
          ? `https://pgaminghd.github.io/discmon-images/pokemon-sprites/shiny/${pokemonToSpawn.pokemonPokedex}.png`
          : pokemonToSpawn.pokemonPicture,
        RandomizeGender(),
        RandomizeNature(),
        pokemonToSpawn.pokemonRarity,
        levelGeneration,
        {
          HP: HPiv,
          Attack: ATKiv,
          Defense: DEFiv,
          SpecialAtk: SPECATKiv,
          SpecialDef: SPECDEFiv,
          Speed: SPEEDiv,
          pokemonTotalIVs: parseFloat(IVtotal),
        },
        {
          HP: pokemonToSpawn.pokemonEVs.HP,
          Attack: pokemonToSpawn.pokemonEVs.Attack,
          Defense: pokemonToSpawn.pokemonEVs.Defense,
          SpecialAtk: pokemonToSpawn.pokemonEVs.SpecialAtk,
          SpecialDef: pokemonToSpawn.pokemonEVs.SpecialDef,
          Speed: pokemonToSpawn.pokemonEVs.Speed,
        }
      );

      newBuddyData = await db.SetCatchAvailableStatus(
        newBuddyData.userId,
        false
      );
      newBuddyData = await db.SetCatcherNextTime(
        newBuddyData.userId,
        Math.floor(
          Date.now() + 1000 * 60 * (60 / (newBuddyData.pokemonUpgrade + 1))
        )
      );
      newBuddyData = await db.IncremenetCatcherCaught(newBuddyData.userId);
    }

    if (
      newBuddyData.catcherEnabled &&
      newBuddyData.catcherRefill >=
        Date.now() + 1000 * 60 * (60 / (newBuddyData.pokemonUpgrade + 1)) &&
      newBuddyData.catcherNext <= Date.now()
    ) {
      await db.SetCatcherNextTime(
        newBuddyData.userId,
        Math.floor(
          Date.now() + 1000 * 60 * (60 / (newBuddyData.pokemonUpgrade + 1))
        )
      );
    }

    if (newBuddyData.catcherRefill < Date.now()) {
      await db.SetCatcherEnabledStatus(newBuddyData.userId, false);
      await db.SetCatcherNextTime(newBuddyData.userId, 0);
      await db.SetCatcherRefillTime(newBuddyData.userId, 0);
    }
  });
}

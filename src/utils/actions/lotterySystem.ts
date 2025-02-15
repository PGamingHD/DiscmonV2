import { Cron } from "croner";
import db from "../database";
import { GenerateFlake, RandomizeNumber, SendWebhook } from "../misc";
import { Colours } from "../../@types/Colours";
import {
  lotteryGlobal,
  PokemonGender,
  PokemonNature,
  PokemonRarity,
  Pokemons,
  userData,
  userTickets,
} from "@prisma/client";
import getSpawnRarity from "./getSpawnRarity";
import { Client } from "discord.js";

export default async function (client: Client) {
  Cron("0 0 20 * * 2,4,5,0", async () => {
    const boughtTickets: number = await db.CountAllTickets();
    if (boughtTickets === 0) {
      const nextRun: any = Cron("0 0 20 * * 2,4,5,0").nextRun();
      await db.SetNewGlobalLotteryData(0, Math.floor(nextRun), 0, 0);
      await db.DeleteLotteryTickets();

      return SendWebhook(
        "https://canary.discord.com/api/webhooks/1119763216487162026/VlWm-1ajfdzRZtzY4S1PvgkggiEhhZZdHi83D-Z-QidmGTDwQYKt0u2vdZrprdTgAWw-",
        "🎟️ Lottery Results 🎟️",
        "*Due to less than 5 people participating, the lottery was concluded for this time, better luck next time!*",
        Colours.RED
      );
    }

    const globalData: lotteryGlobal | null = await db.GetLotteryGlobals();
    if (!globalData) return;

    if (globalData.currentParticipants < 5) {
      const allTickets = await db.FindAllTickets();
      const uniqueParticipants: string[] = [];
      for (const ticket of allTickets) {
        if (!uniqueParticipants.includes(ticket.ticketsOwner))
          uniqueParticipants.push(`${ticket.ticketsOwner}`);
      }

      for (const userid of uniqueParticipants) {
        const usersData = await db.FindPokemonTrainer(userid);
        if (!usersData) continue;

        const usersTickets: number = await db.CountUserTickets(userid);
        await db.SetCoins(
          userid,
          Number(usersData.userCoins) + usersTickets * 10000
        );

        try {
          const fetchUser = await client.users.fetch(userid);
          await fetchUser.send(
            "The lottery did not have 5 or more users, it was cancelled. You have been fully refunded for this!"
          );
        } catch {}
      }

      const nextRun: any = Cron("0 0 20 * * 2,4,5,0").nextRun();
      await db.SetNewGlobalLotteryData(0, Math.floor(nextRun), 0, 0);
      await db.DeleteLotteryTickets();

      return SendWebhook(
        "https://canary.discord.com/api/webhooks/1119763216487162026/VlWm-1ajfdzRZtzY4S1PvgkggiEhhZZdHi83D-Z-QidmGTDwQYKt0u2vdZrprdTgAWw-",
        "🎟️ Lottery Results 🎟️",
        "*Due to less than 5 people participating, the lottery was concluded for this time, better luck next time!*",
        Colours.RED
      );
    }

    //WINNER 1

    const randomWinner1Ticket: number = await RandomizeNumber(1, boughtTickets);
    const winner1Ticket: userTickets | null = await db.GetSpecificTicket(
      randomWinner1Ticket - 1
    );
    const winner1Award: number = (50 / 100) * Number(globalData.currentJackpot);
    if (!winner1Ticket) return;

    const winner1Data: userData | null = await db.FindPokemonTrainer(
      winner1Ticket.ticketsOwner
    );
    if (!winner1Data) return;

    await db.SetCoins(
      winner1Data.userId,
      Math.floor(Number(winner1Data.userCoins) + winner1Award)
    );

    const spawnedRarity = await getSpawnRarity();
    const getPokemons: number = await db.GetPokemonRarityCount(
      spawnedRarity.toUpperCase() as PokemonRarity
    );
    const randomPokemon: number = await RandomizeNumber(1, getPokemons);

    const pokemonToSpawn: any = await db.GetRandomPokemon(
      spawnedRarity.toUpperCase() as PokemonRarity,
      randomPokemon - 1
    );

    const Nature: PokemonNature[] = [
      PokemonNature.TIMID,
      PokemonNature.BASHFUL,
      PokemonNature.BRAVE,
      PokemonNature.BOLD,
      PokemonNature.CALM,
      PokemonNature.CAREFUL,
      PokemonNature.DOCILE,
      PokemonNature.GENTLE,
      PokemonNature.HARDY,
      PokemonNature.HASTY,
      PokemonNature.IMPISH,
      PokemonNature.JOLLY,
      PokemonNature.LAX,
      PokemonNature.LONELY,
      PokemonNature.MILD,
      PokemonNature.MODEST,
      PokemonNature.NAIVE,
      PokemonNature.NAUGHTY,
      PokemonNature.QUIET,
      PokemonNature.QUIRKY,
      PokemonNature.RASH,
      PokemonNature.RELAXED,
      PokemonNature.SASSY,
      PokemonNature.SERIOUS,
      PokemonNature.TIMID,
    ];

    const Gender: PokemonGender[] = [PokemonGender.MALE, PokemonGender.FEMALE];

    const getHighestPoke: Pokemons[] = await db.GetPokemonNextPokeId(
      winner1Data.userId
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

    const HPiv: number = await RandomizeNumber(1, 31);
    const ATKiv: number = await RandomizeNumber(1, 31);
    const DEFiv: number = await RandomizeNumber(1, 31);
    const SPECATKiv: number = await RandomizeNumber(1, 31);
    const SPECDEFiv: number = await RandomizeNumber(1, 31);
    const SPEEDiv: number = await RandomizeNumber(1, 31);

    const IVpercentage = HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
    const IVtotal: string = ((IVpercentage / 186) * 100).toFixed(2);

    await db.SetNewPokemonOwner(
      GenerateFlake(),
      winner1Data.userId,
      `https://pgaminghd.github.io/discmon-images/pokemon-sprites/shiny/${pokemonToSpawn.pokemonPokedex}.png`,
      pokemonToSpawn.pokemonName,
      Nature[(Math.random() * Nature.length) >> 0],
      Gender[(Math.random() * Gender.length) >> 0],
      pokemonToSpawn.pokemonRarity,
      false,
      incrementId,
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

    try {
      const fetchedUser = await client.users.fetch(winner1Data.userId);
      await fetchedUser.send(
        `Congratulations <@!${winner1Data.userId}>, you won the lottery as winner #1! (Also got a shiny ${pokemonToSpawn.pokemonName})`
      );
    } catch {}

    //WINNER 2

    const randomWinner2Ticket: number = await RandomizeNumber(1, boughtTickets);
    const winner2Ticket: userTickets | null = await db.GetSpecificTicket(
      randomWinner2Ticket - 1
    );
    const winner2Award: number = (30 / 100) * Number(globalData.currentJackpot);
    if (!winner2Ticket) return;

    const winner2Data: userData | null = await db.FindPokemonTrainer(
      winner2Ticket.ticketsOwner
    );
    if (!winner2Data) return;

    await db.SetCoins(
      winner2Data.userId,
      Math.floor(Number(winner2Data.userCoins) + winner2Award)
    );

    try {
      const fetchedUser = await client.users.fetch(winner2Data.userId);
      await fetchedUser.send(
        `Congratulations <@!${winner2Data.userId}>, you won the lottery as winner #2!`
      );
    } catch {}

    //WINNER 3

    const randomWinner3Ticket: number = await RandomizeNumber(1, boughtTickets);
    const winner3Ticket: userTickets | null = await db.GetSpecificTicket(
      randomWinner3Ticket - 1
    );
    const winner3Award: number = (30 / 100) * Number(globalData.currentJackpot);
    if (!winner3Ticket) return;

    const winner3Data: userData | null = await db.FindPokemonTrainer(
      winner3Ticket.ticketsOwner
    );
    if (!winner3Data) return;

    await db.SetCoins(
      winner3Data.userId,
      Math.floor(Number(winner3Data.userCoins) + winner3Award)
    );

    try {
      const fetchedUser = await client.users.fetch(winner3Data.userId);
      await fetchedUser.send(
        `Congratulations <@!${winner3Data.userId}>, you won the lottery as winner #3!`
      );
    } catch {}

    const nextRun: any = Cron("0 0 20 * * 2,4,5,0").nextRun();
    await db.SetNewGlobalLotteryData(0, Math.floor(nextRun), 0, 0);
    await db.DeleteLotteryTickets();

    return SendWebhook(
      "https://canary.discord.com/api/webhooks/1119763216487162026/VlWm-1ajfdzRZtzY4S1PvgkggiEhhZZdHi83D-Z-QidmGTDwQYKt0u2vdZrprdTgAWw-",
      "🎟️ Lottery Results 🎟️",
      `*Lottery winners has been drawn!*\n*Congratulations to all our winners, better luck next time to those who did not win.*\n\n**Winner #1:** <@!${winner1Data.userId}>\n**Winner #2:** <@!${winner2Data.userId}>\n**Winner #3:** <@!${winner3Data.userId}>`,
      Colours.RED
    );
  });
}

import { Event } from "../structures/Event";
import { ActivityType, Events, Guild, Message, TextChannel } from "discord.js";
import db from "../utils/database";
import logger from "../utils/logger";
import { Pokemons } from "@prisma/client";
import { Cron } from "croner";
import { randomizeNumber } from "../utils/misc";
import lotterySystem from "../utils/actions/lotterySystem";

export default new Event(Events.ClientReady, async (client) => {
  const activities: { activity: ActivityType; name: string }[] = [
    {
      activity: ActivityType.Watching,
      name: `over ${client.guilds.cache.reduce(
        (a, g) => a + g.memberCount,
        0
      )} users!`,
    },
    {
      activity: ActivityType.Playing,
      name: `with ${client.guilds.cache.size} guilds!`,
    },
    {
      activity: ActivityType.Watching,
      name: `over the official server!`,
    },
    {
      activity: ActivityType.Watching,
      name: `Help @ /help!`,
    },
    {
      activity: ActivityType.Watching,
      name: `Changes @ /changelogs`,
    },
  ];

  Cron("00 */5 * * * *", async () => {
    const random = await randomizeNumber(1, activities.length);
    client.user?.setActivity({
      type: activities[random - 1].name.includes("Changes")
        ? ActivityType.Watching
        : activities[random].name.includes("guilds!")
        ? ActivityType.Playing
        : ActivityType.Watching,
      name: activities[random - 1].name,
    });
  });

  await lotterySystem(client);

  const auctions: any = await db.FindAllAuctions();
  for (const auction of auctions) {
    const timeLeft: number = parseInt(auction.endTime) - Date.now();

    setTimeout(async (): Promise<void> => {
      const findAuction: any = await db.FindSpecificAuction(auction.auctionId);

      if (findAuction) {
        await db.SetPokemonAuction(auction.pokemon.pokemonId, false);
        await db.RemovePokemonAuction(auction.pokemon.pokemonId);

        if (!findAuction.leaderData) return;

        const findUser = await db.FindPokemonTrainer(findAuction.leaderData);
        const findSeller = await db.FindPokemonTrainer(
          findAuction.pokemon.pokemonOwner
        );

        if (!findUser) return;
        if (!findSeller) return;

        const getHighestPoke: Pokemons[] = await db.GetPokemonNextPokeId(
          findAuction.leaderData
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

        await db.SetPokemonOwner(
          auction.pokemon.pokemonId,
          findAuction.leaderData,
          incrementId
        );
        if (findAuction.leaderData !== findAuction.pokemon.pokemonOwner) {
          await db.SetTokens(
            findAuction.leaderData,
            parseInt(findUser.userTokens.toString()) -
              findAuction.auctionCurrent
          );
          await db.SetTokens(
            findAuction.pokemon.pokemonOwner,
            findSeller.userTokens + findAuction.auctionCurrent
          );
        }
      }
    }, timeLeft);
  }

  const allPokemons: Pokemons[] = await db.FindDeleteCatchablePokemon();
  for (const spawnedPokemon of allPokemons) {
    try {
      const guild: Guild = await client.guilds.fetch(
        spawnedPokemon.spawnedServer as string
      );
      const channel: TextChannel = (await guild.channels.fetch(
        spawnedPokemon.spawnedChannel as string
      )) as TextChannel;
      const message: Message<true> = await channel.messages.fetch(
        spawnedPokemon.spawnedMessage as string
      );
      await message.edit({
        content: `:x: The \`${spawnedPokemon.pokemonName}\` wasn't caught in time and therefore fled, better luck next time!`,
        components: [],
        embeds: [],
      });

      logger.warning(
        `Successfully removed Pokémon ${spawnedPokemon.pokemonName} from guild ${spawnedPokemon.spawnedServer} in channel ${spawnedPokemon.spawnedChannel}!`
      );
    } catch {}
  }

  await db
    .DeleteCatchablePokemon()
    .then(() => logger.warning("Successfully removed all catchable Pokémons!"));
});

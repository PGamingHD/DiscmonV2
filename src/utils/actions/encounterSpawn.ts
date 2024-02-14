import { ChannelType, EmbedBuilder, Message, TextChannel } from "discord.js";
import db from "../database";
import {
  generateFlake,
  randomizeGender,
  randomizeNature,
  randomizeNumber,
  sendWebhookWithImage,
} from "../misc";
import { PokemonRarity, Pokemons, PokemonServer } from "@prisma/client";
import { Colours } from "../../@types/Colours";

export default async function (
  message: Message<boolean>,
  spawnedRarity: string,
  modifierRarity: string,
  serverData: PokemonServer
) {
  if (!message.guild) return;
  if (message.channel.type !== ChannelType.GuildText) return;

  let isShiny: boolean = false;
  if (modifierRarity === "SHINY") isShiny = true;

  const getPokemons: number = await db.getPokemonRarityCount(
    spawnedRarity.toUpperCase() === "SHINY"
      ? "MYTHICAL"
      : (spawnedRarity.toUpperCase() as PokemonRarity)
  );
  const randomPokemon: number = await randomizeNumber(1, getPokemons);

  const pokemonToSpawn: any = await db.getRandomPokemon(
    spawnedRarity.toUpperCase() as PokemonRarity,
    randomPokemon - 1
  );

  let channelToSend: TextChannel;

  if (serverData.serverRedirect) {
    let redirectChannel;
    try {
      redirectChannel = await message.guild.channels.fetch(
        `${serverData.serverRedirect}`
      );
    } catch {
      redirectChannel = message.channel;
    }

    channelToSend = redirectChannel as TextChannel;
  } else {
    channelToSend = message.channel;
  }

  let pic = pokemonToSpawn.pokemonPicture;
  if (isShiny) {
    pic = `https://pgaminghd.github.io/discmon-images/pokemon-sprites/shiny/${pokemonToSpawn.pokemonPokedex}.png`;
  }

  if (!channelToSend) return;
  if (!pokemonToSpawn) return;

  const levelGeneration: number = await randomizeNumber(1, 20);
  const generatedId: string = generateFlake();

  const spawnMessage: Message<true> = await channelToSend.send({
    embeds: [
      new EmbedBuilder()
        .setColor(Colours.YELLOW)
        .setDescription(
          `A wild pokémon has spawned, catch the spawned\n pokémon with \`/catch (name)\` before it flees!`
        )
        .setImage(pic)
        .setFooter({
          text: generatedId,
        }),
    ],
  });

  if (
    pokemonToSpawn.pokemonRarity === PokemonRarity.LEGEND ||
    isShiny ||
    pokemonToSpawn.pokemonRarity === PokemonRarity.ULTRABEAST ||
    pokemonToSpawn.pokemonRarity === PokemonRarity.MYTHICAL
  ) {
    await sendWebhookWithImage(
      "https://canary.discord.com/api/webhooks/1120752699860860968/CF7WjmkTsFmCXtMFQGMtASRgnxKfRGVUvBvY9mvlz45p6BHunjmzan83fRRMeld797fw",
      "👑 Rare Spawn Detected 👑",
      "**A rare spawn has been detected in a guild**",
      pic,
      Colours.MAIN
    );
  }

  const guildId: string = message.guild.id;
  const channelId: string = channelToSend.id;

  const hasSpawnedAlready: Pokemons | null = await db.findSpawnedPokemon(
    channelId,
    pokemonToSpawn.pokemonName
  );

  if (hasSpawnedAlready) {
    try {
      const channel: TextChannel = (await message.guild.channels.fetch(
        hasSpawnedAlready.spawnedChannel as string
      )) as TextChannel;
      if (!channel) return;
      const oldMessage = await channel.messages.fetch(
        hasSpawnedAlready.spawnedMessage as string
      );
      await oldMessage.edit({
        content: `:x: The \`${pokemonToSpawn.pokemonName}\` wasn't caught in time and therefore fled, better luck next time!`,
        embeds: [],
        components: [],
      });
    } catch {}

    await db.deleteSpawnedPokemon(hasSpawnedAlready.pokemonId);
  }

  const HPiv: number = await randomizeNumber(1, 31);
  const ATKiv: number = await randomizeNumber(1, 31);
  const DEFiv: number = await randomizeNumber(1, 31);
  const SPECATKiv: number = await randomizeNumber(1, 31);
  const SPECDEFiv: number = await randomizeNumber(1, 31);
  const SPEEDiv: number = await randomizeNumber(1, 31);

  const IVpercentage = HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
  const IVtotal: string = ((IVpercentage / 186) * 100).toFixed(2);

  await db.spawnNewPokemon(
    guildId,
    channelId,
    spawnMessage.reactions.message.id,
    generatedId,
    pokemonToSpawn.pokemonName,
    pic,
    randomizeGender(),
    randomizeNature(),
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

  await db.setServerSpawnChance(guildId, 0);

  setTimeout(async () => {
    const timeToDel: Pokemons | null = await db.findSpawnedExactPokemon(
      generatedId,
      channelId
    );

    if (timeToDel) {
      await db.deleteSpawnedPokemon(generatedId);

      /*if (spawnMessage) {
                await spawnMessage.delete();
            }*/

      await spawnMessage.edit({
        content: `:x: The \`${pokemonToSpawn.pokemonName}\` wasn't caught in time and therefore fled, better luck next time!`,
        components: [],
        embeds: [],
      });
    }
  }, 1000 * 60 * 2);
}

import { EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../../structures/Command";
import { Colours } from "../../@types/Colours";
import db from "../../utils/database";
import { HintGame } from "../../utils/misc";
import { Pokemons, userData } from "@prisma/client";

export default new Command({
  name: "hint",
  description: "Hint a spawned Pokémon in this channel",
  requireAccount: true,
  noDefer: true,
  run: async ({ interaction, client }) => {
    if (!interaction.channel) return;

    const spawnedPoke: Pokemons | null = await db.FindOneSpawnedPokemon(
      interaction.channel.id
    );
    const userData: userData | null = await db.FindPokemonTrainer(
      interaction.user.id
    );
    if (!userData) return;

    if (!spawnedPoke)
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription("There is currently no spawned Pokémon in here."),
        ],
      });
    if (userData.userCoins < 1000)
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "You cannot afford to get a hint about the spawned Pokémon."
            ),
        ],
      });

    await db.DecreaseCoins(interaction.user.id, 1000);

    const hintReturn: string = await HintGame(spawnedPoke.pokemonName);

    return interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [
        new EmbedBuilder()
          .setColor(Colours.GREEN)
          .setDescription(
            `You paid 1,000 Pokécoins and recieved the hint \`${hintReturn}\``
          ),
      ],
    });
  },
});

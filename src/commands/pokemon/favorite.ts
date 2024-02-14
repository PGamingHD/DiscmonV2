import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { Colours } from "../../@types/Colours";
import db from "../../utils/database";
import { Pokemons } from "@prisma/client";

export default new Command({
  name: "favorite",
  description: "Select a caught Pokémon to be on your favorites list",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "pokeid",
      description: "The pokémon id to add to your favorites list",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  run: async ({ interaction, client }) => {
    const pokeId: number | null = interaction.options.getInteger("pokeid");
    if (!pokeId) return;

    const findPokemon: Pokemons | null = await db.findPlacementPokemon(
      interaction.user.id,
      pokeId
    );
    if (!findPokemon)
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "The ID is not valid, please use `/pokemons` to find all IDs."
            ),
        ],
      });
    if (findPokemon.pokemonAuction)
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "You may not favorite a Pokémon that is added to the auction."
            ),
        ],
      });
    if (findPokemon.pokemonFavorite) {
      await db.setPokemonFavorite(findPokemon.pokemonId, false);

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              "You have successfully removed this Pokémon from your favorites list."
            ),
        ],
      });
    } else {
      await db.setPokemonFavorite(findPokemon.pokemonId, true);

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              "You have successfully added this Pokémon to your favorites list."
            ),
        ],
      });
    }
  },
});

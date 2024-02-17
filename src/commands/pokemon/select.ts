import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { Colours } from "../../@types/Colours";
import db from "../../utils/database";

export default new Command({
  name: "select",
  description: "Select a Pokémon to use in battles and level up",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "pokeid",
      description: "The Pokémon ID to select",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  run: async ({ interaction, client }) => {
    const pokeId: number | null = interaction.options.getInteger("pokeid");
    if (!pokeId) return;

    const findPokemon = await db.FindPlacementPokemon(
      interaction.user.id,
      pokeId
    );
    const findSelected = await db.FindUserSelectedPokemon(interaction.user.id);
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
    if (!findSelected)
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "You do not have a selected Pokémon, please contact a Developer."
            ),
        ],
      });
    if (findPokemon.pokemonSelected)
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "That Pokémon is already selected, please choose another one."
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
              "You may not select a Pokémon that is added to the auction."
            ),
        ],
      });

    await db.SetPokemonSelected(findSelected.pokemonId, false);
    await db.SetPokemonSelected(findPokemon.pokemonId, true);

    return interaction.reply({
      ephemeral: true,
      embeds: [
        new EmbedBuilder()
          .setColor(Colours.GREEN)
          .setDescription(
            `You have successfully selected your \`${findPokemon.pokemonName}\` at level \`${findPokemon.pokemonLevel}\``
          ),
      ],
    });
  },
});

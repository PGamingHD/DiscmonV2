import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../structures/Command";
import { Colours } from "../../@types/Colours";
import db from "../../utils/database";

export default new Command({
  name: "release",
  description: "Release a Pokémon into the wild",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "pokeid",
      description: "The pokémon id to release into the wild",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  run: async ({ interaction, client }) => {
    const pokeId: number | null = interaction.options.getInteger("pokeid");
    if (!pokeId) return;

    const findPokemon = await db.findPlacementPokemon(
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
    if (findPokemon.pokemonSelected)
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "You may not release one of your selected Pokémons."
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
              "You may not release a Pokémon that is added to the auction."
            ),
        ],
      });

    const confirmRow: any = new ActionRowBuilder();
    confirmRow.addComponents([
      new ButtonBuilder()
        .setLabel("Confirm")
        .setEmoji({
          name: "✅",
        })
        .setCustomId("confirm")
        .setStyle(ButtonStyle.Success),
    ]);
    confirmRow.addComponents([
      new ButtonBuilder()
        .setLabel("Deny")
        .setEmoji({
          name: "❌",
        })
        .setCustomId("deny")
        .setStyle(ButtonStyle.Danger),
    ]);

    const mainMsg = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colours.MAIN)
          .setDescription(
            `Please confirm that you wish to release your \`${findPokemon.pokemonName}\` at level \`${findPokemon.pokemonLevel}\`!`
          ),
      ],
      components: [confirmRow],
      ephemeral: true,
    });

    const collector = mainMsg.createMessageComponentCollector({
      idle: 1000 * 120,
      time: 1000 * 120,
      max: 1,
    });

    collector.on("collect", async (interactionCollector) => {
      await interactionCollector.deferUpdate();

      if (interactionCollector.user.id !== interaction.user.id) return;
      if (interactionCollector.customId === "confirm") {
        await db.deleteCaughtPokemon(findPokemon.pokemonId);

        await interactionCollector.editReply({
          embeds: [],
          components: [],
          content: `:white_check_mark: Successfully released your \`${findPokemon.pokemonName}\` into the wilderness!`,
        });
      }

      if (interactionCollector.customId === "deny") {
        collector.stop("Denied Pokémon release");
      }
    });

    collector.on("end", async (collected) => {
      try {
        for (let i = 0; i < confirmRow.components.length; i++) {
          confirmRow.components[i].setDisabled(true);
        }

        await interaction.editReply({
          components: [confirmRow],
        });
      } catch (error: any) {
        if (error.message === "Unknown Message") {
          return;
        } else {
          console.log(error);
        }
      }
    });

    return;
  },
});

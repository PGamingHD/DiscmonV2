import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { Colours } from "../../@types/Colours";
import { PokemonServer } from "@prisma/client";

export default new Command({
  name: "announcer",
  description: "Enable or disable channel announcements on levelups & evolves",
  defaultMemberPermissions: "Administrator",
  noDefer: true,
  options: [
    {
      name: "enable",
      description: "Enable the announcer to announce levelups & evolves",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "disable",
      description: "Disable the announcer to announce levelups & evolves",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async ({ interaction, client }) => {
    if (interaction.options.getSubcommand() === "enable") {
      if (!interaction.guild) return;
      const serverData: PokemonServer | null = await db.GetServer(
        interaction.guild.id
      );

      if (serverData?.serverAnnouncer)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                `Pokémon announcements are already enabled, try disabling them instead.`
              ),
          ],
        });

      await db.SetAnnouncer(interaction.guild.id, true);

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `Pokémon levelups & evolves will now be announced.`
            ),
        ],
      });
    }

    if (interaction.options.getSubcommand() === "disable") {
      if (!interaction.guild) return;
      const serverData: PokemonServer | null = await db.GetServer(
        interaction.guild.id
      );

      if (!serverData?.serverAnnouncer)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                `Pokémon announcements are already disabled, try enabling them instead.`
              ),
          ],
        });

      await db.SetAnnouncer(interaction.guild.id, false);

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `Pokémon levelups & evolves will no longer be announced.`
            ),
        ],
      });
    }

    return;
  },
});

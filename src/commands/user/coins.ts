import { EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { userData } from "@prisma/client";
import { Colours } from "../../@types/Colours";

export default new Command({
  name: "coins",
  description: "View all your current coins owned",
  requireAccount: true,
  noDefer: true,
  run: async ({ interaction, client }) => {
    const usersData: userData | null = await db.FindPokemonTrainer(
      interaction.user.id
    );
    if (!usersData) return;

    return interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [
        new EmbedBuilder()
          .setColor(Colours.GREEN)
          .setAuthor({
            name: interaction.user.username + "'s balance",
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(
            `• 🪙 ${usersData.userCoins.toLocaleString(
              "en-US"
            )} Pokécoins\n• 💎 ${usersData.userTokens.toLocaleString(
              "en-US"
            )} Pokétokens`
          )
          .setTimestamp(),
      ],
    });
  },
});

import { EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { Colours } from "../../@types/Colours";

export default new Command({
  name: "items",
  description: "View all your market items",
  requireAccount: true,
  noDefer: true,
  run: async ({ interaction, client }) => {
    const usersData: any = await db.FindPokemonTrainer(interaction.user.id);
    if (!usersData) return;

    return interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [
        new EmbedBuilder()
          .setColor(Colours.GREEN)
          .setAuthor({
            name: interaction.user.username + "'s items",
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(
            `• \`${usersData.userBag.userRedeems.toLocaleString(
              "en-US"
            )}\` Redeems\n• \`${usersData.userBag.spawnIncense.toLocaleString(
              "en-US"
            )}\` Incenses\n• \`${usersData.userBag.catchBuddyCandy.toLocaleString(
              "en-US"
            )}\` Buddy Candy`
          )
          .setTimestamp(),
      ],
    });
  },
});

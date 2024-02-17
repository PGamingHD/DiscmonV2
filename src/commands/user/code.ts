import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { globalCodes, RewardType, userCodes } from "@prisma/client";
import { Colours } from "../../@types/Colours";
import { CapitalizeFirst } from "../../utils/misc";

export default new Command({
  name: "code",
  description: "Redeem or view information about codes",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "redeem",
      description: "The code you wish to redeem",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ interaction, client }) => {
    const redeem: string | null = interaction.options.getString("redeem");
    if (!interaction.guild) return;

    if (interaction.guild.id !== process.env.guildId)
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "Codes may only be redeemed on our official Discord Server."
            ),
        ],
      });

    if (!redeem) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.MAIN)
            .setTitle("What are codes?")
            .setDescription(
              "Codes are very special that you could redeem and get rewards.\nThese codes are not given out that often and are given in special occations only.\nMake sure to redeem these rewards quick, because they are limited.\n\n*Codes are extemely limited, and can only be obtained through the official discord.*"
            ),
        ],
      });
    } else {
      const toRedeem: globalCodes | null = await db.FindCode(redeem);
      const redeemUser: userCodes | null = await db.FindUserCode(
        interaction.user.id,
        redeem
      );
      if (!toRedeem)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "The code you have entered is invalid!\n\n*Please check the official discord for more information.*"
              ),
          ],
        });
      if (redeemUser)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                `It seems like you have already redeemed this code.\n\n*Please contact staff if this is wrong.*`
              ),
          ],
        });
      if (toRedeem.codeLimitation <= toRedeem.codeRedeemed)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                `The code you have entered has already been used \`${toRedeem.codeLimitation}\` times.`
              ),
          ],
        });

      await db.IncreaseCodeRedeemed(redeem);
      await db.RedeemAttempt(interaction.user.id, redeem);

      if (toRedeem.rewardType === RewardType.COINS) {
        await db.IncreaseCoins(interaction.user.id, toRedeem.rewardAmount);
      } else if (toRedeem.rewardType === RewardType.TOKENS) {
        await db.IncreaseTokens(interaction.user.id, toRedeem.rewardAmount);
      }

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `You have successfully redeemed the code \`${redeem}\` and been awarded with **${toRedeem.rewardAmount.toLocaleString(
                "en-US"
              )}** *${CapitalizeFirst(toRedeem.rewardType)}*`
            ),
        ],
      });
    }
  },
});

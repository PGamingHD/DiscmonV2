import {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { channelIncense } from "@prisma/client";
import { Colours } from "../../@types/Colours";

export default new Command({
  name: "incense",
  description: "Enable the incense in a server channel",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "channel",
      description: "The channel you wish to enable the incense in",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  run: async ({ interaction, client }) => {
    const enableChannel = interaction.options.getChannel("channel");

    if (!enableChannel) return;
    if (!interaction.guild) return;

    if (enableChannel.type !== ChannelType.GuildText)
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "The channel type to enable incenses in must be a Textchannel, please try again with a different channel."
            ),
        ],
      });
    const usersData: any = await db.findPokemonTrainer(interaction.user.id);
    const incenseData: channelIncense | null = await db.findChannelIncense(
      enableChannel.id,
      interaction.guild.id
    );

    if (incenseData) {
      if (incenseData.incenseTimeout <= Date.now()) {
        await db.removeChannelIncense(enableChannel.id);
      } else {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "There is already an incense running in that channel, please wait for the time to run out."
              ),
          ],
        });
      }
    }

    if (usersData.userBag.spawnIncense <= 0)
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.RED)
            .setDescription(
              "You do not have enough redeems to enable the incense."
            ),
        ],
      });

    await db.setTrainerIncenses(
      interaction.user.id,
      usersData.userBag.spawnIncense - 1
    );

    await db.addChannelIncense(
      interaction.guild.id,
      enableChannel.id,
      true,
      Date.now() + 3600000
    );

    return interaction.reply({
      ephemeral: true,
      embeds: [
        new EmbedBuilder()
          .setColor(Colours.GREEN)
          .setDescription(
            `You successfully enabled the incense in channel ${enableChannel} and have increased spawn chance for 1 hour.`
          ),
      ],
    });
  },
});

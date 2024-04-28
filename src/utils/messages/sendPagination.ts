import {
  ActionRowBuilder,
  APIEmbed,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  Collection,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  InteractionCollector,
  Message,
} from "discord.js";
import logger from "../logger";

export default async function (
  interaction: CommandInteraction,
  pages: APIEmbed[],
  time = 60000,
  idle = 60000,
  ephemeral: boolean,
  indexStart: number
) {
  try {
    if (!interaction) throw new Error("Invalid interaction provided");
    if (!pages) throw new Error("No pages provided");
    if (!Array.isArray(pages)) throw new Error("Pages must be an array");

    if (typeof time !== "number") throw new Error("Time must be a number");
    if (time < 30000) throw new Error("Time must be more than 30 seconds");
    if (idle < 30000) throw new Error("Idle time must be more than 30 seconds");
    if (indexStart > pages.length)
      throw new Error("Start must be lower than amount of pages");

    if (!interaction.deferred) await interaction.deferReply({ ephemeral });

    if (pages.length === 1) {
      const page: Message<boolean> = await interaction.editReply({
        embeds: pages,
        components: [],
      });

      return page;
    }

    let maxBack: ButtonBuilder;
    if (pages.length >= 5) {
      maxBack = new ButtonBuilder()
        .setCustomId("maxBack")
        .setEmoji("⏪")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false);
    } else {
      maxBack = new ButtonBuilder()
        .setCustomId("exit1")
        .setEmoji("⬛")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    }
    const prev: ButtonBuilder = new ButtonBuilder()
      .setCustomId("prev")
      .setEmoji("◀")
      .setStyle(ButtonStyle.Success)
      .setDisabled(false);
    const home: ButtonBuilder = new ButtonBuilder()
      .setCustomId("stop")
      .setEmoji("⏹️")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(false);
    const next: ButtonBuilder = new ButtonBuilder()
      .setCustomId("next")
      .setEmoji("▶")
      .setStyle(ButtonStyle.Success)
      .setDisabled(false);
    let maxNext: ButtonBuilder;
    if (pages.length >= 5) {
      maxNext = new ButtonBuilder()
        .setCustomId("maxNext")
        .setEmoji("⏩")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false);
    } else {
      maxNext = new ButtonBuilder()
        .setCustomId("exit")
        .setEmoji("⬛")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    }

    const buttonRow: ActionRowBuilder<ButtonBuilder> =
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        maxBack,
        prev,
        home,
        next,
        maxNext
      );
    let index: number = indexStart;

    const currentPage: Message<boolean> = await interaction.editReply({
      embeds: [pages[index]],
      components: [buttonRow],
    });

    const collector: InteractionCollector<ButtonInteraction<CacheType>> =
      currentPage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time,
        idle,
      });

    collector.on(
      "collect",
      async (i: ButtonInteraction<CacheType>): Promise<void> => {
        try {
          if (!i.deferred) await i.deferUpdate();

          if (i.user.id !== interaction.user.id) {
            await i.followUp({
              embeds: [
                new EmbedBuilder().setDescription(
                  "You do not own this builder."
                ),
              ],
              ephemeral: true,
            });

            return;
          }

          if (i.customId === "prev") {
            if (index > 0) {
              index--;
            } else {
              index = pages.length - 1;
            }
          } else if (i.customId === "stop") {
            collector.stop("Forced stop");
          } else if (i.customId === "next") {
            if (index < pages.length - 1) {
              index++;
            } else {
              index = 0;
            }
          } else if (i.customId === "maxBack") {
            if (index === 0) {
              index = pages.length - 1;
            } else {
              index = 0;
            }
          } else if (i.customId === "maxNext") {
            if (index === pages.length - 1) {
              index = 0;
            } else {
              index = pages.length - 1;
            }
          }

          await currentPage.edit({
            embeds: [pages[index]],
            components: [buttonRow],
          });

          collector.resetTimer();
        } catch (e) {
          logger.error(e);
        }
      }
    );

    collector.on(
      "end",
      async (
        i: Collection<string, ButtonInteraction<CacheType>>,
        reason: string
      ): Promise<void> => {
        if (reason === "messageDelete") return;

        maxBack.setDisabled(true);
        maxNext.setDisabled(true);
        prev.setDisabled(true);
        home.setDisabled(true);
        next.setDisabled(true);

        await currentPage.edit({
          embeds: [pages[index]],
          components: [buttonRow],
        });
      }
    );

    return currentPage;
  } catch (e) {
    logger.error(e);
  }
  return;
}

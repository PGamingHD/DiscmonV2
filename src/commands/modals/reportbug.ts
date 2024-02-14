import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "reportbug",
  description: "Report a bug directly to the project Developers",
  noDefer: true,
  run: async ({ interaction, client }) => {
    const modal = new ModalBuilder()
      .setCustomId("brModal")
      .setTitle("Report a Bug");

    const bugReportInput = new TextInputBuilder()
      .setCustomId("reportedBug")
      .setLabel(`Please explain the bug in detail`)
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(50)
      .setMaxLength(2000)
      .setPlaceholder(
        `Explain your bug in detail, how did it happen? What could've caused it?`
      )
      .setRequired(true);

    const firstActionRow: ActionRowBuilder<AnyComponentBuilder> =
      new ActionRowBuilder().addComponents([bugReportInput]);

    //@ts-ignore
    modal.addComponents([firstActionRow]);

    await interaction.showModal(modal);
  },
});

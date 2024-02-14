import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "suggest",
  description: "Report a bug directly to the project Developers",
  noDefer: true,
  run: async ({ interaction, client }) => {
    const modal = new ModalBuilder()
      .setCustomId("suggestionModal")
      .setTitle("Suggest new Features");

    const suggestionInput = new TextInputBuilder()
      .setCustomId("suggestion")
      .setLabel(`Please explain the feature in details`)
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(50)
      .setMaxLength(2000)
      .setPlaceholder(
        `Explain your feature in detail, what does it do? How would it work?`
      )
      .setRequired(true);

    const firstActionRow: ActionRowBuilder<AnyComponentBuilder> =
      new ActionRowBuilder().addComponents([suggestionInput]);

    //@ts-ignore
    modal.addComponents([firstActionRow]);

    await interaction.showModal(modal);
  },
});

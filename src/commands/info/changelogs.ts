import { APIEmbed, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { Colours } from "../../@types/Colours";
import sendPagination from "../../utils/messages/sendPagination";

export default new Command({
  name: "changelogs",
  description: "Get all changelogs that have been pushed so far",
  noDefer: true,
  run: async ({ interaction, client }) => {
    if (client.changelogFiles.size === 0)
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "There are no changelogs currently added, please wait for changelogs to be added."
            )
            .setColor(Colours.RED),
        ],
      });

    const embeds: APIEmbed[] = [];

    const changelogs: any[] = [];
    for (let i = 0; i < client.changelogFiles.size; i++) {
      const element = client.changelogFiles.get(i + 1);
      changelogs.push(element);
    }

    let currentPage: number = 0;
    for (const changelog of changelogs) {
      currentPage++;

      embeds.push({
        title: changelog.ChangelogTitle,
        description: `${changelog.ChangelogDescription}\n\n*Changelog Date: ${changelog.ChangelogTimestamp}*`,
        thumbnail: {
          url: "https://cdn.discordapp.com/attachments/1010999257899204769/1057280575465082890/4482f729452089.55f35b167dbbe.png",
        },
        footer: {
          text: `Changelog ${currentPage} of ${changelogs.length}`,
        },
        color: Colours.MAIN,
      });
    }

    return sendPagination(
      interaction,
      embeds,
      120000,
      120000,
      false,
      embeds.length - 1
    );
  },
});

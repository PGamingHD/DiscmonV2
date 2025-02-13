import {
  APIEmbed,
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Command } from "../../structures/Command";

import { Colours } from "../../@types/Colours";

import sendPagination from "../../utils/messages/sendPagination";
import { CommandType } from "../../@types";

export default new Command({
  name: "help",
  description: "View all our commands you can use.",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "command",
      description: "The command to get extended help for",
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async ({ interaction, client }) => {
    const isExtending: string | null = interaction.options.getString("command");

    if (!isExtending) {
      const embeds: APIEmbed[] = [];
      embeds.push({
        title: "Discmon Commands",
        color: Colours.MAIN,
        fields: [
          {
            name: "User Commands",
            value:
              "`catch`, `code`, `coins`, `pokedex`, `pokemon`, `pokemons`, `start`, `help`\n`achievements`",
          },
          {
            name: "Pokémon Commands",
            value: "`battle`, `favorite`, `hint`, `release`, `select`, `sort`",
          },
          {
            name: "Info Commands",
            value: "`changelogs`, `leaderboard`, `suggest`, `reportbug`",
          },
          {
            name: "Server Commands",
            value: "`incense`, `invite`, `ping`, `vote`",
          },
          {
            name: "Shop Commands",
            value: "`market`, `store`, `items`, `redeem`, `catchbuddy`",
          },
          {
            name: "Admin Commands",
            value: "`settings`, `redirect`, `announcer`",
          },
        ],
        timestamp: `${new Date().toISOString()}`,
      });

      return sendPagination(interaction, embeds, 60000, 60000, false, 0);
    } else {
      const foundCmd: CommandType | undefined = client.commands.find(
        (command: CommandType): boolean =>
          command.name === isExtending.toLowerCase()
      );

      if (foundCmd) {
        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setTitle(`Display description for command: ${isExtending}`)
              .setDescription(
                `Description:\n\`\`\`${foundCmd.description}\`\`\``
              ),
          ],
        });
      } else {
        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                `The requested command \`${isExtending}\` could not be found, please try again.`
              ),
          ],
        });
      }
    }
  },
});

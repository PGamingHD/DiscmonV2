import { EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { Colours } from "../../@types/Colours";
import os from "os";
import { FormatSeconds } from "../../utils/misc";

export default new Command({
  name: "status",
  description: "View client status",
  noDefer: true,
  run: async ({ interaction, client }) => {
    if (!client.user) return;
    if (!interaction.guild) return;
    if (!client.uptime) return;

    const joinedat = await interaction.guild.members.fetch(`${client.user.id}`);
    if (!joinedat.joinedTimestamp) return;
    const newjoined = Math.floor(joinedat.joinedTimestamp / 1000);

    let platform: string = "Unknown";
    const currentOs = os.platform();

    if (
      currentOs == "linux" ||
      currentOs == "aix" ||
      currentOs == "darwin" ||
      currentOs == "freebsd" ||
      currentOs == "openbsd" ||
      currentOs == "sunos"
    ) {
      platform = "Linux";
    } else {
      platform = "Windows";
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colours.MAIN)
          .setTitle("🤖 Discmon Status 🤖")
          .setDescription(
            "Need help with any commands? View our `/help` command."
          )
          .addFields([
            {
              name: "🎉 Client Birthday",
              value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}>`,
              inline: true,
            },
            {
              name: "Joined On",
              value: `<t:${newjoined}>`,
              inline: true,
            },
            {
              name: "Bot Developer",
              value:
                "[***PGamingHD***](https://discordapp.com/users/266726434855321600/)",
              inline: true,
            },
            {
              name: "Hosting Platform",
              value: `\`\`[ ${platform} ]\`\``,
              inline: true,
            },
            {
              name: "Registered Commands",
              value: `\`[ ${client.commands
                .map((d: any) => d.options)
                .flat()
                .length.toLocaleString("en-US")} ]\``,
              inline: true,
            },
            {
              name: "Total Guilds",
              value: `\`[ ${client.guilds.cache.size.toLocaleString(
                "en-US"
              )} ]\``,
              inline: true,
            },
            {
              name: "Total Channels",
              value: `\`[ ${client.channels.cache.size.toLocaleString(
                "en-US"
              )} ]\``,
              inline: true,
            },
            {
              name: "Cached Users",
              value: `\`[ ${client.users.cache.size.toLocaleString(
                "en-US"
              )} ]\``,
              inline: true,
            },
            {
              name: "Total Users",
              value: `\`[ ${client.guilds.cache
                .reduce((a, g) => a + g.memberCount, 0)
                .toLocaleString("en-US")} ]\``,
              inline: true,
            },
            {
              name: "Bot Uptime",
              value: `\`[ ${FormatSeconds(client.uptime / 1000)} ]\``,
              inline: true,
            },
            {
              name: "Utilized Memory",
              value: `\`[ ${(process.memoryUsage().heapUsed / 1024 / 1024)
                .toFixed(2)
                .toLocaleString()}mb ]\``,
              inline: true,
            },
            {
              name: "Hosting Location",
              value: "`[ Sweden, Stockholm ]`",
              inline: true,
            },
            {
              name: "Bot Version",
              value: `\`V1.0.85_DEV\``,
              inline: true,
            },
          ]),
      ],
    });
  },
});

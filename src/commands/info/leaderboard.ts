import { APIEmbed, EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { userData } from "@prisma/client";
import { Colours } from "../../@types/Colours";
import sendPagination from "../../utils/messages/sendPagination";

export default new Command({
  name: "leaderboard",
  description: "Display all leaderboards",
  noDefer: true,
  run: async ({ interaction, client }) => {
    const data: any[] = [];

    let coinText: string = ``;
    let coinCounter: number = 0;
    const topCoins: userData[] = await db.GetTrainerTopCoins();
    for (const userData of topCoins) {
      coinCounter++;

      try {
        const fetchUser = await client.users.fetch(userData.userId);
        coinText += `**[${coinCounter}]** \`${fetchUser.username}\` • ${userData.userCoins} Coins\n`;
      } catch {}
    }
    data.push(coinText);

    let tokenText: string = ``;
    let tokenCounter: number = 0;
    const topTokens: userData[] = await db.GetTrainerTopTokens();
    for (const userData of topTokens) {
      tokenCounter++;

      try {
        const fetchUser = await client.users.fetch(userData.userId);
        tokenText += `**[${tokenCounter}]** \`${fetchUser.username}\` • ${userData.userTokens} Tokens\n`;
      } catch {}
    }
    data.push(tokenText);

    let battleText: string = ``;
    let battleCounter: number = 0;
    const topBattles: userData[] = await db.GetTrainerTopBattles();
    for (const userData of topBattles) {
      battleCounter++;

      try {
        const fetchUser = await client.users.fetch(userData.userId);
        battleText += `**[${battleCounter}]** \`${fetchUser.username}\` • ${userData.trainerBattles} Battles Won\n`;
      } catch {}
    }
    data.push(battleText);

    const embeds: APIEmbed[] = [];

    let currentPage: number = 0;
    for (const mainData of data) {
      embeds.push({
        title: `${
          mainData.includes("Coins")
            ? "🪙 Coin Leaderboard 🪙"
            : mainData.includes("Tokens")
            ? "💎 Token Leaderboard 💎"
            : mainData.includes("Battles")
            ? "⚔️ Battles Leaderboard ⚔️"
            : "Leaderboard type not found"
        }`,
        description: `${mainData}`,
        thumbnail: {
          url: "https://cdn.discordapp.com/attachments/1010999257899204769/1057280575465082890/4482f729452089.55f35b167dbbe.png",
        },
        footer: {
          text: `${
            mainData.includes("Coins")
              ? "Showing: Coin Leaderboard"
              : mainData.includes("Tokens")
              ? "Showing: Token Leaderboard"
              : mainData.includes("Battles")
              ? "Showing: Battles Leaderboard"
              : "Showing: Type not found"
          }`,
        },
        color: Colours.MAIN,
      });
      currentPage++;
    }

    return sendPagination(interaction, embeds, 120000, 120000, false, 0);
  },
});

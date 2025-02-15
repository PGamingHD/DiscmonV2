import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../utils/database";
import { Colours } from "../../@types/Colours";
import { lotteryGlobal } from "@prisma/client";

export default new Command({
  name: "lottery",
  description: "Why not try your luck in the Pokélottery?",
  requireAccount: true,
  noDefer: true,
  options: [
    {
      name: "buy",
      description: "Buy new lottery tickets",
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  run: async ({ interaction, client }) => {
    const buy: number | null = interaction.options.getInteger("buy");

    if (!buy) {
      const globals: lotteryGlobal | null = await db.GetLotteryGlobals();
      const countTotalTickets: number = await db.CountUserTickets(
        interaction.user.id
      );
      if (!globals) return;

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.MAIN)
            .setTitle("🎟️ Discmon's PokéLottery 🎟️")
            .setDescription(
              "*Welcome to Discmon's Pokélottery, read below for more information about our system.*\n\n*• Jackpot is made out of **50%** of ticket purchases*\n*• Lottery winners are drawn every **Tue**, **Thurs**, **Fri**, **Sun** at **9PM CET**.*\n*• Rewards are split between 3 winners.*\n*• Ticket Purchases are closed **15 minutes** before and after draws.*\n\n*• Winner #1: 50% of jackpot + random shiny.*\n*• Winner #2: 30% of jackpot.*\n*• Winner #3: 20% of jackpot.*\n\n*Ticket costs are 🪙 **10,000** Pokécoins per ticket.*"
            )
            .setTimestamp()
            .addFields([
              {
                name: "Jackpot",
                value: `🪙 **${globals.currentJackpot.toLocaleString(
                  "en-US"
                )}**`,
                inline: true,
              },
              {
                name: "Participants",
                value: `👤 **${globals.currentParticipants.toLocaleString(
                  "en-US"
                )}**`,
                inline: true,
              },
              {
                name: "Entries",
                value: `🎫 **${globals.totalBought.toLocaleString("en-US")}**`,
                inline: true,
              },
              {
                name: "Ending",
                value: `🕰️ <t:${Math.floor(
                  Number(globals.currentlyEnding) / 1000
                )}:R>`,
                inline: true,
              },
              {
                name: "Your Entries",
                value: `🎫 **${countTotalTickets.toLocaleString("en-US")}**`,
                inline: true,
              },
              {
                name: "Your win chance",
                value: `${
                  Number(globals.totalBought) === 0
                    ? "No tickets bought yet"
                    : `${
                        (
                          (countTotalTickets / Number(globals.totalBought)) *
                          100
                        ).toFixed(2) + "%"
                      }`
                }`,
                inline: true,
              },
            ]),
        ],
      });
    } else {
      const usersData = await db.FindPokemonTrainer(interaction.user.id);
      const findGlobals = await db.GetLotteryGlobals();
      if (!usersData) return;
      if (!findGlobals) return;

      if (
        Number(findGlobals.currentlyEnding) - 900000 < Date.now() ||
        Number(findGlobals.currentlyEnding) - Date.now() < 900000
      )
        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "Ticket purchases are closed **15 minutes** before and after lottery draws."
              ),
          ],
        });
      if (usersData.userCoins < buy * 10000)
        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setColor(Colours.RED)
              .setDescription(
                "You cannot afford to purchase that amount of tickets."
              ),
          ],
        });

      const toPush = [];
      for (let i: number = 0; i < buy; i++) {
        toPush.push({ ticketsOwner: interaction.user.id });
      }

      const findTickets = await db.FindUserTickets(interaction.user.id);

      await db.SetCoins(
        interaction.user.id,
        Number(usersData.userCoins) - buy * 10000
      );

      await db.AddNewTickets(toPush);
      await db.IncrementTotalEntries(buy);
      await db.IncrementTotalJackpot((buy * 10000) / 2);
      if (!findTickets) await db.IncrementLotteryPars();

      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setColor(Colours.GREEN)
            .setDescription(
              `You have successfully purchased \`${buy.toLocaleString(
                "en-US"
              )}\` new tickets.`
            ),
        ],
      });
    }
  },
});

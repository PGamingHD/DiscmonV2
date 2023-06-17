import {
    ApplicationCommandOptionType,
    ButtonStyle,
    ChannelType,
    ComponentType,
    EmbedBuilder
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {Colours} from "../../@types/Colours";
import {lotteryGlobal, userData} from "@prisma/client";

export default new Command({
    name: 'lottery',
    description: 'Why not try your luck in the Pokélottery?',
    requireAccount: true,
    noDefer: true,
    options: [{
        name: 'buy',
        description: 'Buy new lottery tickets',
        type: ApplicationCommandOptionType.Integer,
    }],
    run: async ({ interaction, client }) => {
        const buy: number | null = interaction.options.getInteger('buy');

        if (!buy) {
            const globals: lotteryGlobal | null = await db.getLotteryGlobals();
            const countTotalTickets: number = await db.countUserTickets(interaction.user.id);
            if (!globals) return;

            return interaction.reply({embeds: [new EmbedBuilder().setColor(Colours.MAIN).setTitle('🎟️ Discmon\'s PokéLottery 🎟️').setDescription('*Welcome to Discmon\'s Pokélottery, read below for more information about our system.*\n\n*• Jackpot is made out of **50%** of ticket purchases*\n*• Lottery winners are drawn every **Sun**, **Tue**, **Thurs**, **Fri** at **8PM CET**.*\n*• Rewards are split between 3 winners.*\n\n*• Winner #1: 50% of jackpot + random shiny.*\n*• Winner #2: 30% of jackpot.*\n*• Winner #3: 20% of jackpot.*').setTimestamp().addFields([{name: 'Jackpot', value: `🪙 **${globals.currentJackpot.toLocaleString('en-US')}**`, inline: true}, {name: 'Participants', value: `👤 **${globals.currentParticipants.toLocaleString('en-US')}**`, inline: true}, {name: 'Entries', value: `🎫 **${globals.totalBought.toLocaleString('en-US')}**`, inline: true}, {name: 'Ending', value: `🕰️ <t:${Math.floor(Number(globals.currentlyEnding) / 1000)}:R>`, inline: true}, {name: 'Your Entries', value: `🎫 **${countTotalTickets.toLocaleString('en-US')}**`, inline: true}, {name: 'Your win chance', value: `${Number(globals.totalBought) === 0 ? 'No tickets bought yet' : `${((countTotalTickets / Number(globals.totalBought)) * 100).toFixed(2) + '%'}`}`, inline: true}])]})
        } else {
            const usersData = await db.findPokemonTrainer(interaction.user.id);
            if (!usersData) return;

            if (usersData.userCoins < buy * 10000) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('You cannot afford to purchase that amount of tickets.')]});

            const toPush = [];
            for (let i: number = 0; i < buy; i++) {
                toPush.push({ticketsOwner: interaction.user.id});
            }

            const findTickets = await db.findUserTickets(interaction.user.id);

            await db.setCoins(interaction.user.id, usersData.userCoins - buy * 10000);

            await db.addNewTickets(toPush);
            await db.incrementTotalEntries(buy);
            await db.incrementTotalJackpot((buy * 10000) / 2);
            if (!findTickets) await db.incrementLotteryPars();

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully purchased \`${buy.toLocaleString('en-US')}\` new tickets.`)]});
        }
    },
});



import {
    ApplicationCommandOptionType,
    ButtonStyle,
    ChannelType,
    ComponentType,
    EmbedBuilder, Role
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {channelIncense, Pokemons, TrainerRanks, userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import {capitalizeFirst} from "../../utils/misc";

export default new Command({
    name: 'claimrank',
    description: 'Claim a donator rank or Staff Rank in the Main Discord',
    requireAccount: true,
    noDefer: true,
    main: true,
    run: async ({ interaction, client }) => {
        const usersData = await db.findPokemonTrainer(interaction.user.id);
        if (!usersData) return;
        if (!interaction.guild) return;
        if (!interaction.member) return;

        if (usersData.trainerRank === TrainerRanks.BRONZE_TRAINER) {
            const bronzeRole: Role | null = await interaction.guild.roles.fetch('1119603015524024350');
            if (!bronzeRole) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`No \`Bronze Trainer\` role was found, please contact a Staff Member.`)]});

            // @ts-ignore
            if (interaction.member.roles.cache.has(bronzeRole.id)) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You already have the \`Bronze Trainer\` rank.`)]});

            // @ts-ignore
            await interaction.member.roles.add(bronzeRole);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully been given the \`Bronze Trainer\` rank, thank you for your support!`)]});
        } else if (usersData.trainerRank === TrainerRanks.SILVER_TRAINER) {
            const silverRole: Role | null = await interaction.guild.roles.fetch('1119603226761769060');
            if (!silverRole) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`No \`Silver Trainer\` role was found, please contact a Staff Member.`)]});

            // @ts-ignore
            if (interaction.member.roles.cache.has(silverRole.id)) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You already have the \`Silver Trainer\` rank.`)]});

            // @ts-ignore
            await interaction.member.roles.add(silverRole);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully been given the \`Silver Trainer\` rank, thank you for your support!`)]});
        } else if (usersData.trainerRank === TrainerRanks.GOLD_TRAINER) {
            const goldRole: Role | null = await interaction.guild.roles.fetch('1119603347989733537');
            if (!goldRole) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`No \`Gold Trainer\` role was found, please contact a Staff Member.`)]});

            // @ts-ignore
            if (interaction.member.roles.cache.has(goldRole.id)) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You already have the \`Gold Trainer\` rank.`)]});

            // @ts-ignore
            await interaction.member.roles.add(goldRole);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully been given the \`Gold Trainer\` rank, thank you for your support!`)]});
        } else if (usersData.trainerRank === TrainerRanks.PLATINUM_TRAINER) {
            const platinumRole: Role | null = await interaction.guild.roles.fetch('1119603423852105758');
            if (!platinumRole) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`No \`Platinum Trainer\` role was found, please contact a Staff Member.`)]});

            // @ts-ignore
            if (interaction.member.roles.cache.has(platinumRole.id)) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You already have the \`Platinum Trainer\` rank.`)]});

            // @ts-ignore
            await interaction.member.roles.add(platinumRole);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully been given the \`Platinum Trainer\` rank, thank you for your support!`)]});
        } else if (usersData.trainerRank === TrainerRanks.MODERATOR) {
            const modRole: Role | null = await interaction.guild.roles.fetch('1070101977297600654');
            if (!modRole) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`No \`Moderator\` role was found, please contact a Staff Member.`)]});

            // @ts-ignore
            if (interaction.member.roles.cache.has(modRole.id)) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You already have the \`Moderator\` rank.`)]});

            // @ts-ignore
            await interaction.member.roles.add(modRole);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully been given the \`Moderator\` rank, welcome Staff Member!`)]});
        } else if (usersData.trainerRank === TrainerRanks.ADMINISTRATOR) {
            const adminRole: Role | null = await interaction.guild.roles.fetch('1010999169701392464');
            if (!adminRole) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`No \`Administrator\` role was found, please contact a Staff Member.`)]});

            // @ts-ignore
            if (interaction.member.roles.cache.has(adminRole.id)) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You already have the \`Administrator\` rank.`)]});

            // @ts-ignore
            await interaction.member.roles.add(adminRole);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully been given the \`Administrator\` rank, welcome Staff Member!`)]});
        } else if (usersData.trainerRank === TrainerRanks.DEVELOPER) {
            const devRole: Role | null = await interaction.guild.roles.fetch('1011002806808875089');
            if (!devRole) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`No \`Developer\` role was found, please contact a Staff Member.`)]});

            // @ts-ignore
            if (interaction.member.roles.cache.has(devRole.id)) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You already have the \`Developer\` rank.`)]});

            // @ts-ignore
            await interaction.member.roles.add(devRole);

            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You have successfully been given the \`Developer\` rank, welcome Developer!`)]});
        } else {
            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`You do not have any Supporter Roles or Staff Roles, is this a mistake contact a Staff Member.`)]});
        }
    },
});



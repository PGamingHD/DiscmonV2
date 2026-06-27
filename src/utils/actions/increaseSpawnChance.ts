import {
  channelIncense,
  PokemonServer,
  TrainerRanks,
  userData,
} from "@prisma/client";
import { ExtendedClient } from "../../structures/Client";
import { Message } from "discord.js";
import db from "../database";
import { RandomizeNumber } from "../misc";
import redis from "../redis";

export default async function (
  serverData: PokemonServer,
  client: ExtendedClient,
  message: Message<boolean>,
) {
  const usersData: userData | null = await db.FindPokemonTrainer(
    message.author.id,
  );
  if (serverData.serverBlacklisted) return;
  if (!message.guild) return;

  let hasCooldown = false;

  if (redis.isConnected()) {
    hasCooldown = await redis.hasCooldown(`cooldown:award:${message.guild.id}`);
  } else {
    hasCooldown = client.awardCooldowns.has(message.guild.id);
  }

  if (!hasCooldown) {
    const getChannelIncense: channelIncense | null =
      await db.FindChannelIncense(message.channel.id, message.guild.id);
    if (getChannelIncense) {
      if (getChannelIncense.incenseTimeout <= Date.now()) {
        await db.RemoveChannelIncense(message.channel.id);

        if (
          !usersData ||
          usersData.trainerRank === TrainerRanks.NORMAL_TRAINER
        ) {
          const incrementAmount: number = await RandomizeNumber(1, 3);

          await db.IncrementServerSpawnChance(
            message.guild.id,
            incrementAmount,
          );
        } else if (usersData.trainerRank === TrainerRanks.BRONZE_TRAINER) {
          const incrementAmount: number = await RandomizeNumber(2, 4);

          await db.IncrementServerSpawnChance(
            message.guild.id,
            incrementAmount,
          );
        } else if (usersData.trainerRank === TrainerRanks.SILVER_TRAINER) {
          const incrementAmount: number = await RandomizeNumber(2, 5);

          await db.IncrementServerSpawnChance(
            message.guild.id,
            incrementAmount,
          );
        } else if (usersData.trainerRank === TrainerRanks.GOLD_TRAINER) {
          const incrementAmount: number = await RandomizeNumber(2, 6);

          await db.IncrementServerSpawnChance(
            message.guild.id,
            incrementAmount,
          );
        } else if (usersData.trainerRank === TrainerRanks.PLATINUM_TRAINER) {
          const incrementAmount: number = await RandomizeNumber(2, 7);

          await db.IncrementServerSpawnChance(
            message.guild.id,
            incrementAmount,
          );
        } else if (
          usersData.trainerRank === TrainerRanks.MODERATOR ||
          usersData.trainerRank === TrainerRanks.ADMINISTRATOR ||
          usersData.trainerRank === TrainerRanks.DEVELOPER
        ) {
          await db.IncrementServerSpawnChance(message.guild.id, 10);
        }

        if (redis.isConnected()) {
          await redis.setCooldown(`cooldown:award:${message.guild.id}`, 5);
        } else {
          client.awardCooldowns.set(
            message.guild.id,
            "Server set on 5 second cooldown",
          );

          setTimeout(async () => {
            if (!message.guild) return;
            client.awardCooldowns.delete(message.guild.id);
          }, 1000 * 5);
        }
      } else {
        if (
          !usersData ||
          usersData.trainerRank === TrainerRanks.NORMAL_TRAINER
        ) {
          const incrementAmount: number = await RandomizeNumber(2, 6);

          await db.IncrementServerSpawnChance(
            message.guild.id,
            incrementAmount,
          );
        } else if (usersData.trainerRank === TrainerRanks.BRONZE_TRAINER) {
          const incrementAmount: number = await RandomizeNumber(4, 8);

          await db.IncrementServerSpawnChance(
            message.guild.id,
            incrementAmount,
          );
        } else if (usersData.trainerRank === TrainerRanks.SILVER_TRAINER) {
          const incrementAmount: number = await RandomizeNumber(4, 10);

          await db.IncrementServerSpawnChance(
            message.guild.id,
            incrementAmount,
          );
        } else if (usersData.trainerRank === TrainerRanks.GOLD_TRAINER) {
          const incrementAmount: number = await RandomizeNumber(4, 12);

          await db.IncrementServerSpawnChance(
            message.guild.id,
            incrementAmount,
          );
        } else if (usersData.trainerRank === TrainerRanks.PLATINUM_TRAINER) {
          const incrementAmount: number = await RandomizeNumber(4, 14);

          await db.IncrementServerSpawnChance(
            message.guild.id,
            incrementAmount,
          );
        } else if (
          usersData.trainerRank === TrainerRanks.MODERATOR ||
          usersData.trainerRank === TrainerRanks.ADMINISTRATOR ||
          usersData.trainerRank === TrainerRanks.DEVELOPER
        ) {
          await db.IncrementServerSpawnChance(message.guild.id, 15);
        }

        if (redis.isConnected()) {
          await redis.setCooldown(`cooldown:award:${message.guild.id}`, 5);
        } else {
          client.awardCooldowns.set(
            message.guild.id,
            "Server set on 5 second cooldown",
          );

          setTimeout(async () => {
            if (!message.guild) return;
            client.awardCooldowns.delete(message.guild.id);
          }, 1000 * 5);
        }
      }
    } else {
      if (!usersData || usersData.trainerRank === TrainerRanks.NORMAL_TRAINER) {
        const incrementAmount: number = await RandomizeNumber(1, 3);

        await db.IncrementServerSpawnChance(message.guild.id, incrementAmount);
      } else if (usersData.trainerRank === TrainerRanks.BRONZE_TRAINER) {
        const incrementAmount: number = await RandomizeNumber(2, 4);

        await db.IncrementServerSpawnChance(message.guild.id, incrementAmount);
      } else if (usersData.trainerRank === TrainerRanks.SILVER_TRAINER) {
        const incrementAmount: number = await RandomizeNumber(2, 5);

        await db.IncrementServerSpawnChance(message.guild.id, incrementAmount);
      } else if (usersData.trainerRank === TrainerRanks.GOLD_TRAINER) {
        const incrementAmount: number = await RandomizeNumber(2, 6);

        await db.IncrementServerSpawnChance(message.guild.id, incrementAmount);
      } else if (usersData.trainerRank === TrainerRanks.PLATINUM_TRAINER) {
        const incrementAmount: number = await RandomizeNumber(2, 7);

        await db.IncrementServerSpawnChance(message.guild.id, incrementAmount);
      } else if (
        usersData.trainerRank === TrainerRanks.MODERATOR ||
        usersData.trainerRank === TrainerRanks.ADMINISTRATOR ||
        usersData.trainerRank === TrainerRanks.DEVELOPER
      ) {
        await db.IncrementServerSpawnChance(message.guild.id, 10);
      }

      if (redis.isConnected()) {
        await redis.setCooldown(`cooldown:award:${message.guild.id}`, 5);
      } else {
        client.awardCooldowns.set(
          message.guild.id,
          "Server set on 5 second cooldown",
        );

        setTimeout(async () => {
          if (!message.guild) return;
          client.awardCooldowns.delete(message.guild.id);
        }, 1000 * 5);
      }
    }
  }
}

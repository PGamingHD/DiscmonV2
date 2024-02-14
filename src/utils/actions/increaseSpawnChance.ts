import {
  channelIncense,
  PokemonServer,
  TrainerRanks,
  userData,
} from "@prisma/client";
import { ExtendedClient } from "../../structures/Client";
import { Message } from "discord.js";
import db from "../database";

export default async function (
  serverData: PokemonServer,
  client: ExtendedClient,
  message: Message<boolean>
) {
  const usersData: userData | null = await db.findPokemonTrainer(
    message.author.id
  );
  if (serverData.serverBlacklisted) return;
  if (!message.guild) return;

  if (!client.awardCooldowns.has(message.guild.id)) {
    const getChannelIncense: channelIncense | null =
      await db.findChannelIncense(message.channel.id, message.guild.id);
    if (getChannelIncense) {
      if (getChannelIncense.incenseTimeout <= Date.now()) {
        await db.removeChannelIncense(message.channel.id);

        if (
          !usersData ||
          usersData.trainerRank === TrainerRanks.NORMAL_TRAINER
        ) {
          await db.incrementServerSpawnChance(message.guild.id, 1);
        } else if (usersData.trainerRank === TrainerRanks.BRONZE_TRAINER) {
          await db.incrementServerSpawnChance(message.guild.id, 2);
        } else if (usersData.trainerRank === TrainerRanks.SILVER_TRAINER) {
          await db.incrementServerSpawnChance(message.guild.id, 3);
        } else if (usersData.trainerRank === TrainerRanks.GOLD_TRAINER) {
          await db.incrementServerSpawnChance(message.guild.id, 4);
        } else if (usersData.trainerRank === TrainerRanks.PLATINUM_TRAINER) {
          await db.incrementServerSpawnChance(message.guild.id, 5);
        } else if (
          usersData.trainerRank === TrainerRanks.MODERATOR ||
          usersData.trainerRank === TrainerRanks.ADMINISTRATOR ||
          usersData.trainerRank === TrainerRanks.DEVELOPER
        ) {
          await db.incrementServerSpawnChance(message.guild.id, 10);
        }

        client.awardCooldowns.set(
          message.guild.id,
          "Server set on 5 second cooldown"
        );
        setTimeout(() => {
          if (!message.guild) return;
          client.awardCooldowns.delete(message.guild.id);
        }, 1000 * 5);
      } else {
        if (
          !usersData ||
          usersData.trainerRank === TrainerRanks.NORMAL_TRAINER
        ) {
          await db.incrementServerSpawnChance(message.guild.id, 5);
        } else if (usersData.trainerRank === TrainerRanks.BRONZE_TRAINER) {
          await db.incrementServerSpawnChance(message.guild.id, 6);
        } else if (usersData.trainerRank === TrainerRanks.SILVER_TRAINER) {
          await db.incrementServerSpawnChance(message.guild.id, 7);
        } else if (usersData.trainerRank === TrainerRanks.GOLD_TRAINER) {
          await db.incrementServerSpawnChance(message.guild.id, 8);
        } else if (usersData.trainerRank === TrainerRanks.PLATINUM_TRAINER) {
          await db.incrementServerSpawnChance(message.guild.id, 10);
        } else if (
          usersData.trainerRank === TrainerRanks.MODERATOR ||
          usersData.trainerRank === TrainerRanks.ADMINISTRATOR ||
          usersData.trainerRank === TrainerRanks.DEVELOPER
        ) {
          await db.incrementServerSpawnChance(message.guild.id, 15);
        }

        client.awardCooldowns.set(
          message.guild.id,
          "Server set on 5 second cooldown"
        );
        setTimeout(() => {
          if (!message.guild) return;
          client.awardCooldowns.delete(message.guild.id);
        }, 1000 * 5);
      }
    } else {
      if (!usersData || usersData.trainerRank === TrainerRanks.NORMAL_TRAINER) {
        await db.incrementServerSpawnChance(message.guild.id, 1);
      } else if (usersData.trainerRank === TrainerRanks.BRONZE_TRAINER) {
        await db.incrementServerSpawnChance(message.guild.id, 2);
      } else if (usersData.trainerRank === TrainerRanks.SILVER_TRAINER) {
        await db.incrementServerSpawnChance(message.guild.id, 3);
      } else if (usersData.trainerRank === TrainerRanks.GOLD_TRAINER) {
        await db.incrementServerSpawnChance(message.guild.id, 4);
      } else if (usersData.trainerRank === TrainerRanks.PLATINUM_TRAINER) {
        await db.incrementServerSpawnChance(message.guild.id, 5);
      } else if (
        usersData.trainerRank === TrainerRanks.MODERATOR ||
        usersData.trainerRank === TrainerRanks.ADMINISTRATOR ||
        usersData.trainerRank === TrainerRanks.DEVELOPER
      ) {
        await db.incrementServerSpawnChance(message.guild.id, 10);
      }

      client.awardCooldowns.set(
        message.guild.id,
        "Server set on 5 second cooldown"
      );
      setTimeout(() => {
        if (!message.guild) return;
        client.awardCooldowns.delete(message.guild.id);
      }, 1000 * 5);
    }
  }
}

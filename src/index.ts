require("dotenv").config();
import { ShardingManager } from "discord.js";
import logger from "./utils/logger";

const manager: ShardingManager = new ShardingManager(__dirname + "/bot.js", {
  totalShards: "auto",
  respawn: true,
  token: process.env.TOKEN,
});

manager.on("shardCreate", (shard) => {
  logger.shard(`Launched shard ${shard.id}`);
});

manager.spawn({ timeout: -1 });

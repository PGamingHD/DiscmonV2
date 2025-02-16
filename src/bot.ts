import { Events } from "discord.js";
import { ExtendedClient } from "./structures/Client";
import logger from "./utils/logger";

export const client = new ExtendedClient();

client.start();

//CLIENT
client.on(Events.Warn, (e: any) => logger.warning(e));
client.on(Events.Debug, (e: any) => logger.debug(e));
client.on(Events.Error, (e: any) => logger.warning(e));

//SHARDS
client.on(Events.ShardError, (e: any) => logger.error(e));
client.on(Events.ShardDisconnect, (e: any) => logger.error(e));

//PROCESS
process.on("unhandledRejection", (e: any) => logger.error(e));
process.on("uncaughtException", (e: any) => logger.error(e));

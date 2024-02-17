import { Events } from "discord.js";
import { ExtendedClient } from "./structures/Client";
import logger from "./utils/logger";

export const client = new ExtendedClient();

client.start();

client.on(Events.Warn, (e: any) => logger.warning(e));
client.on(Events.Debug, (e: any) => logger.debug(e));
client.on(Events.Error, (e: any) => logger.warning(e));

process.on("unhandledRejection", (e: any) => logger.error(e));
process.on("uncaughtException", (e: any) => logger.error(e));

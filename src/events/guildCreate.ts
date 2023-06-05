import {Event} from "../structures/Event";
import {Events, Guild, Message, TextChannel} from "discord.js";
import db from "../utils/database";
import logger from "../utils/logger";
import {Pokemons, PokemonServer} from "@prisma/client";
import {readdirSync} from "fs";

export default new Event(Events.GuildCreate, async (guild) => {
    const guildData: PokemonServer | null = await db.getServer(guild.id);

    if (!guildData) await db.addServer(guild.id);
});
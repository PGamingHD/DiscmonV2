import {Event} from "../structures/Event";
import {
    ChannelType,
    EmbedBuilder,
    Events,
    Guild, GuildBasedChannel,
    GuildMember,
    Message,
    PermissionFlagsBits,
    TextChannel
} from "discord.js";
import db from "../utils/database";
import logger from "../utils/logger";
import {PokemonServer} from "@prisma/client";
import {Colours} from "../@types/Colours";

export default new Event(Events.GuildCreate, async (guild) => {
    logger.log("I just joined a guild called " + guild.name + " (" +  guild.id + ")");
    const guildData: PokemonServer | null = await db.getServer(guild.id);

    if (!guildData) await db.addServer(guild.id);

    try {
        const ch: TextChannel = guild.channels.cache.find((channel: GuildBasedChannel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) as TextChannel;

        if (!ch) return;

        return await ch.send({embeds: [new EmbedBuilder().setColor(Colours.MAIN).setTitle('🛡️ Welcome to Discmon 🛡️').setThumbnail('https://cdn.discordapp.com/attachments/1010999257899204769/1057280575465082890/4482f729452089.55f35b167dbbe.png').setDescription(`Welcome to Discmon, start your adventure with \`/start\`.\n\nThis is a Pokémon adventure Bot right in your discord server, collect all the Pokémons. Afterall, you gotta catch ém all, right?\n\nIf you ever require any assistance, feel free to join our Support Server.`).setFooter({text: 'Discmon'}).setTimestamp()]});
    } catch {
        return;
    }
});
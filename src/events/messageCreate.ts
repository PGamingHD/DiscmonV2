import {
    ButtonStyle,
    ChannelType,
    Events,
    GuildMember,
    PermissionFlagsBits
} from 'discord.js';
import { Event } from '../structures/Event';
import { client } from "../bot";
import logger from "../utils/logger";
import db from "../utils/database";
import {PokemonServer, userData} from "@prisma/client";

// ACTIONS
import increaseSpawnChance from "../utils/actions/increaseSpawnChance";
import getSpawnRarity from "../utils/actions/getSpawnRarity";
import encounterSpawn from "../utils/actions/encounterSpawn";
import pokemonFunction from "../utils/actions/pokemonFunction";

export default new Event(Events.MessageCreate, async (message) => {
    if (message.channel.type === ChannelType.DM) logger.log(`I WAS DMED, CONTENT: ${message.content}`);
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!client || !client.user) return;

    const findUser: userData | null = await db.findPokemonTrainer(message.author.id);

    if (findUser) {
        await pokemonFunction(message, client);
    }

    const serverExists: PokemonServer | null = await db.getServer(message.guild.id);

    if (!serverExists) {
        if (message.channel.type !== ChannelType.GuildText) return;
        const newServer: PokemonServer = await db.addServer(message.guild.id);

        await increaseSpawnChance(newServer, client, message);

        if (newServer.serverSpawn >= 50) {
            const getRarity: string = getSpawnRarity();

            if (message.channel.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.ViewChannel) && message.channel.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.SendMessages) && message.channel.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.EmbedLinks)) {
                await encounterSpawn(message, getRarity, newServer);
            }
        }
    } else {
        if (message.channel.type !== ChannelType.GuildText) return;
        await increaseSpawnChance(serverExists, client, message);

        if (serverExists.serverSpawn >= 50) {
            const getRarity: string = getSpawnRarity();

            if (message.channel.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.ViewChannel) && message.channel.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.SendMessages) && message.channel.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.EmbedLinks)) {
                await encounterSpawn(message, getRarity, serverExists);
            }
        }
    }

    /*const prefix: string = '!';
    const prefixRegex: RegExp = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
    if (!prefixRegex.test(message.content)) return;

    //@ts-ignore
    const [e, mPrefix] = message.content.match(prefixRegex);

    if (!message.content.toLowerCase().startsWith(mPrefix)) return;

    const args: string[] = message.content.slice(mPrefix.length).trim().split(/ +/).filter(Boolean);

    //@ts-ignore
    const cmd: string | null = args.length > 0 ? args.shift().toLowerCase() : null;

    if (!cmd || cmd.length == 0) {
        if (mPrefix.includes(client.user.id)) {
            const buttonrow = new ActionRowBuilder()
            buttonrow.addComponents([
                new ButtonBuilder()
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=' + client.user.id + '&permissions=8&scope=bot%20applications.commands')
                    .setLabel('Invite Me')
                    .setStyle(ButtonStyle.Link)
            ])

            buttonrow.addComponents([
                new ButtonBuilder()
                    .setURL(`https://www.discord.gg/pxySje4GPC`)
                    .setLabel(`Support Server`)
                    .setStyle(ButtonStyle.Link)
            ])

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colours.GREEN)
                        .setAuthor({
                            name: 'Looks like I was pinged? Let me help you a bit!',
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setDescription(`>>> My current prefix is: \`${prefix}\` and \`/\`\n\nTo view all commands please use: \`${prefix}help\` or \`/help\``)
                        .setFooter({
                            text: `Requested by: ${message.author.tag}`
                        })
                        .setTimestamp()
                ],
                //@ts-ignore
                components: [buttonrow]
            });

            await message.delete();
            return;
        }
        return;
    }

    const command: any = client.textcommands.get(cmd.toLowerCase()) || client.commands.find((c: any) => c.aliases?.includes(cmd.toLowerCase()));
    if (!command) return;


    try {
        //@ts-ignore
        await command.run({message, client, args});

        if (command.hidden) {
            await message.delete();
        }
    } catch (error) {
        console.log(error);
    }*/
});
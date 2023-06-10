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

export default new Command({
    name: 'ping',
    description: 'Get the current data and services ping',
    noDefer: true,
    run: async ({ interaction, client }) => {
        if (!client.user) return;

        const timeBefore = new Date().getTime();
        await db.findPokemonTrainer(interaction.user.id);
        const timeAfter = new Date().getTime();
        const evaled = timeAfter - timeBefore;

        const start: number = Date.now();
        await interaction.reply({embeds: [new EmbedBuilder().setColor(Colours.YELLOW).setDescription('Pinging...')]});
        const end: number = Date.now();

        return interaction.editReply({embeds: [new EmbedBuilder().setColor(Colours.MAIN).setAuthor({name: `Pong`, iconURL: client.user.displayAvatarURL()}).addFields([{name: 'Bot Latency', value: `\`\`\`re\n[ ${end - start}ms ]\`\`\``, inline: true}, {name: 'API Latency', value: `\`\`\`re\n[ ${Math.floor(client.ws.ping)}ms ]\`\`\``, inline: true}, {name: 'Database Latency', value: `\`\`\`re\n[ ${evaled}ms ]\`\`\``}]).setTimestamp().setFooter({text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})]})
    },
});



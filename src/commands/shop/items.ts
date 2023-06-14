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
import {userData} from "@prisma/client";

export default new Command({
    name: 'items',
    description: 'View all your market items',
    requireAccount: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        const usersData: any = await db.findPokemonTrainer(interaction.user.id);
        if (!usersData) return;

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setAuthor({name: interaction.user.username + '\'s items', iconURL: interaction.user.displayAvatarURL()}).setDescription(`• \`${usersData.userBag.userRedeems.toLocaleString('en-US')}\` Redeems\n• \`${usersData.userBag.spawnIncense.toLocaleString('en-US')}\` Incenses\n• \`${usersData.userBag.catchBuddyCandy.toLocaleString('en-US')}\` Buddy Candy`).setTimestamp()]});
    },
});



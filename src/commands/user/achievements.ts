import {
    ApplicationCommandOptionType,
    ButtonStyle,
    ChannelType,
    ComponentType,
    EmbedBuilder
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {Pokemons, userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import {capitalizeFirst} from "../../utils/misc";

export default new Command({
    name: 'achievements',
    description: 'Finish your trainer achievements and get rewards for doing so',
    requireAccount: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        const usersData: any = await db.findPokemonTrainer(interaction.user.id);

        const challengeData = [];
        for (const challenge of usersData.userChallenges) {
            challengeData.push(`**[**${challenge.challengesCompleted === true ? ':white_check_mark:' : ':x:'}**]** *${challenge.challengesName}* \`[${challenge.challengesCaughtAmount.toLocaleString('en-US')}/${challenge.challengesAmount.toLocaleString('en-US')}]\``)
        }

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.MAIN).setTitle('Your trainer achievements').setDescription(`*Achieve a goal and get rewards for doing so.*\n\n${challengeData.join('\n')}`)]});
    },
});



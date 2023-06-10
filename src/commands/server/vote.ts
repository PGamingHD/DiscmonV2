import {
    ApplicationCommandOptionType,
    ButtonStyle,
    ChannelType,
    ComponentType,
    EmbedBuilder
} from 'discord.js';
import { Command } from '../../structures/Command';
import {Colours} from "../../@types/Colours";

export default new Command({
    name: 'vote',
    description: 'Vote for us and get rewards, make sure to have started to gain rewards',
    noDefer: true,
    run: async ({ interaction, client }) => {
        return interaction.reply({embeds: [new EmbedBuilder().setColor(Colours.MAIN).setTitle(`Vote for us`).setDescription(`Vote for us on [top.gg](https://top.gg/bot/1011002384064970944/vote) to recieve tokens that can then be spent in the Shop. You can vote once per 12 hours! [Voting rewards will only be given if you have started]`).setFooter({text: 'Voting rewards will be automatically added to you after a vote has been successfully sent.'})]})
    },
});



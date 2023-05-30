import {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder
} from 'discord.js';
import { Button } from '../../structures/Button';
import {Colours} from "../../@types/Colours";

export default new Button({
    customId: 'testB',
    run: async ({interaction, client}) => {
        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`Hey!`)]});
    },
});
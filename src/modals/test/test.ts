import {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder
} from 'discord.js';
import { Modal } from '../../structures/Modal';
import {Colours} from "../../@types/Colours";

export default new Modal({
    customId: 'testModal',
    run: async ({interaction, client, args}) => {
        const username: string = args.getTextInputValue('modalTest');

        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription(`Testing with ${username}`)]});
    },
});


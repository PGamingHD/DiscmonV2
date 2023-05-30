import {
    ActionRowBuilder,
    AnyComponentBuilder,
    APIEmbed,
    ApplicationCommandOptionType,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
    name: 'testmodal',
    description: 'This is just a testing modal, no need to worry about this!',
    noDefer: true,
    run: async ({ interaction, client }) => {
        const modal: ModalBuilder = new ModalBuilder().setCustomId('testModal').setTitle('Testing Modal');

        const haveComponent: TextInputBuilder = new TextInputBuilder().setCustomId('modalTest').setLabel('Enter your username').setStyle(TextInputStyle.Short).setMaxLength(32).setMinLength(5).setRequired(true);

        const firstActionRow: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder().addComponents(haveComponent);

        //@ts-ignore
        modal.addComponents(firstActionRow);

        return interaction.showModal(modal);
    },
});
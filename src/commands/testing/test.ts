import {
    ActionRowBuilder,
    ApplicationCommandOptionType, ButtonBuilder, ButtonStyle,
    ChannelType
} from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
    name: 'test',
    description: 'This is just a testing command, desc here!',
    defaultMemberPermissions: 'Administrator',
    run: async ({ interaction, client }) => {
        return interaction.followUp({content: 'Test cmd!'});
    },
});
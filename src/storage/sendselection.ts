import {
    APIEmbed,
    ApplicationCommandOptionType,
    ButtonStyle,
    ChannelType,
    ComponentType,
    StringSelectMenuOptionBuilder,
    TextInputStyle
} from 'discord.js';
import { Command } from '../structures/Command';
import sendSelectMenu from "../utils/messages/sendSelectMenu";

export default new Command({
    name: 'sendselection',
    description: 'This is just a users command to send string select menus!',
    noDefer: true,
    run: async ({ interaction, client }) => {

        let options: any[] = [];
        options.push(
            new StringSelectMenuOptionBuilder()
                .setLabel(`hey1`)
                .setDescription(`hey1`)
                .setValue(`1`)
        )
        options.push(
            new StringSelectMenuOptionBuilder()
                .setLabel(`hey1`)
                .setDescription(`hey1`)
                .setValue(`2`)
        )

        return sendSelectMenu(interaction, options, true, 30000, 30000, async (i: any) => {
            if (!i.deferred) await i.deferUpdate();
            console.log('LOGGED SELECTION');
            console.log(i);
        }, 'testMenu', 'This is what is shown as a placeholder!', 'These are all available options!');
    },
});
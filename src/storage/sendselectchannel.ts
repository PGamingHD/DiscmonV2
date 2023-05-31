import {
    ApplicationCommandOptionType,
    ChannelType
} from 'discord.js';
import { Command } from '../structures/Command';
import sendSelectChannelMenu from "../utils/messages/sendSelectChannelMenu";

export default new Command({
    name: 'sendselectchannel',
    description: 'This is just a user command, desc here!',
    noDefer: true,
    run: async ({ interaction, client }) => {
        return sendSelectChannelMenu(interaction, [ChannelType.GuildText], true, 60000, 60000, async (i: any) => {
            if (!i.deferred) await i.deferUpdate();
            console.log('LOGGED SELECTION');
            console.log(i);
        }, async (i: any, reason: string) => {
            console.log('LOGGED ENDING');
            console.log(i, reason);
        }, 'channelMenu', 'This is placeholder for channel menu!', 1, 'This is the content!');
    },
});
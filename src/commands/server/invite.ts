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
    name: 'invite',
    description: 'Invite me to another guild or join the Support Server',
    noDefer: true,
    run: async ({ interaction, client }) => {
        return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.MAIN).setTitle(`Want to join our Support Server or Invite me?`).addFields([{name: 'Invite Me', value: '[Invite](https://canary.discord.com/api/oauth2/authorize?client_id=1011002384064970944&permissions=414464736256&scope=bot%20applications.commands)', inline: true}, {name: 'Support Server', value: '[Support](https://discord.gg/xQFFRzhJu2)', inline: true}])]})
    },
});



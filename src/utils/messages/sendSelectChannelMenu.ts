import {
    ActionRowBuilder,
    APIEmbed,
    ButtonStyle,
    CacheType,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    CommandInteraction,
    ComponentType,
    InteractionCollector,
    InteractionResponse,
} from 'discord.js';
import logger from '../logger';

export default async function (interaction: CommandInteraction, channelsInclude: any[], ephemeral: boolean, time = 60000, idle = 60000, collectFunc: any, endFunc: any, customId: string, placeholder: string, maxCollect: number, content: string) {
    try {
        if (!interaction) throw new Error('Invalid interaction provided');
        if (!channelsInclude) throw new Error('No options provided');
        if (!Array.isArray(channelsInclude)) throw new Error('Options must be an array');
        if (channelsInclude.length === 0) throw new Error('Options array must include atleast 1 value');

        if (typeof time !== 'number') throw new Error('Time must be a number');
        if (time < 30000) throw new Error('Time must be more than 30 seconds');
        if (idle < 30000) throw new Error('Idle time must be more than 30 seconds');


        const selectMenu: ChannelSelectMenuBuilder = new ChannelSelectMenuBuilder({
            customId,
            placeholder,
            maxValues: maxCollect,
        }).addChannelTypes(channelsInclude);

        const row: ActionRowBuilder<ChannelSelectMenuBuilder> = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(selectMenu);

        const int: InteractionResponse<boolean> =  await interaction.reply({content, components: [row], ephemeral});

        const collector: InteractionCollector<ChannelSelectMenuInteraction<CacheType>> = await int.createMessageComponentCollector({
            componentType: ComponentType.ChannelSelect,
            time,
            idle,
            filter: (i: ChannelSelectMenuInteraction<CacheType>): boolean => i.user.id === interaction.user.id
        });

        collector.on('collect', collectFunc);

        collector.on('end',  endFunc);
    } catch (e) {
        logger.error(e);
    }
    return;
}
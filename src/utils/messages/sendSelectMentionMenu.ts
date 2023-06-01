import {
    ActionRowBuilder,
    APIEmbed,
    ButtonStyle,
    CacheType,
    CommandInteraction,
    ComponentType,
    InteractionCollector,
    InteractionResponse,
    MentionableSelectMenuBuilder,
    MentionableSelectMenuInteraction,
} from 'discord.js';
import logger from '../logger';

export default async function (interaction: CommandInteraction, ephemeral: boolean, time = 60000, idle = 60000, collectFunc: any, endFunc: any, customId: string, placeholder: string, maxCollect: number, content: string) {
    try {
        if (!interaction) throw new Error('Invalid interaction provided');

        if (typeof time !== 'number') throw new Error('Time must be a number');
        if (time < 30000) throw new Error('Time must be more than 30 seconds');
        if (idle < 30000) throw new Error('Idle time must be more than 30 seconds');


        const selectMenu: MentionableSelectMenuBuilder = new MentionableSelectMenuBuilder({
            customId,
            placeholder,
            maxValues: maxCollect,
        })

        const row: ActionRowBuilder<MentionableSelectMenuBuilder> = new ActionRowBuilder<MentionableSelectMenuBuilder>().addComponents(selectMenu);

        const int: InteractionResponse<boolean> =  await interaction.reply({content, components: [row], ephemeral});

        const collector: InteractionCollector<MentionableSelectMenuInteraction<CacheType>> = await int.createMessageComponentCollector({
            componentType: ComponentType.MentionableSelect,
            time,
            idle,
            filter: (i: MentionableSelectMenuInteraction<CacheType>): boolean => i.user.id === interaction.user.id
        });

        collector.on('collect', collectFunc);

        collector.on('end',  endFunc);
    } catch (e) {
        logger.error(e);
    }
    return;
}
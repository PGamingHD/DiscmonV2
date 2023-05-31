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
import {PokemonRarity} from "@prisma/client";

export default new Command({
    name: 'addpokemon',
    description: 'Add a new Pokémon to the database (DEVELOPER ONLY)',
    defaultMemberPermissions: 'Administrator',
    main: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        const modal: ModalBuilder = new ModalBuilder().setCustomId('addPokeModal').setTitle('Add a new pokémon');

        const pokeName: TextInputBuilder = new TextInputBuilder().setCustomId('pokeName').setLabel('Pokémon Name').setStyle(TextInputStyle.Short).setMaxLength(32).setMinLength(2).setRequired(true);
        const pokeRarity: TextInputBuilder = new TextInputBuilder().setCustomId('pokeRarity').setLabel('Pokémon Rarity').setStyle(TextInputStyle.Short).setMaxLength(16).setMinLength(4).setRequired(true);
        const pokeType: TextInputBuilder = new TextInputBuilder().setCustomId('pokeType').setLabel('Pokémon Type').setStyle(TextInputStyle.Short).setMaxLength(16).setMinLength(3).setRequired(true);
        const evolveName: TextInputBuilder = new TextInputBuilder().setCustomId('evolveName').setLabel('Pokémon Evolve Name').setStyle(TextInputStyle.Short).setMaxLength(16).setMinLength(4).setRequired(true);
        const evolveStage: TextInputBuilder = new TextInputBuilder().setCustomId('evolveStage').setLabel('Pokémon Evolve Stage').setStyle(TextInputStyle.Short).setMaxLength(2).setMinLength(1).setRequired(true);

        const firstActionRow: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder().addComponents(pokeName);
        const secondActionRow: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder().addComponents(pokeRarity);
        const thirdActionRow: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder().addComponents(pokeType);
        const fourthActionRow: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder().addComponents(evolveName);
        const fifthActionRow: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder().addComponents(evolveStage);

        //@ts-ignore
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

        return interaction.showModal(modal);
    },
});
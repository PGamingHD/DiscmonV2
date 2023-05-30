import {
    CommandInteractionOptionResolver,
    ModalSubmitFields,
    Events
} from 'discord.js';
import { client } from '../bot';
import { Event } from '../structures/Event';
import logger from '../utils/logger';
import {ButtonType, CommandType, MenuType, ModalType} from "../@types/Command";


export default new Event(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command: CommandType | undefined = client.commands.get(interaction.commandName);
        if (!command) return interaction.followUp('You have used a non existent command');

        let bla: string;
        if (command.noDefer) bla = 'hey';

        else await interaction.deferReply();

        try {
            await command.run({
                interaction,
                client,
                args: interaction.options as CommandInteractionOptionResolver,
            });
        } catch (e) {
            logger.error(e);
        }
    }

    else if (interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
        const command: MenuType | undefined = client.contextmenus.get(interaction.commandName);
        if (!command) return interaction.followUp('You have used a non existent context menu');
        try {
            await command.run({
                interaction,
                client,
                args: interaction.options as CommandInteractionOptionResolver,
            });
        } catch (e) {
            logger.error(e);
        }
    }

    else if (interaction.isModalSubmit()) {
        const modal: ModalType | undefined = client.modals.get(interaction.customId);
        if (modal) {
            try {
                await modal.run({
                    interaction,
                    client,
                    args: interaction.fields as ModalSubmitFields,
                });
            } catch (e) {
                logger.error(e)
            }
        }
    }

    else if (interaction.isButton()) {
        const button: ButtonType | undefined = client.buttons.get(interaction.customId);
        if (button) {
            try {
                await button.run({
                    interaction,
                    client,
                });
            } catch (e) {
                logger.error(e);
            }
        }
    }

    return;
});
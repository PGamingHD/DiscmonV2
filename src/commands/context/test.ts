import { ApplicationCommandType } from 'discord.js';
import { ContextMenu } from '../../structures/ContextMenu';
import sendEmbed from "../../utils/messages/sendEmbed";
import {Colours} from "../../@types/Colours";
import db from "../../utils/database";

export default new ContextMenu({
    name: 'Test ID',
    type: ApplicationCommandType.Message,
    defaultMemberPermissions: 'Administrator',
    run: async ({ interaction }) => {
        return sendEmbed({
            interaction,
            embed: {
                description: `This message has ID: ${interaction.targetId}!`,
                color: Colours.GREEN
            },
            ephemeral: true
        });
    },
});
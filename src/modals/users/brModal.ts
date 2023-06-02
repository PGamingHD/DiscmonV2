import {ApplicationCommandOptionType, ChannelType,} from 'discord.js';
import {Modal} from '../../structures/Modal';
import {sendWebhook} from "../../utils/misc";
import {Colours} from "../../@types/Colours";

export default new Modal({
    customId: 'brModal',
    run: async ({interaction, client, args}) => {
        const reportedBug: string = args.getTextInputValue('reportedBug');
        if (!interaction.guild) return;

        await interaction.reply({
            content: '**Bug report recieved, thank you for your help in making our services the best possible!** ❤️',
            ephemeral: true
        });

        return sendWebhook("https://discord.com/api/webhooks/1057285201513951262/HC0n71S2dRDBCPuUDPYErlySpBrOm3k7_Xw3SCD8MXFQ8UwvBHbSu7sRABdYtiwU2bpb", "✉️ Bug Report Recieved ✉️", `**Reporter:** *${interaction.user.tag} [${interaction.user.id}]*\n**Report Server:** *${interaction.guild.name} [${interaction.guild.id}]*\n\n**Explanation:**\n\`\`\`${reportedBug}\`\`\``, Colours.GREEN);
    },
});


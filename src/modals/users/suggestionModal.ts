import {ApplicationCommandOptionType, ChannelType,} from 'discord.js';
import {Modal} from '../../structures/Modal';
import {sendWebhook} from "../../utils/misc";
import {Colours} from "../../@types/Colours";

export default new Modal({
    customId: 'suggestionModal',
    run: async ({interaction, client, args}) => {
        const suggestion: string = args.getTextInputValue('suggestion');
        if (!interaction.guild) return;

        await interaction.reply({
            content: '**Suggestion recieved, thank you for your help in making our services the best possible!** ❤️',
            ephemeral: true
        });

        return sendWebhook("https://discord.com/api/webhooks/1057285267209343057/dEdY4qhBOTs6B6KcKeX27SveKm9ysg_eoFXFhLtneOnk17V1uxRcYzFoDTVe1FfvXWMN", "✉️ Suggestion Recieved ✉️", `**Suggester:** *${interaction.user.tag} [${interaction.user.id}]*\n**Suggestion Server:** *${interaction.guild.name} [${interaction.guild.id}]*\n\n**Explanation:**\n\`\`\`${suggestion}\`\`\``, Colours.GREEN);
    },
});


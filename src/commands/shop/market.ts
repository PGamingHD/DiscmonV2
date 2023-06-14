import {
    ApplicationCommandOptionType,
    ButtonStyle,
    ChannelType,
    ComponentType,
    EmbedBuilder
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {Colours} from "../../@types/Colours";

export default new Command({
    name: 'market',
    description: 'Buy stuff from the market and use them to your advantage',
    requireAccount: true,
    noDefer: true,
    options: [{
        name: 'item',
        description: 'The name of the item you wish to buy',
        type: ApplicationCommandOptionType.String,
        required: false,
    }],
    run: async ({ interaction, client }) => {
        const itemName: string | null = interaction.options.getString('item');
        const usersData: any = await db.findPokemonTrainer(interaction.user.id);
        if (!usersData) return;

        if (!itemName) {
            return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.MAIN).setTitle('Discmon Market').setTimestamp().addFields([{name: 'Pokémon Redeem', value: `**Price:** *5 Pokétokens*\n**Description:** *Spawn any Legendary, Rare, Common or Uncommon Pokémon you want!*\n**ID:** \`discmon_redeem\``}, {name: 'Pokémon Incense', value: '**Price:** *10,000 Pokécoins*\n**Description:** *Increase the pokémon spawn chance in a channel!*\n**ID:** \`discmon_incense\`'}, {name: 'Pokémon Buddy Candy', value: '**Price:** *50,000 Pokécoins*\n**Description:** *Fuel up your Buddy Candy to start catching Pokémons.*\n**ID:** \`discmon_buddycandy\`'}])]});
        } else {
            const items = [
                "discmon_redeem",
                "discmon_incense",
                "discmon_buddycandy",
            ]

            if (!items.includes(itemName)) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('Invalid item ID, please use a valid ID.')]});

            if (itemName === "discmon_redeem") {
                if (usersData.userTokens < 5) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('You cannot afford to buy a redeem due to insufficient funds.')]});

                await db.setTokens(interaction.user.id, usersData.userTokens - 5);
                await db.increaseUserRedeems(interaction.user.id, 1);

                return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription('You have successfully bought 1 **redeem**, use it wisely!')]});
            }

            if (itemName === "discmon_incense") {
                if (usersData.userCoins < 10000) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('You cannot afford to buy an incense due to insufficient funds.')]});

                await db.setCoins(interaction.user.id, usersData.userCoins - 10000);
                await db.increaseUserIncenses(interaction.user.id, 1);

                return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription('You have successfully bought 1 **incense**, use it wisely!')]});
            }

            if (itemName === "discmon_buddycandy") {
                if (usersData.userCoins < 50000) return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.RED).setDescription('You cannot afford to buy a buddycandy due to insufficient funds.')]});

                await db.setCoins(interaction.user.id, usersData.userCoins - 50000);
                await db.increaseUserBCandy(interaction.user.id, 1);

                return interaction.reply({ephemeral: true, embeds: [new EmbedBuilder().setColor(Colours.GREEN).setDescription('You have successfully bought 1 **BuddyCandy**, use it wisely!')]});
            }

            return;
        }
    },
});



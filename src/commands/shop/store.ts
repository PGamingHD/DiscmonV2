import {
    ActionRowBuilder,
    AnyComponentBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ComponentType,
    EmbedBuilder
} from 'discord.js';
import { Command } from '../../structures/Command';
import db from "../../utils/database";
import {TrainerRanks, userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import paymentSystem from "../../utils/actions/paymentSystem";

export default new Command({
    name: 'store',
    description: 'Shop from our official store (contact upon issues)',
    requireAccount: true,
    noDefer: true,
    run: async ({ interaction, client }) => {
        if (!client.user) return;
        const userData: userData | null = await db.findPokemonTrainer(interaction.user.id);
        if (!userData) return;

        const storeRow: any = new ActionRowBuilder()
        storeRow.addComponents([
            new ButtonBuilder()
                .setLabel('Poke Roles')
                .setCustomId('pokeroles')
                .setStyle(ButtonStyle.Primary)
        ])
        storeRow.addComponents([
            new ButtonBuilder()
                .setLabel('Poketokens')
                .setCustomId('poketokens')
                .setStyle(ButtonStyle.Primary)
        ])
        storeRow.addComponents([
            new ButtonBuilder()
                .setLabel('Pokecoins')
                .setCustomId('pokecoins')
                .setStyle(ButtonStyle.Primary)
        ])
        storeRow.addComponents([
            new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Exit')
                .setCustomId('exit')
                .setStyle(ButtonStyle.Primary)
        ])

        const rolesRow: any = new ActionRowBuilder()
        rolesRow.addComponents([
            new ButtonBuilder()
                .setLabel('Bronze Trainer')
                .setCustomId('bronze')
                .setStyle(ButtonStyle.Success)
        ])
        rolesRow.addComponents([
            new ButtonBuilder()
                .setLabel('Silver Trainer')
                .setCustomId('silver')
                .setStyle(ButtonStyle.Success)
        ])
        rolesRow.addComponents([
            new ButtonBuilder()
                .setLabel('Gold Trainer')
                .setCustomId('gold')
                .setStyle(ButtonStyle.Success)
        ])
        rolesRow.addComponents([
            new ButtonBuilder()
                .setLabel('Platinum Trainer')
                .setCustomId('platinum')
                .setStyle(ButtonStyle.Success)
        ])
        rolesRow.addComponents([
            new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Main Page')
                .setCustomId('Mainpage')
                .setStyle(ButtonStyle.Danger)
        ])

        const tokensRow: any = new ActionRowBuilder()
        tokensRow.addComponents([
            new ButtonBuilder()
                .setLabel('100 Tokens')
                .setCustomId('tokens1')
                .setStyle(ButtonStyle.Success)
        ])
        tokensRow.addComponents([
            new ButtonBuilder()
                .setLabel('550 Tokens')
                .setCustomId('tokens2')
                .setStyle(ButtonStyle.Success)
        ])
        tokensRow.addComponents([
            new ButtonBuilder()
                .setLabel('1250 Tokens')
                .setCustomId('tokens3')
                .setStyle(ButtonStyle.Success)
        ])
        tokensRow.addComponents([
            new ButtonBuilder()
                .setLabel('2750 Tokens')
                .setCustomId('tokens4')
                .setStyle(ButtonStyle.Success)
        ])
        tokensRow.addComponents([
            new ButtonBuilder()
                .setLabel('4150 Tokens')
                .setCustomId('tokens5')
                .setStyle(ButtonStyle.Success)
        ])
        const tokens2Row: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder()
        tokens2Row.addComponents([
            new ButtonBuilder()
                .setLabel('9000 Tokens')
                .setCustomId('tokens6')
                .setStyle(ButtonStyle.Success)
        ])
        tokens2Row.addComponents([
            new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Main Page')
                .setCustomId('Mainpage')
                .setStyle(ButtonStyle.Danger)
        ])

        const coinsRow: any = new ActionRowBuilder()
        coinsRow.addComponents([
            new ButtonBuilder() //0.99
                .setLabel('25000 Coins')
                .setCustomId('coins1')
                .setStyle(ButtonStyle.Success)
        ])
        coinsRow.addComponents([
            new ButtonBuilder() //4.99
                .setLabel('115000 Coins')
                .setCustomId('coins2')
                .setStyle(ButtonStyle.Success)
        ])
        coinsRow.addComponents([
            new ButtonBuilder() //9.99
                .setLabel('250000 Coins')
                .setCustomId('coins3')
                .setStyle(ButtonStyle.Success)
        ])
        coinsRow.addComponents([
            new ButtonBuilder() //19.99
                .setLabel('600000 Coins')
                .setCustomId('coins4')
                .setStyle(ButtonStyle.Success)
        ])
        coinsRow.addComponents([
            new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Main Page')
                .setCustomId('Mainpage')
                .setStyle(ButtonStyle.Danger)
        ])

        //EMBED CONSTRUCTORS
        const mainEmbed: EmbedBuilder = new EmbedBuilder()
        mainEmbed.setColor(Colours.MAIN)
        mainEmbed.setTitle(`Discmon • Storepage`)
        mainEmbed.setDescription(`Welcome to the Discmon Storepage! This is where you can buy digital goods, and boost your account on the way to become the best trainer of them all!\nPlease select a category by clicking on one of the buttons below.\n\n***Poke Roles*** • Buy yourself a Role that will boost your account in the future, this role will contain discounts and also different boosts on your adventure.\n***Poketokens*** • Poketokens is the premium currency of Discmon, this will allow you to purchase redeems and so much more from our shop. Make sure not to waste all of them, you never know what'll be added!\n***Pokecoins*** • The main currency, this is what you use to pay for everything, gotta make sure not to waste it all!`)
        mainEmbed.setAuthor({
            name: "Discmon • Store",
            iconURL: client.user.displayAvatarURL()
        })

        const rolesEmbed: EmbedBuilder = new EmbedBuilder()
        rolesEmbed.setColor(Colours.MAIN)
        rolesEmbed.setTitle(`Discmon • Purchase Roles`)
        rolesEmbed.setDescription(`Click the correct Button to purchase something from us, please have your DMs open to complete this!\n\n***Bronze Trainer*** • $0.99\n***Silver Trainer*** • $4.99\n***Gold Trainer*** • $9.99\n***Platinum Trainer*** • $19.99`)
        rolesEmbed.setAuthor({
            name: "Discmon • Roles",
            iconURL: client.user.displayAvatarURL()
        })

        const tokensEmbed: EmbedBuilder = new EmbedBuilder()
        tokensEmbed.setColor(Colours.MAIN)
        tokensEmbed.setTitle(`Discmon • Purchase Tokens`)
        tokensEmbed.setDescription(`Click the correct Button to purchase something from us, please have your DMs open to complete this!\n\n***100 Tokens*** • $0.99\n***550 Tokens*** • $4.99\n***1250 Tokens*** • $9.99\n***2750 Tokens*** • $14.99\n***4150 Tokens*** • $24.99\n***9000 Tokens*** • $49.99`)
        rolesEmbed.setAuthor({
            name: "Discmon • Tokens",
            iconURL: client.user.displayAvatarURL()
        })

        const coinsEmbed: EmbedBuilder = new EmbedBuilder()
        coinsEmbed.setColor(Colours.MAIN)
        coinsEmbed.setTitle(`Discmon • Purchase Coins`)
        coinsEmbed.setDescription(`Click the correct Button to purchase something from us, please have your DMs open to complete this!\n\n***25,000 Coins*** • $0.99\n***115,000 Coins*** • $4.99\n***250,000 Coins*** • $9.99\n***600,000 Coins*** • $19.99`)
        coinsEmbed.setAuthor({
            name: "Discmon • Coins",
            iconURL: client.user.displayAvatarURL()
        })

        await interaction.reply({
            embeds: [mainEmbed],
            components: [storeRow],
            ephemeral: true,
        })

        const newInteraction = await interaction.fetchReply();

        let filter = (i: any) => i.user.id === interaction.user.id;

        const collector = newInteraction.createMessageComponentCollector({
            filter,
            idle: 1000 * 60,
            time: 1000 * 120
        });

        collector.on('collect', async (interactionCollector) => {
            if (interactionCollector.customId === "pokeroles") {
                await interactionCollector.deferUpdate();
                await interactionCollector.editReply({
                    embeds: [rolesEmbed],
                    components: [rolesRow]
                })
            }

            if (interactionCollector.customId === "poketokens") {
                await interactionCollector.deferUpdate()
                await interactionCollector.editReply({
                    embeds: [tokensEmbed],
                    components: [tokensRow, tokens2Row]
                })
            }

            if (interactionCollector.customId === "pokecoins") {
                await interactionCollector.deferUpdate()
                await interactionCollector.editReply({
                    embeds: [coinsEmbed],
                    components: [coinsRow]
                })
            }

            if (interactionCollector.customId === "Mainpage") {
                await interactionCollector.deferUpdate();
                await interactionCollector.editReply({
                    embeds: [mainEmbed],
                    components: [storeRow]
                })
            }

            //ROLES

            if (interactionCollector.customId === "bronze") {
                await interactionCollector.deferUpdate();

                if (userData.trainerRank === TrainerRanks.BRONZE_TRAINER) {
                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':x: You already seem to have this rank, you may not purchase it again.'
                    });
                } else {
                    return paymentSystem(interactionCollector, 0.99, 'rank', TrainerRanks.BRONZE_TRAINER, [
                        "PAYPAL",
                        "ETHEREUM",
                        "BINANCE_COIN",
                        "BITCOIN",
                        "BITCOIN_CASH",
                        "LITECOIN",
                        "SKRILL",
                        "STRIPE",
                        "NANO",
                        "BINANCE"
                    ]);
                }
            }

            if (interactionCollector.customId === "silver") {
                await interactionCollector.deferUpdate();

                if (userData.trainerRank === TrainerRanks.SILVER_TRAINER) {
                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':x: You already seem to have this rank, you may not purchase it again.'
                    });
                } else {
                    return paymentSystem(interactionCollector, 4.99, 'rank', TrainerRanks.SILVER_TRAINER, [
                        "PAYPAL",
                        "ETHEREUM",
                        "BINANCE_COIN",
                        "BITCOIN",
                        "BITCOIN_CASH",
                        "LITECOIN",
                        "SKRILL",
                        "STRIPE",
                        "NANO",
                        "BINANCE"
                    ]);
                }
            }

            if (interactionCollector.customId === "gold") {
                await interactionCollector.deferUpdate();

                if (userData.trainerRank === TrainerRanks.GOLD_TRAINER) {
                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':x: You already seem to have this rank, you may not purchase it again.'
                    });
                } else {
                    return paymentSystem(interactionCollector, 4.99, 'rank', TrainerRanks.GOLD_TRAINER, [
                        "PAYPAL",
                        "ETHEREUM",
                        "BINANCE_COIN",
                        "BITCOIN",
                        "BITCOIN_CASH",
                        "LITECOIN",
                        "SKRILL",
                        "STRIPE",
                        "NANO",
                        "BINANCE"
                    ]);
                }
            }

            if (interactionCollector.customId === "platinum") {
                await interactionCollector.deferUpdate();

                if (userData.trainerRank === TrainerRanks.PLATINUM_TRAINER) {
                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':x: You already seem to have this rank, you may not purchase it again.'
                    });
                } else {
                    return paymentSystem(interactionCollector, 4.99, 'rank', TrainerRanks.PLATINUM_TRAINER, [
                        "PAYPAL",
                        "ETHEREUM",
                        "BINANCE_COIN",
                        "BITCOIN",
                        "BITCOIN_CASH",
                        "LITECOIN",
                        "SKRILL",
                        "STRIPE",
                        "NANO",
                        "BINANCE"
                    ]);
                }
            }

            //TOKENS

            if (interactionCollector.customId === "tokens1") {
                await interactionCollector.deferUpdate();

                return paymentSystem(interactionCollector, 0.99, 'token', 100, [
                    "PAYPAL",
                    "ETHEREUM",
                    "BINANCE_COIN",
                    "BITCOIN",
                    "BITCOIN_CASH",
                    "LITECOIN",
                    "SKRILL",
                    "STRIPE",
                    "NANO",
                    "BINANCE"
                ]);
            }

            if (interactionCollector.customId === "tokens2") {
                await interactionCollector.deferUpdate();

                return paymentSystem(interactionCollector, 4.99, 'token', 550, [
                    "PAYPAL",
                    "ETHEREUM",
                    "BINANCE_COIN",
                    "BITCOIN",
                    "BITCOIN_CASH",
                    "LITECOIN",
                    "SKRILL",
                    "STRIPE",
                    "NANO",
                    "BINANCE"
                ]);
            }

            if (interactionCollector.customId === "tokens3") {
                await interactionCollector.deferUpdate();

                return paymentSystem(interactionCollector, 9.99, 'token', 1250, [
                    "PAYPAL",
                    "ETHEREUM",
                    "BINANCE_COIN",
                    "BITCOIN",
                    "BITCOIN_CASH",
                    "LITECOIN",
                    "SKRILL",
                    "STRIPE",
                    "NANO",
                    "BINANCE"
                ]);
            }

            if (interactionCollector.customId === "tokens4") {
                await interactionCollector.deferUpdate();

                return paymentSystem(interactionCollector, 14.99, 'token', 2750, [
                    "PAYPAL",
                    "ETHEREUM",
                    "BINANCE_COIN",
                    "BITCOIN",
                    "BITCOIN_CASH",
                    "LITECOIN",
                    "SKRILL",
                    "STRIPE",
                    "NANO",
                    "BINANCE"
                ]);
            }

            if (interactionCollector.customId === "tokens5") {
                await interactionCollector.deferUpdate();

                return paymentSystem(interactionCollector, 24.99, 'token', 4150, [
                    "PAYPAL",
                    "ETHEREUM",
                    "BINANCE_COIN",
                    "BITCOIN",
                    "BITCOIN_CASH",
                    "LITECOIN",
                    "SKRILL",
                    "STRIPE",
                    "NANO",
                    "BINANCE"
                ]);
            }

            if (interactionCollector.customId === "tokens6") {
                await interactionCollector.deferUpdate();

                return paymentSystem(interactionCollector, 49.99, 'token', 9000, [
                    "PAYPAL",
                    "ETHEREUM",
                    "BINANCE_COIN",
                    "BITCOIN",
                    "BITCOIN_CASH",
                    "LITECOIN",
                    "SKRILL",
                    "STRIPE",
                    "NANO",
                    "BINANCE"
                ]);
            }

            //COINS

            if (interactionCollector.customId === "coins1") {
                await interactionCollector.deferUpdate();

                return paymentSystem(interactionCollector, 0.99, 'coin', 25000, [
                    "PAYPAL",
                    "ETHEREUM",
                    "BINANCE_COIN",
                    "BITCOIN",
                    "BITCOIN_CASH",
                    "LITECOIN",
                    "SKRILL",
                    "STRIPE",
                    "NANO",
                    "BINANCE"
                ]);
            }

            if (interactionCollector.customId === "coins2") {
                await interactionCollector.deferUpdate();

                return paymentSystem(interactionCollector, 4.99, 'coin', 115000, [
                    "PAYPAL",
                    "ETHEREUM",
                    "BINANCE_COIN",
                    "BITCOIN",
                    "BITCOIN_CASH",
                    "LITECOIN",
                    "SKRILL",
                    "STRIPE",
                    "NANO",
                    "BINANCE"
                ]);
            }

            if (interactionCollector.customId === "coins3") {
                await interactionCollector.deferUpdate();

                return paymentSystem(interactionCollector, 9.99, 'coin', 250000, [
                    "PAYPAL",
                    "ETHEREUM",
                    "BINANCE_COIN",
                    "BITCOIN",
                    "BITCOIN_CASH",
                    "LITECOIN",
                    "SKRILL",
                    "STRIPE",
                    "NANO",
                    "BINANCE"
                ]);
            }

            if (interactionCollector.customId === "coins4") {
                await interactionCollector.deferUpdate();

                return paymentSystem(interactionCollector, 19.99, 'coin', 600000, [
                    "PAYPAL",
                    "ETHEREUM",
                    "BINANCE_COIN",
                    "BITCOIN",
                    "BITCOIN_CASH",
                    "LITECOIN",
                    "SKRILL",
                    "STRIPE",
                    "NANO",
                    "BINANCE"
                ]);
            }
        });

        return;
    },
});



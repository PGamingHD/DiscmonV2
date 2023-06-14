import axios from "axios";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,} from "discord.js";
import {Colours} from "../../@types/Colours";
import db from "../database";
import {TrainerRanks, userData} from "@prisma/client";
import {sendWebhook} from "../misc";

export default async function(interaction: any, paymentAmount: number, paymentType: string, paymentReward: number | TrainerRanks, paymentGateways: string[]) {
    const createPaymentGateway = await axios({
        url: '/payments',
        method: 'post',
        baseURL: 'https://dev.sellix.io/v1',
        headers: {
            'Authorization': 'Bearer ' + process.env.SELLIX_TOKEN,
            'X-Sellix-Merchant': process.env.SELLIX_MERCHANT,
            'Content-Type': 'application/json',
        },
        data: {
            title: 'Donation User: ' + interaction.user.id,
            currency: 'USD',
            email: 'payment.' + interaction.user.id + '@gmail.com',
            white_label: true,
            value: paymentAmount,
            gateways: paymentGateways,
        }
    });
    const createdPayment = createPaymentGateway.data;

    if (createdPayment.status === 200) {
        const invoiceData = createdPayment.data.invoice;

        const donationButton: any = new ActionRowBuilder()
            .addComponents([
                new ButtonBuilder()
                    .setURL('https://checkout.sellix.io/payment/' + invoiceData.uniqid)
                    .setLabel('Click to Pay')
                    .setStyle(ButtonStyle.Link)
            ])

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colours.YELLOW)
                    .setTitle('Invoice #' + invoiceData.uniqid)
                    .addFields([{
                        name: '💰 Package Payment',
                        value: '$' + invoiceData.total,
                        inline: true
                    }, {
                        name: '⏳ Status',
                        value: '⌚ Pending',
                        inline: true
                    }])
            ],
            components: [donationButton],
            ephemeral: true
        });

        let checkerInterval: number = 0;
        const paymentChecker: any = setInterval(async () => {
            checkerInterval++;

            if (checkerInterval >= 240) return clearInterval(paymentChecker);

            const products = await axios({
                url: '/orders/' + invoiceData.uniqid,
                method: 'get',
                baseURL: 'https://dev.sellix.io/v1',
                headers: {
                    'Authorization': 'Bearer ' + process.env.SELLIX_TOKEN,
                    'X-Sellix-Merchant': process.env.SELLIX_MERCHANT,
                    'Content-Type': 'application/json',
                }
            });
            const invoiceStatus = products.data.status;
            const paymentStatus = products.data.data.order.status;

            if (invoiceIsValid(invoiceStatus, paymentStatus)) {
                clearInterval(paymentChecker);
                const order = products.data.data.order;

                const hasPayment = await db.hasPayment(order.uniqid);

                const hasUserD = await db.findPokemonTrainer(interaction.user.id);

                if (hasPayment) {
                    await interaction.message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colours.YELLOW)
                                .setDescription('Invoice has already been claimed!')
                        ],
                        components: []
                    });
                } else {
                    await db.createPayment(interaction.user.id, order.uniqid, paymentType);

                    if (hasUserD) {
                        if (paymentType === 'coin') {
                            await db.increaseCoins(interaction.user.id, paymentReward);
                        } else if (paymentType === 'token') {
                            await db.increaseTokens(interaction.user.id, paymentReward);
                        } else if (paymentType === 'rank') {
                            await db.setTrainerRank(interaction.user.id, paymentReward);
                        }
                    } else {
                        if (paymentType === 'coin') {
                            let nextTrainerId: userData | null | number = await db.findNextTrainerId();
                            if (!nextTrainerId) {
                                nextTrainerId = 0;
                            } else {
                                nextTrainerId = nextTrainerId.trainerNumber + 1;
                            }

                            await db.registerNewUser(interaction.user.id, nextTrainerId);

                            await db.increaseCoins(interaction.user.id, paymentReward);
                        } else if (paymentType === 'token') {
                            let nextTrainerId: userData | null | number = await db.findNextTrainerId();
                            if (!nextTrainerId) {
                                nextTrainerId = 0;
                            } else {
                                nextTrainerId = nextTrainerId.trainerNumber + 1;
                            }

                            await db.registerNewUser(interaction.user.id, nextTrainerId);

                            await db.increaseTokens(interaction.user.id, paymentReward);
                        } else if (paymentType === 'rank') {
                            let nextTrainerId: userData | null | number = await db.findNextTrainerId();
                            if (!nextTrainerId) {
                                nextTrainerId = 0;
                            } else {
                                nextTrainerId = nextTrainerId.trainerNumber + 1;
                            }

                            await db.registerNewUser(interaction.user.id, nextTrainerId);

                            await db.setTrainerRank(interaction.user.id, paymentReward);
                        }
                    }
                }

                await sendWebhook('https://canary.discord.com/api/webhooks/1118650376992870504/polp6TlzSDWweGX5rTnQodfMn8RwlbMyCMQkfxdPIm8mO32lU69kZ75L_3PZHVS8FzsH', '💰 Donation Recieved 💰', `*Payment recieved by* <@!${interaction.user.id}>\n\n**Type:** \`${paymentType}\`\n**Reward:** \`${paymentReward}\`\n**Amount:** \`${paymentAmount}\`USD`, Colours.GREEN);

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colours.GREEN)
                            .setTitle('Invoice #' + invoiceData.uniqid)
                            .addFields([{
                                name: '💰 Package Payment',
                                value: '$' + invoiceData.total,
                                inline: true
                            }, {
                                name: '⏳ Status',
                                value: '✅ Paid',
                                inline: true
                            }])
                    ],
                    components: []
                });
            } else {
                return;
            }
        }, 1000 * 60);
    } else {
        console.log("Payment not created, responded with error code: " + createdPayment.status);
    }
}

function invoiceIsValid(status: number, paymentStatus: string): boolean {
    if (status === 200 && paymentStatus === "COMPLETED") {
        return true;
    } else {
        return false;
    }
}
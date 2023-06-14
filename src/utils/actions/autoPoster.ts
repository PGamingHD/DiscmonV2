import {Webhook} from '@top-gg/sdk';
import {AutoPoster} from 'topgg-autoposter';
import {sendWebhook} from "../misc";
import express from 'express';
import logger from "../logger";
import db from "../database";
import {userData} from "@prisma/client";
import {Colours} from "../../@types/Colours";
import {BasePoster} from "topgg-autoposter/dist/structs/BasePoster";
import {ExtendedClient} from "../../structures/Client";
const server = express();

export default async function(client: ExtendedClient): Promise<void> {
    const autoposter: BasePoster = AutoPoster(process.env.TOPGG_TOKEN as string, client);
    const webhook: Webhook = new Webhook(process.env.TOPGG_AUTH as string);

    autoposter.on('posted', () => {
        logger.autoposter('[AUTOPOST] <==> || Successfully posted all relevant stats to the Top.gg site! <==> || [AUTOPOST]');
    });

    autoposter.on('error', (error: any) => {
        logger.autoposter(`[AUTOPOST ERROR] <==> || Ran into error explained below. <==> || [AUTOPOST ERROR]\n${error}`);
    });

    server.post("/dblwebhook", webhook.listener(async (vote: any) => {
        const findregistered: any = await db.findPokemonTrainer(vote.user);

        if (findregistered) {
            await sendWebhook("https://canary.discord.com/api/webhooks/1069643453631311932/SQ9yyjpRhGVPaocUZMAvJUmhuME2xPuezzt1VD11440QvRQzefFfokKyQFjg90jPe7yq", "🎉 New Registered Vote 🎉", `**A new vote was registered by <@!${vote.user}>!**\n\n*User has been successfully automatically given their voting rewards, make sure to vote below to get your own rewards!*\n\n*Click [here](https://top.gg/bot/1011002384064970944/vote) to vote for us and get free Pokétokens!*`, Colours.MAIN);

            if (Number(findregistered.voteStreak.latestVoteExpire) > Date.now()) {
                await db.incrementVoteStreak(vote.user);
                await db.setNewVote(vote.user, Date.now());
                await db.setNewExpireVote(vote.user, Date.now() + 86400000);
            }

            if (Number(findregistered.voteStreak.latestVoteExpire) < Date.now() + 86400000) {
                await db.setNewVote(vote.user, Date.now());
                await db.setNewExpireVote(vote.user, Date.now() + 86400000);
            }

            if (Number(findregistered.voteStreak.voteStreak) < 10) {
                await db.increaseTokens(vote.user, 1);
            } else if (Number(findregistered.voteStreak.voteStreak) >= 10 && Number(findregistered.voteStreak.voteStreak) < 25) {
                await db.increaseTokens(vote.user, 2);
            } else if (Number(findregistered.voteStreak.voteStreak) >= 25) {
                await db.increaseTokens(vote.user, 5);
            }
        } else {
            await sendWebhook("https://canary.discord.com/api/webhooks/1069643453631311932/SQ9yyjpRhGVPaocUZMAvJUmhuME2xPuezzt1VD11440QvRQzefFfokKyQFjg90jPe7yq", "🎉 New Registered Vote 🎉", `**A new vote was registered by <@!${vote.user}>!**\n\n*Sadly user does not have an account registered, and was not given their automatic rewards. Please contact Staff to have this fixed after registering!*\n\n*Click [here](https://top.gg/bot/1011002384064970944/vote) to vote for us and get free Pokétokens!*`, Colours.MAIN);
        }
    }));

    server.listen(3000, () => logger.express('The express server is running!'));
}
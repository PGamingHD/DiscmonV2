import {Event} from "../structures/Event";
import {ActivityType, Events, Guild, Message, TextChannel} from "discord.js";
import db from "../utils/database";
import logger from "../utils/logger";
import {
    lotteryGlobal,
    PokemonGender,
    PokemonNature,
    PokemonRarity,
    Pokemons,
    userData,
    userTickets
} from "@prisma/client";
import {Cron} from "croner";
import {generateFlake, randomizeNumber, sendWebhook} from "../utils/misc";
import getSpawnRarity from "../utils/actions/getSpawnRarity";
import {Colours} from "../@types/Colours";

export default new Event(Events.ClientReady, async (client) => {
    const activities: {activity: ActivityType, name: string}[] = [
        {
            activity: ActivityType.Watching,
            name: `over ${client.guilds.cache.reduce((a, g) => a + g.memberCount,0)} users!`
        },
        {
            activity: ActivityType.Playing,
            name: `with ${client.guilds.cache.size} guilds!`
        },
        {
            activity: ActivityType.Watching,
            name: `over the official server!`
        },
        {
            activity: ActivityType.Watching,
            name: `Help @ /help!`
        },
        {
            activity: ActivityType.Watching,
            name: `Changes @ /changelogs`
        },
    ];

    Cron('00 */5 * * * *', async () => {
        const random = await randomizeNumber(1, activities.length);
        client.user?.setActivity({
            type: activities[random - 1].name.includes('Changes') ? ActivityType.Watching : activities[random].name.includes('guilds!') ? ActivityType.Playing : ActivityType.Watching,
            name: activities[random - 1].name
        });
    });

    Cron('0 0 20 * * 2,4,5,0', async () => {
        const boughtTickets: number = await db.countAllTickets();
        if (boughtTickets === 0) return;

        const nextRun: any = Cron('0 0 20 * * 2,4,5,0').nextRun();
        const globalData: lotteryGlobal | null = await db.getLotteryGlobals();
        if (!globalData) return;

        if (globalData.currentParticipants < 5) {
            const allTickets = await db.findAllTickets();
            const uniqueParticipants: string[] = [];
            for (const ticket of allTickets) {
                if (!uniqueParticipants.includes(ticket.ticketsOwner)) uniqueParticipants.push(`${ticket.ticketsOwner}`);
            }

            for (const userid of uniqueParticipants) {
                const usersData = await db.findPokemonTrainer(userid);
                if (!usersData) continue;

                const usersTickets: number = await db.countUserTickets(userid);
                await db.setCoins(userid, usersData.userCoins + (usersTickets * 10000));

                try {
                    const fetchUser = await client.users.fetch(userid);
                    await fetchUser.send('The lottery did not have 5 or more users, it was cancelled. You have been fully refunded for this!');
                } catch {}
            }

            return sendWebhook('https://canary.discord.com/api/webhooks/1119763216487162026/VlWm-1ajfdzRZtzY4S1PvgkggiEhhZZdHi83D-Z-QidmGTDwQYKt0u2vdZrprdTgAWw-', '🎟️ Lottery Results 🎟️', '*Due to less than 5 people participating, the lottery was concluded for this time, better luck next time!*', Colours.RED);
        }

        //WINNER 1

        const randomWinner1Ticket: number = await randomizeNumber(1, boughtTickets);
        const winner1Ticket: userTickets | null = await db.getSpecificTicket(randomWinner1Ticket - 1);
        const winner1Award: number = (50 / 100) * Number(globalData.currentJackpot);
        if (!winner1Ticket) return;

        const winner1Data: userData | null = await db.findPokemonTrainer(winner1Ticket.ticketsOwner);
        if (!winner1Data) return;

        await db.setCoins(winner1Data.userId, Math.floor(winner1Data.userCoins + winner1Award));

        const spawnedRarity = await getSpawnRarity();
        const getPokemons: number = await db.getPokemonRarityCount(spawnedRarity.toUpperCase() as PokemonRarity);
        const randomPokemon: number = await randomizeNumber(1, getPokemons);

        const pokemonToSpawn: any = await db.getRandomPokemon(spawnedRarity.toUpperCase() as PokemonRarity, randomPokemon - 1);

        const Nature: PokemonNature[] = [
            PokemonNature.TIMID,
            PokemonNature.BASHFUL,
            PokemonNature.BRAVE,
            PokemonNature.BOLD,
            PokemonNature.CALM,
            PokemonNature.CAREFUL,
            PokemonNature.DOCILE,
            PokemonNature.GENTLE,
            PokemonNature.HARDY,
            PokemonNature.HASTY,
            PokemonNature.IMPISH,
            PokemonNature.JOLLY,
            PokemonNature.LAX,
            PokemonNature.LONELY,
            PokemonNature.MILD,
            PokemonNature.MODEST,
            PokemonNature.NAIVE,
            PokemonNature.NAUGHTY,
            PokemonNature.QUIET,
            PokemonNature.QUIRKY,
            PokemonNature.RASH,
            PokemonNature.RELAXED,
            PokemonNature.SASSY,
            PokemonNature.SERIOUS,
            PokemonNature.TIMID,
        ]

        const Gender: PokemonGender[] = [
            PokemonGender.MALE,
            PokemonGender.FEMALE,
        ]

        const getHighestPoke: Pokemons[] = await db.getPokemonNextPokeId(winner1Data.userId);
        let incrementId;
        if (getHighestPoke.length === 0 && getHighestPoke[0].pokemonPlacementId === null) incrementId = 1;
        if (getHighestPoke.length >= 1 && getHighestPoke[0].pokemonPlacementId !== null) incrementId = getHighestPoke[0].pokemonPlacementId + 1;
        if (!incrementId) incrementId = 1;

        const HPiv: number = await randomizeNumber(1, 31);
        const ATKiv: number = await randomizeNumber(1, 31);
        const DEFiv: number = await randomizeNumber(1, 31);
        const SPECATKiv: number = await randomizeNumber(1, 31);
        const SPECDEFiv: number = await randomizeNumber(1, 31);
        const SPEEDiv: number = await randomizeNumber(1, 31);

        const IVpercentage = HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
        const IVtotal: string = (IVpercentage / 186 * 100).toFixed(2);

        await db.setNewPokemonOwner(generateFlake(), winner1Data.userId, `https://pgaminghd.github.io/discmon-images/pokemon-sprites/shiny/${pokemonToSpawn.pokemonPokedex}.png`, pokemonToSpawn.pokemonName, Nature[Math.random() * Nature.length>>0], Gender[Math.random() * Gender.length>>0], pokemonToSpawn.pokemonRarity, false, incrementId, {
            HP: HPiv,
            Attack: ATKiv,
            Defense: DEFiv,
            SpecialAtk: SPECATKiv,
            SpecialDef: SPECDEFiv,
            Speed: SPEEDiv,
            pokemonTotalIVs: parseFloat(IVtotal),
        }, {
            HP: pokemonToSpawn.pokemonEVs.HP,
            Attack: pokemonToSpawn.pokemonEVs.Attack,
            Defense: pokemonToSpawn.pokemonEVs.Defense,
            SpecialAtk: pokemonToSpawn.pokemonEVs.SpecialAtk,
            SpecialDef: pokemonToSpawn.pokemonEVs.SpecialDef,
            Speed: pokemonToSpawn.pokemonEVs.Speed,
        });

        try {
            const fetchedUser = await client.users.fetch(winner1Data.userId);
            await fetchedUser.send(`Congratulations <@!${winner1Data.userId}>, you won the lottery as winner #1! (Also got a shiny ${pokemonToSpawn.pokemonName})`);
        } catch {}

        //WINNER 2

        const randomWinner2Ticket: number = await randomizeNumber(1, boughtTickets);
        const winner2Ticket: userTickets | null = await db.getSpecificTicket(randomWinner2Ticket - 1);
        const winner2Award: number = (30 / 100) * Number(globalData.currentJackpot);
        if (!winner2Ticket) return;

        const winner2Data: userData | null = await db.findPokemonTrainer(winner2Ticket.ticketsOwner);
        if (!winner2Data) return;

        await db.setCoins(winner2Data.userId, Math.floor(winner2Data.userCoins + winner2Award));

        try {
            const fetchedUser = await client.users.fetch(winner2Data.userId);
            await fetchedUser.send(`Congratulations <@!${winner2Data.userId}>, you won the lottery as winner #2!`);
        } catch {}

        //WINNER 3

        const randomWinner3Ticket: number = await randomizeNumber(1, boughtTickets);
        const winner3Ticket: userTickets | null = await db.getSpecificTicket(randomWinner3Ticket - 1);
        const winner3Award: number = (30 / 100) * Number(globalData.currentJackpot);
        if (!winner3Ticket) return;

        const winner3Data: userData | null = await db.findPokemonTrainer(winner3Ticket.ticketsOwner);
        if (!winner3Data) return;

        await db.setCoins(winner3Data.userId, Math.floor(winner3Data.userCoins + winner3Award));

        try {
            const fetchedUser = await client.users.fetch(winner3Data.userId);
            await fetchedUser.send(`Congratulations <@!${winner3Data.userId}>, you won the lottery as winner #3!`);
        } catch {}

        //RESET EVERYTHING FOR NEW LOTTERY TIME

        await db.setNewGlobalLotteryData(0, Math.floor(nextRun), 0, 0);
        await db.deleteLotteryTickets();

        return sendWebhook('https://canary.discord.com/api/webhooks/1119763216487162026/VlWm-1ajfdzRZtzY4S1PvgkggiEhhZZdHi83D-Z-QidmGTDwQYKt0u2vdZrprdTgAWw-', '🎟️ Lottery Results 🎟️', `*Lottery winners has been drawn!*\n*Congratulations to all our winners, better luck next time to those who did not win.*\n\n**Winner #1:** <@!${winner1Data.userId}>\n**Winner #2:** <@!${winner2Data.userId}>\n**Winner #3:** <@!${winner3Data.userId}>`, Colours.RED);
    });

    const auctions: any = await db.findAllAuctions();
    for (const auction of auctions) {
        const timeLeft: number = parseInt(auction.endTime) - Date.now();

        setTimeout(async (): Promise<void> => {
            const findAuction: any = await db.findSpecificAuction(auction.auctionId);

            if (findAuction) {
                await db.setPokemonAuction(auction.pokemon.pokemonId, false);
                await db.removePokemonAuction(auction.pokemon.pokemonId);

                if (!findAuction.leaderData) return;

                const findUser = await db.findPokemonTrainer(findAuction.leaderData);
                const findSeller = await db.findPokemonTrainer(findAuction.pokemon.pokemonOwner);

                if (!findUser) return;
                if (!findSeller) return;

                const getHighestPoke: Pokemons[] = await db.getPokemonNextPokeId(findAuction.leaderData);

                let incrementId;
                if (getHighestPoke.length === 0 && getHighestPoke[0].pokemonPlacementId === null) incrementId = 1;
                if (getHighestPoke.length >= 1 && getHighestPoke[0].pokemonPlacementId !== null) incrementId = getHighestPoke[0].pokemonPlacementId + 1;
                if (!incrementId) incrementId = 1;

                await db.setPokemonOwner(auction.pokemon.pokemonId, findAuction.leaderData, incrementId);
                if (findAuction.leaderData !== findAuction.pokemon.pokemonOwner) {
                    await db.setTokens(findAuction.leaderData, findUser.userTokens - findAuction.auctionCurrent);
                    await db.setTokens(findAuction.pokemon.pokemonOwner, findSeller.userTokens + findAuction.auctionCurrent);
                }
            }
        }, timeLeft);
    }

    const allPokemons: Pokemons[] = await db.findDeleteCatchablePokemon();
    for (const spawnedPokemon of allPokemons) {
        try {
            const guild: Guild = await client.guilds.fetch(spawnedPokemon.spawnedServer as string);
            const channel: TextChannel = await guild.channels.fetch(spawnedPokemon.spawnedChannel as string) as TextChannel;
            const message: Message<true> = await channel.messages.fetch(spawnedPokemon.spawnedMessage as string);
            await message.edit({content: `:x: The \`${spawnedPokemon.pokemonName}\` wasn't caught in time and therefore fled, better luck next time!`, components: [], embeds: []});

            logger.warning(`Successfully removed Pokémon ${spawnedPokemon.pokemonName} from guild ${spawnedPokemon.spawnedServer} in channel ${spawnedPokemon.spawnedChannel}!`);
        } catch {}
    }

    await db.deleteCatchablePokemon().then(() => logger.warning('Successfully removed all catchable Pokémons!'));
});
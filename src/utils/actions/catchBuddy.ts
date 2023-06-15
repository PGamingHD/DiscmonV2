import {ExtendedClient} from "../../structures/Client";
import db from "../database";
import {Cron} from "croner";
import {generateFlake, randomizeGender, randomizeNature, randomizeNumber} from "../misc";
import {ActivityType} from "discord.js";
import {PokemonRarity, Pokemons, userCatchBuddy} from "@prisma/client";
import getModifiedSpawnRarity from "./getModifiedSpawnRarity";
import getSpawnRarity from "./getSpawnRarity";

export default async function(client: ExtendedClient): Promise<void> {
    const allBuddies: userCatchBuddy[] = await db.getAllBuddies();

    for (const buddy of allBuddies) {
        Cron('*/30 * * * * *', async () => {
            let newBuddyData = await db.getOneBuddy(buddy.userId);
            if (!newBuddyData) return;

            if (!newBuddyData.catcherEnabled) return;

            if (newBuddyData.catcherNext <= Date.now() && Number(newBuddyData.catcherRefill) + 60000 >= Date.now() && Number(newBuddyData.catcherNext) !== 0) newBuddyData = await db.setCatchAvailableStatus(buddy.userId, true);

            if (newBuddyData.catchAvailable) {
                let getRarity: string = ``;

                if (newBuddyData.pokemonLuckUpgrade >= 1) {
                    getRarity = await getModifiedSpawnRarity();
                } else {
                    getRarity = await getSpawnRarity();
                }

                const getPokemons: number = await db.getPokemonRarityCount(getRarity.toUpperCase() as PokemonRarity);
                const randomPokemon: number = await randomizeNumber(1, getPokemons);

                const pokemonToSpawn: any = await db.getRandomPokemon(getRarity.toUpperCase() as PokemonRarity, randomPokemon - 1);

                const levelGeneration: number = await randomizeNumber(1, 20);
                const generatedId: string = generateFlake();

                const HPiv: number = await randomizeNumber(1, 31);
                const ATKiv: number = await randomizeNumber(1, 31);
                const DEFiv: number = await randomizeNumber(1, 31);
                const SPECATKiv: number = await randomizeNumber(1, 31);
                const SPECDEFiv: number = await randomizeNumber(1, 31);
                const SPEEDiv: number = await randomizeNumber(1, 31);

                const IVpercentage: number = HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
                const IVtotal: string = (IVpercentage / 186 * 100).toFixed(2);

                const getHighestPoke: Pokemons[] = await db.getPokemonNextPokeId(buddy.userId);

                let incrementId;
                if (getHighestPoke.length === 0 && getHighestPoke[0].pokemonPlacementId === null) incrementId = 1;
                if (getHighestPoke.length >= 1 && getHighestPoke[0].pokemonPlacementId !== null) incrementId = getHighestPoke[0].pokemonPlacementId + 1;
                if (!incrementId) incrementId = 1;

                await db.spawnNewRedeemPokemon(generatedId, buddy.userId, incrementId, pokemonToSpawn.pokemonName, pokemonToSpawn.pokemonPicture, randomizeGender(), randomizeNature(), levelGeneration, {
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

                newBuddyData = await db.setCatchAvailableStatus(buddy.userId, false);
                newBuddyData = await db.setCatcherNextTime(buddy.userId, Math.floor(Date.now() + 1000 * 60 * (60 / (newBuddyData.pokemonUpgrade + 1))));
                newBuddyData = await db.incremenetCatcherCaught(buddy.userId);
            }

            if (buddy.catcherEnabled && buddy.catcherRefill >= Date.now() + 1000 * 60 * (60 / (newBuddyData.pokemonUpgrade + 1)) && buddy.catcherNext <= Date.now()) await db.setCatcherNextTime(buddy.userId, Math.floor(Date.now() + 1000 * 60 * (60 / (newBuddyData.pokemonUpgrade + 1))));

            if (newBuddyData.catcherRefill < Date.now()) {
                await db.setCatcherEnabledStatus(buddy.userId, false);
                await db.setCatcherNextTime(buddy.userId, 0);
                await db.setCatcherRefillTime(buddy.userId, 0);
            }
        });
    }
}
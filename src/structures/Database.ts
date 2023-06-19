import {
    PrismaClient,
    userData,
    userPayment,
    PokemonServer,
    Pokemon,
    Pokemons,
    globalCodes,
    userCodes,
    channelIncense,
    PokemonsAuction,
    PokemonGender,
    PokemonNature,
    PokemonRarity,
    TrainerRanks,
    PokemonOrder,
    RewardType,
    userCatchBuddy,
    VoteStreak,
    userChallenges,
    lotteryGlobal, userTickets,
} from '@prisma/client';

import {generateFlake} from "../utils/misc";

export class Database {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /*
    * POKEMON GETTERS & SETTERS
    * */

    addNewPokemon(data: any): Promise<Pokemon> {
        return this.prisma.pokemon.create({data});
    }

    getPokemonCount(): Promise<number> {
        return this.prisma.pokemon.count();
    }

    getPokemonRarityCount(pokemonRarity: PokemonRarity): Promise<number> {
        return this.prisma.pokemon.count({
            where: {
                pokemonRarity
            }
        })
    }

    getPokemon(pokemonName: string): Promise<Pokemon | null> {
        return this.prisma.pokemon.findFirst({
            where: {
                pokemonName,
            },
            include: {
                pokemonEvolve: true,
                pokemonEVs: true,
                pokemonType: true,
            }
        });
    }

    getAllPokemons(): Promise<Pokemon[]> {
        return this.prisma.pokemon.findMany({
            orderBy: [{
                pokemonPokedex: 'asc',
            }],
            include: {
                pokemonType: true
            }
        });
    }

    getSpecificPokemonName(name: string): Promise<Pokemon | null> {
        return this.prisma.pokemon.findFirst({
            where: {
                pokemonName: name,
            },
            include: {
                pokemonEVs: true,
                pokemonType: true,
            }
        });
    }

    getSpecificPokemonId(id: number): Promise<Pokemon | null> {
        return this.prisma.pokemon.findFirst({
            where: {
                pokemonPokedex: id,
            },
            include: {
                pokemonEVs: true,
                pokemonType: true,
            }
        });
    }

    getRandomPokemon(pokemonRarity: PokemonRarity, randomSkip: number): Promise<Pokemon | null> {
        return this.prisma.pokemon.findFirst({
            where: {
                pokemonRarity
            },
            include: {
                pokemonEVs: true
            },
            skip: randomSkip,
            take: 1
        });
    }

    /*
    * SPAWNED & CLAIMED GETTERS AND SETTERS!
    * */

    spawnNewPokemon(serverId: string, channelId: string, messageId: string, pokemonId: string, pokemonName: string, pokemonPicture: string, pokemonGender: PokemonGender, pokemonNature: PokemonNature, pokemonRarity: PokemonRarity, pokemonLevel: number, ivData: any, evData: any): Promise<Pokemons | null> {
        return this.prisma.pokemons.create({
            data: {
                pokemonId,
                pokemonName,
                pokemonPicture,
                pokemonLevel,
                pokemonXP: 0,
                pokemonCatch: true,
                pokemonSelected: false,
                pokemonFavorite: false,
                pokemonGender,
                pokemonNature,
                pokemonRarity,
                spawnedServer: serverId,
                spawnedChannel: channelId,
                spawnedMessage: messageId,
                PokemonIVs: {
                    create: ivData
                },
                PokemonsEVs: {
                    create: evData
                }
            }
        });
    }

    spawnNewRedeemPokemon(pokemonId: string, ownerId: string, placementId: number, pokemonName: string, pokemonPicture: string, pokemonGender: PokemonGender, pokemonNature: PokemonNature, pokemonRarity: PokemonRarity, pokemonLevel: number, ivData: any, evData: any): Promise<Pokemons | null> {
        return this.prisma.pokemons.create({
            data: {
                pokemonId,
                pokemonName,
                pokemonPicture,
                pokemonLevel,
                pokemonOwner: ownerId,
                pokemonXP: 0,
                pokemonCatch: false,
                pokemonSelected: false,
                pokemonFavorite: false,
                pokemonPlacementId: placementId,
                pokemonGender,
                pokemonNature,
                pokemonRarity,
                spawnedServer: null,
                spawnedChannel: null,
                spawnedMessage: null,
                PokemonIVs: {
                    create: ivData
                },
                PokemonsEVs: {
                    create: evData
                }
            }
        })
    }

    findSpawnedPokemon(channelId: string, pokemonName: string): Promise<Pokemons | null> {
        return this.prisma.pokemons.findFirst({
            where: {
                pokemonName,
                spawnedChannel: channelId,
                pokemonCatch: true
            }
        });
    }

    findOneSpawnedPokemon(channelId: string): Promise<Pokemons | null> {
        return this.prisma.pokemons.findFirst({
            where: {
                spawnedChannel: channelId,
                pokemonCatch: true,
            }
        })
    }

    findSpawnedExactPokemon(pokemonId: string, channelId: string): Promise<Pokemons | null> {
        return this.prisma.pokemons.findFirst({
            where: {
                pokemonId,
                spawnedChannel: channelId,
                pokemonCatch: true,
            }
        })
    }

    findDeleteCatchablePokemon(): Promise<Pokemons[]> {
        return this.prisma.pokemons.findMany({
            where: {
                pokemonCatch: true
            }
        });
    }

    findUserSelectedPokemon(userId: string): Promise<Pokemons | null> {
        return this.prisma.pokemons.findFirst({
            where: {
                pokemonSelected: true,
                pokemonOwner: userId,
            },
            include: {
                PokemonsEVs: true,
                PokemonIVs: true,
            }
        })
    }

    findAllPokemons(): Promise<Pokemons[]> {
        return this.prisma.pokemons.findMany({
            include: {
                PokemonIVs: true
            }
        })
    }

    findPlacementPokemon(userId: string, placementId: number): Promise<Pokemons | null> {
        return this.prisma.pokemons.findFirst({
            where: {
                pokemonOwner: userId,
                pokemonPlacementId: placementId,
            }
        });
    }

    setSpawnedOwner(pokemonId: string, pokemonOwner: string, placementId: number): Promise<Pokemons | null> {
        return this.prisma.pokemons.update({
            where: {
                pokemonId,
            },
            data: {
                pokemonOwner,
                pokemonCatch: false,
                pokemonPlacementId: placementId,
                spawnedServer: null,
                spawnedMessage: null,
                spawnedChannel: null,
            }
        });
    }

    setNewPokemonOwner(pokemonId: string, pokemonOwner: string, pokemonPicture: string, pokemonName: string, pokemonNature: PokemonNature, pokemonGender: PokemonGender, pokemonRarity: PokemonRarity, pokemonSelected: boolean, pokemonPlacementId: number, ivData: any, evData: any): Promise<Pokemons | null> {
        return this.prisma.pokemons.create({
            data: {
                pokemonId,
                pokemonOwner,
                pokemonPicture,
                pokemonName,
                pokemonNature,
                pokemonGender,
                pokemonSelected,
                pokemonRarity,
                pokemonPlacementId,
                pokemonFavorite: false,
                pokemonLevel: 1,
                pokemonXP: 0,
                pokemonCatch: false,
                PokemonIVs: {
                    create: ivData
                },
                PokemonsEVs: {
                    create: evData
                }
            }
        });
    }

    setPokemonEvolve(pokemonId: string, evolveName: string, evolvePic: string): Promise<Pokemons | null> {
        return this.prisma.pokemons.update({
            where: {
                pokemonId
            },
            data: {
                pokemonName: evolveName,
                pokemonPicture: evolvePic,
                pokemonXP: 0,
            }
        });
    }

    setPokemonLevelUp(pokemonId: string): Promise<Pokemons | null> {
        return this.prisma.pokemons.update({
            where: {
                pokemonId
            },
            data: {
                pokemonLevel: {increment: 1},
                pokemonXP: 0,
            }
        })
    }

    setPokemonXP(pokemonId: string, XP: number): Promise<Pokemons | null> {
        return this.prisma.pokemons.update({
            where: {
                pokemonId
            },
            data: {
                pokemonXP: {increment: XP}
            }
        })
    }

    setPokemonSelected(pokemonId: string, selected: boolean): Promise<Pokemons | null> {
        return this.prisma.pokemons.update({
            where: {
                pokemonId,
            },
            data: {
                pokemonSelected: selected,
            }
        });
    }

    setPokemonFavorite(pokemonId: string, favorite: boolean): Promise<Pokemons | null> {
        return this.prisma.pokemons.update({
            where: {
                pokemonId,
            },
            data: {
                pokemonFavorite: favorite,
            }
        })
    }

    setPokemonAuction(pokemonId: string, auction: boolean): Promise<Pokemons | null> {
        return this.prisma.pokemons.update({
            where: {
                pokemonId,
            },
            data: {
                pokemonAuction: auction,
            }
        })
    }

    setPokemonOwner(pokemonId: string, newOwnerId: string, placementId: number): Promise<Pokemons | null> {
        return this.prisma.pokemons.update({
            where: {
                pokemonId
            },
            data: {
                pokemonOwner: newOwnerId,
                pokemonPlacementId: placementId,
            }
        })
    }

    deleteSpawnedPokemon(pokemonId: string) {
        return this.prisma.pokemons.delete({
            where: {
                pokemonId
            }
        });
    }

    deleteCatchablePokemon() {
        return this.prisma.pokemons.deleteMany({
            where: {
                pokemonCatch: true,
            },
        });
    }

    deleteCaughtPokemon(pokemonId: string) {
        return this.prisma.pokemons.delete({
            where: {
                pokemonId,
            }
        });
    }

    deleteAllTrainerPokemons(userId: string) {
        return this.prisma.pokemons.deleteMany({
            where: {
                pokemonOwner: userId,
            }
        })
    }

    /*
    * TRAINER GETTERS AND SETTERS!
    * */

    registerNewUser(userid: string, nextTrainerNum: number): Promise<userData | null> {
        return this.prisma.userData.create({
            data: {
                userId: userid,
                userBlacklisted: false,
                trainerNumber: nextTrainerNum,
                trainerBattles: 0,
                userBag: {
                    create: {
                        userRedeems: 0,
                        spawnIncense: 0,
                        catchBuddyCandy: 0,
                    }
                },
                userCatchBuddy: {
                    create: {
                        catcherRefill: 0,
                        pokemonUpgrade: 0,
                        pokemonLuckUpgrade: 0,
                        pokemonDuration: 0,
                        catcherLeft: 0,
                        catcherNext: 0,
                    }
                },
                voteStreak: {
                    create: {
                        voteStreak: 0,
                        latestVote: 0,
                    }
                },
            }
        });
    }

    registerUserChallenges(userId: string) {
        return this.prisma.userChallenges.createMany({
            data: [{
                challengesOwner: userId,
                challengesName: 'Catch 20 Legendary Pokémons',
                challengesDescription: 'These legendary Pokémons are known to be harder to catch, are you up for the challenge?',
                challengesAmount: 25,
                challengesCaughtAmount: 0,
                challengesCompleted: false,
                challengesToCatch: "legendary",
                challengesTokenReward: 100,
            }, {
                challengesOwner: userId,
                challengesName: 'Catch 10,000 Pokémons',
                challengesDescription: 'There are tons of Pokémons out there, can you even reach this amount?',
                challengesAmount: 10000,
                challengesCaughtAmount: 0,
                challengesCompleted: false,
                challengesToCatch: "any",
                challengesTokenReward: 100,
            }, {
                challengesOwner: userId,
                challengesName: 'Catch 100 Pidgeys',
                challengesDescription: 'These pidgeys have been flying all around the city, please catch them asap!',
                challengesAmount: 100,
                challengesCaughtAmount: 0,
                challengesCompleted: false,
                challengesToCatch: "Pidgey",
                challengesCoinReward: 100000,
            }, {
                challengesOwner: userId,
                challengesName: 'Catch 25 Bulbasaurs',
                challengesDescription: 'Please catch them for me, these have been running around all day.',
                challengesAmount: 25,
                challengesCaughtAmount: 0,
                challengesCompleted: false,
                challengesToCatch: "Bulbasaur",
                challengesCoinReward: 250000,
            }, {
                challengesOwner: userId,
                challengesName: 'Catch 10 Shiny Pokémons',
                challengesDescription: 'These Pokémons have a different color, these must be special.',
                challengesAmount: 10,
                challengesCaughtAmount: 0,
                challengesCompleted: false,
                challengesToCatch: "shiny",
                challengesCoinReward: 2500000,
            }, {
                challengesOwner: userId,
                challengesName: 'Catch 1 Mew',
                challengesDescription: 'A very special Pokémon has been roaming around, could you try catch this?',
                challengesAmount: 1,
                challengesCaughtAmount: 0,
                challengesCompleted: false,
                challengesToCatch: "Mew",
                challengesTokenReward: 25,
            }]
        });
    }

    addChannelIncense(serverId: string, channelId: string, enabled: boolean, timeout: number): Promise<channelIncense | null> {
        return this.prisma.channelIncense.create({
            data: {
                serverId,
                channelId,
                incenseEnabled: enabled,
                incenseTimeout: timeout,
            }
        });
    }

    removeChannelIncense(channelId: string) {
        return this.prisma.channelIncense.delete({
            where: {
                channelId,
            }
        })
    }

    findChannelIncense(channelId: string, serverId: string): Promise<channelIncense | null> {
        return this.prisma.channelIncense.findFirst({
            where: {
                channelId,
                serverId,
            }
        })
    }

    findNextTrainerId(): Promise<userData | null> {
        return this.prisma.userData.findFirst({
            orderBy: [{
                trainerNumber: 'asc'
            }],
            take: 1
        })
    }

    findPokemonTrainer(userId: string): Promise<userData | null> {
        return this.prisma.userData.findFirst({
            where: {
                userId,
            },
            include: {
                userBag: true,
                userCatchBuddy: true,
                voteStreak: true,
                userChallenges: true,
            }
        });
    }

    getPokemonNextPokeId(userId: string): Promise<Pokemons[]> {
        return this.prisma.pokemons.findMany({
            where: {
                pokemonOwner: userId,
                NOT: {
                    pokemonPlacementId: null,
                }
            },
            orderBy: [{
                pokemonPlacementId: 'desc',
            }],
            take: 1,
            skip: 0,
        })
    }

    getTrainerPokemons(userId: string): Promise<Pokemons[]> {
        return this.prisma.pokemons.findMany({
            where: {
                pokemonOwner: userId
            },
            include: {
                PokemonIVs: true
            },
            orderBy: [{
                pokemonPlacementId: 'asc'
            }]
        })
    }

    getTrainerTopCoins(): Promise<userData[]>  {
        return this.prisma.userData.findMany({
            orderBy: [{
                userCoins: 'desc',
            }],
            take: 10
        })
    }

    getTrainerTopTokens(): Promise<userData[]> {
        return this.prisma.userData.findMany({
            orderBy: [{
                userTokens: 'desc',
            }],
            take: 10
        })
    }

    getTrainerTopBattles(): Promise<userData[]> {
        return this.prisma.userData.findMany({
            orderBy: [{
                trainerBattles: 'desc',
            }],
            take: 10
        })
    }

    increaseBattlesWon(userId: string): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                trainerBattles: {increment: 1}
            }
        })
    }

    increaseUserRedeems(userId: string, amount: number): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId,
            },
            data: {
                userBag: {
                    update: {
                        userRedeems: {increment: amount}
                    }
                }
            }
        })
    }

    increaseUserIncenses(userId: string, amount: number): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId,
            },
            data: {
                userBag: {
                    update: {
                        spawnIncense: {increment: amount}
                    }
                }
            }
        })
    }

    increaseUserBCandy(userId: string, amount: number): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userBag: {
                    update: {
                        catchBuddyCandy: {increment: amount}
                    }
                }
            }
        })
    }

    setUserRedeems(userId: string, amount: number): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userBag: {
                    update: {
                        userRedeems: amount,
                    }
                }
            }
        });
    }

    setUserBCandy(userId: string, amount: number): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userBag: {
                    update: {
                        catchBuddyCandy: amount,
                    }
                }
            }
        })
    }

    setTrainerOrder(userId: string, orderBy: PokemonOrder): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                pokemonOrder: orderBy
            }
        })
    }

    setTrainerIncenses(userId: string, incenses: number): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userBag: {
                    update: {
                        spawnIncense: incenses,
                    }
                }
            }
        })
    }

    sortTrainerPokemonsLevel(userId: string): Promise<Pokemons[]> {
        return this.prisma.pokemons.findMany({
            where: {
                pokemonOwner: userId
            },
            include: {
                PokemonIVs: true
            },
            orderBy: [{
                pokemonLevel: 'desc'
            }]
        })
    }

    sortTrainerPokemonsFavorite(userId: string): Promise<Pokemons[]> {
        return this.prisma.pokemons.findMany({
            where: {
                pokemonOwner: userId,
            },
            include: {
                PokemonIVs: true
            },
            orderBy: [{
                pokemonFavorite: 'desc',
            }]
        })
    }

    sortTrainerPokemonsIV(userId: string): Promise<Pokemons[]> {
        return this.prisma.pokemons.findMany({
            where: {
                pokemonOwner: userId,
            },
            include: {
                PokemonIVs: true
            },
        });
    }

    displayTrainerPokemons(userId: string, Rarity: PokemonRarity): Promise<Pokemons[]> {
        return this.prisma.pokemons.findMany({
            where: {
                pokemonOwner: userId,
                pokemonRarity: Rarity,
            },
            include: {
                PokemonIVs: true
            },
        })
    }

    removeTrainerData(userId: string) {
        return this.prisma.userData.delete({
            where: {
                userId,
            }
        })
    }

    setTimeoutStatus(userId: string, status: boolean, date: number) {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userTimeout: status,
                userTimeoutDate: date,
            }
        })
    }

    incrementTotalTimeouts(userId: string) {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userTotalTimeouts: {increment: 1}
            }
        })
    }

    setUserBlacklistedStatus(userId: string, status: boolean) {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userBlacklisted: status
            }
        });
    }

    /*
    * SERVER GETTERS & SETTERS
    * */

    getServer(serverId: string): Promise<PokemonServer | null> {
        return this.prisma.pokemonServer.findFirst({
            where: {
                serverId
            }
        });
    }

    addServer(serverId: string): Promise<PokemonServer> {
        return this.prisma.pokemonServer.create({
            data: {
                serverId,
                serverBlacklisted: false,
                serverSpawn: 0,
                serverLanguage: 'en',
            }
        });
    }

    incrementServerSpawnChance(serverId: string, increment: number): Promise<PokemonServer | null> {
        return this.prisma.pokemonServer.update({
            where: {
                serverId
            },
            data: {
                serverSpawn: {increment}
            }
        });
    }

    setServerSpawnChance(serverId: string, number: number): Promise<PokemonServer | null> {
        return this.prisma.pokemonServer.update({
            where: {
                serverId
            },
            data: {
                serverSpawn: number
            }
        });
    }

    setRedirectChannel(serverId: string, channelId: string | null): Promise<PokemonServer | null> {
        return this.prisma.pokemonServer.update({
            where: {
                serverId
            },
            data: {
                serverRedirect: channelId
            }
        });
    }

    setAnnouncer(serverId: string, enabled: boolean): Promise<PokemonServer | null> {
        return this.prisma.pokemonServer.update({
            where: {
                serverId
            },
            data: {
                serverAnnouncer: enabled
            }
        })
    }

    /*
    * PAYMENT GETTERS & SETTERS
    * */

    createPayment(invoiceOwner: string, invoiceId: string, invoiceType: string): Promise<userPayment | null> {
        return this.prisma.userPayment.create({
            data: {
                invoiceOwner,
                invoiceId,
                invoiceType,
            }
        });
    }

    hasPayment(invoiceId: string): Promise<userPayment | null> {
        return this.prisma.userPayment.findFirst({
            where: {
                invoiceId
            }
        });
    }

    increaseCoins(userId: string, amount: number | TrainerRanks): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userCoins: {
                    increment: amount as number
                }
            }
        });
    }

    increaseTokens(userId: string, amount: number | TrainerRanks): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userTokens: {
                    increment: amount as number
                }
            }
        });
    }

    setTrainerRank(userId: string, newRank: number | TrainerRanks): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                trainerRank: newRank as TrainerRanks
            }
        });
    }

    setTokens(userId: string, newTokens: number): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userTokens: newTokens
            }
        })
    }

    setCoins(userId: string, newCoins: number): Promise<userData | null> {
        return this.prisma.userData.update({
            where: {
                userId
            },
            data: {
                userCoins: newCoins
            }
        })
    }

    findChallenge(userId: string, challengeId: number): Promise<userChallenges | null> {
        return this.prisma.userChallenges.findFirst({
            where: {
                challengesOwner: userId,
                challengesId: challengeId,
            }
        })
    }

    incrementChallengeCaught(challengesId: number): Promise<userChallenges | null> {
        return this.prisma.userChallenges.update({
            where: {
                challengesId
            },
            data: {
                challengesCaughtAmount: {increment: 1}
            }
        });
    }

    setChallengeCompleted(challengesId: number): Promise<userChallenges | null> {
        return this.prisma.userChallenges.update({
            where: {
                challengesId
            },
            data: {
                challengesCompleted: true
            }
        })
    }

    /*
    * CODES GETTERS & SETTERS
    * */

    createCode(code: string, rewardType: RewardType, rewardAmount: number, codeLimitation: number): Promise<globalCodes | null> {
        return this.prisma.globalCodes.create({
            data: {
                code,
                codeLimitation,
                rewardAmount,
                rewardType,
                codeRedeemed: 0,
            }
        })
    }

    findCode(code: string): Promise<globalCodes | null> {
        return this.prisma.globalCodes.findFirst({
            where: {
                code,
            }
        });
    }

    findUserCode(userId: string, code: string): Promise<userCodes | null> {
        return this.prisma.userCodes.findFirst({
            where: {
                userId,
                code,
            }
        });
    }

    increaseCodeRedeemed(code: string): Promise<globalCodes | null> {
        return this.prisma.globalCodes.update({
            where: {
                code,
            },
            data: {
                codeRedeemed: {increment: 1},
            }
        });
    }

    redeemAttempt(userId: string, code: string): Promise<userCodes | null> {
        return this.prisma.userCodes.create({
            data: {
                userId,
                code,
            }
        });
    }

    /*
    * AUCTIONS GETTERS & SETTERS
    * */

    addPokemonAuction(pokemonId: string, userId: string, endTime: number, auctionStart: number, auctionId: number, currentDate: number) {
        return this.prisma.pokemonsAuction.create({
            data: {
                pokemonId,
                leaderData: userId,
                endTime,
                auctionStart,
                auctionId,
                auctionCurrent: 0,
                leaderBidTime: currentDate,
                bidAmounts: 0,
            }
        })
    }

    setAuctionBid(auctionId: number, newBid: number, bidAmounts: number, bidTime: number, leader: string): Promise<PokemonsAuction | null> {
        return this.prisma.pokemonsAuction.update({
            where: {
                auctionId,
            },
            data: {
                auctionCurrent: newBid,
                bidAmounts,
                leaderData: leader,
                leaderBidTime: bidTime,
            }
        })
    }

    findNextAuctionId(): Promise<PokemonsAuction | null> {
        return this.prisma.pokemonsAuction.findFirst({
            orderBy: [{
                auctionId: 'asc',
            }],
            take: 1,
        })
    }

    findAllAuctions(): Promise<PokemonsAuction[]> {
        return this.prisma.pokemonsAuction.findMany({
            include: {
                pokemon: {
                    include: {
                        PokemonIVs: true,
                    }
                },
                leader: true,
            },
            orderBy: [{
                auctionId: 'asc',
            }]
        });
    }

    findSpecificAuction(auctionId: number): Promise<PokemonsAuction | null> {
        return this.prisma.pokemonsAuction.findFirst({
            where: {
                auctionId,
            },
            include: {
                pokemon: true
            }
        })
    }

    removePokemonAuction(pokemonId: string) {
        return this.prisma.pokemonsAuction.delete({
            where: {
                pokemonId,
            }
        });
    }

    /*
    * CATCHBUDDY GETTERS & SETTERS
    * */

    getAllBuddies(): Promise<userCatchBuddy[]> {
        return this.prisma.userCatchBuddy.findMany();
    }

    getOneBuddy(userId: string): Promise<userCatchBuddy | null> {
        return this.prisma.userCatchBuddy.findFirst({
            where: {
                userId
            }
        });
    }

    setCatchAvailableStatus(userId: string, status: boolean): Promise<userCatchBuddy> {
        return this.prisma.userCatchBuddy.update({
            where: {
                userId
            },
            data: {
                catchAvailable: status,
            }
        });
    }

    setCatcherEnabledStatus(userId: string, status: boolean) {
        return this.prisma.userCatchBuddy.update({
            where: {
                userId,
            },
            data: {
                catcherEnabled: status,
            }
        })
    }

    setCatcherNextTime(userId: string, nextTime: number): Promise<userCatchBuddy> {
        return this.prisma.userCatchBuddy.update({
            where: {
                userId
            },
            data: {
                catcherNext: nextTime
            }
        })
    }

    setCatcherRefillTime(userId: string, refillTime: number) {
        return this.prisma.userCatchBuddy.update({
            where: {
                userId
            },
            data: {
                catcherRefill: refillTime
            }
        })
    }

    setCatcherLeftTime(userId: string, leftTime: number) {
        return this.prisma.userCatchBuddy.update({
            where: {
                userId
            },
            data: {
                catcherLeft: leftTime
            }
        });
    }

    incremenetCatcherCaught(userId: string): Promise<userCatchBuddy> {
        return this.prisma.userCatchBuddy.update({
            where: {
                userId,
            },
            data: {
                catcherCaught: {increment: 1}
            }
        })
    }

    incrementPokemonUpgrade(userId: string): Promise<userCatchBuddy> {
        return this.prisma.userCatchBuddy.update({
            where: {
                userId
            },
            data: {
                pokemonUpgrade: {increment: 1}
            }
        });
    }

    incrementDurationUpgrade(userId: string): Promise<userCatchBuddy> {
        return this.prisma.userCatchBuddy.update({
            where: {
                userId
            },
            data: {
                pokemonDuration: {increment: 1}
            }
        });
    }

    incrementLuckUpgrade(userId: string): Promise<userCatchBuddy> {
        return this.prisma.userCatchBuddy.update({
            where: {
                userId
            },
            data: {
                pokemonLuckUpgrade: {increment: 1}
            }
        });
    }

    /*
    * VOTES GETTERS & SETTERS
    * */

    setNewVote(userId: string, voteTimestamp: number): Promise<VoteStreak> {
        return this.prisma.voteStreak.update({
            where: {
                userId
            },
            data: {
                latestVote: voteTimestamp
            }
        });
    }

    setNewExpireVote(userId: string, voteExpireTimestamp: number): Promise<VoteStreak> {
        return this.prisma.voteStreak.update({
            where: {
                userId
            },
            data: {
                latestVoteExpire: voteExpireTimestamp
            }
        });
    }

    incrementVoteStreak(userId: string): Promise<VoteStreak> {
        return this.prisma.voteStreak.update({
            where: {
                userId
            },
            data: {
                voteStreak: {increment: 1}
            }
        });
    }

    /*
    * LOTTERY GETTERS & SETTERS
    * */

    getLotteryGlobals(): Promise<lotteryGlobal | null> {
        return this.prisma.lotteryGlobal.findFirst({
            where: {
                lotteryId: 1
            }
        });
    }

    countUserTickets(userId: string): Promise<number> {
        return this.prisma.userTickets.count({
            where: {
                ticketsOwner: userId
            }
        });
    }

    countAllTickets(): Promise<number> {
        return this.prisma.userTickets.count();
    }

    findAllTickets(): Promise<userTickets[]> {
        return this.prisma.userTickets.findMany({});
    }

    getSpecificTicket(randomSkip: number) {
        return this.prisma.userTickets.findFirst({
            skip: randomSkip,
            take: 1,
        })
    }

    findUserTickets(userId: string) {
        return this.prisma.userTickets.findFirst({
            where: {
                ticketsOwner: userId
            }
        });
    }

    addNewTickets(data: any) {
        return this.prisma.userTickets.createMany({data});
    }

    incrementLotteryPars() {
        return this.prisma.lotteryGlobal.update({
            where: {
                lotteryId: 1
            },
            data: {
                currentParticipants: {increment: 1}
            }
        });
    }

    incrementTotalEntries(entries: number) {
        return this.prisma.lotteryGlobal.update({
            where: {
                lotteryId: 1
            },
            data: {
                totalBought: {increment: entries}
            }
        });
    }

    incrementTotalJackpot(increment: number) {
        return this.prisma.lotteryGlobal.update({
            where: {
                lotteryId: 1
            },
            data: {
                currentJackpot: {increment: increment}
            }
        });
    }

    setNewGlobalLotteryData(currentJackpot: number, currentlyEnding: number, totalBought: number, currentParticipants: number) {
        return this.prisma.lotteryGlobal.update({
            where: {
                lotteryId: 1
            },
            data: {
                totalBought,
                currentJackpot,
                currentlyEnding,
                currentParticipants,
            }
        });
    }

    deleteLotteryTickets() {
        return this.prisma.userTickets.deleteMany({});
    }
}
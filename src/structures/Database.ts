import {
    PrismaClient,
    userData,
    userPayment,
    PokemonServer,
    Pokemon,
    Pokemons,
    PokemonGender,
    PokemonNature,
    PokemonRarity, TrainerRanks,
} from '@prisma/client';

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
                pokemonName
            },
            include: {
                pokemonEvolve: true,
                pokemonEVs: true,
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

    getRandomPokemon(pokemonRarity: PokemonRarity, randomSkip: number): Promise<Pokemon | null> {
        return this.prisma.pokemon.findFirst({
            where: {
                pokemonRarity
            },
            skip: randomSkip,
            take: 1
        });
    }

    /*
    * SPAWNED & CLAIMED GETTERS AND SETTERS!
    * */

    spawnNewPokemon(serverId: string, channelId: string, messageId: string, pokemonId: string, pokemonName: string, pokemonPicture: string, pokemonGender: PokemonGender, pokemonNature: PokemonNature, pokemonLevel: number, ivData: any, evData: any): Promise<Pokemons | null> {
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

    findSpawnedPokemon(channelId: string, pokemonName: string): Promise<Pokemons | null> {
        return this.prisma.pokemons.findFirst({
            where: {
                pokemonName,
                spawnedChannel: channelId,
                pokemonCatch: true
            }
        });
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

    setNewPokemonOwner(pokemonId: string, pokemonOwner: string, pokemonPicture: string, pokemonName: string, pokemonNature: PokemonNature, pokemonGender: PokemonGender, pokemonSelected: boolean, ivData: any, evData: any): Promise<Pokemons | null> {
        return this.prisma.pokemons.create({
            data: {
                pokemonId,
                pokemonOwner,
                pokemonPicture,
                pokemonName,
                pokemonNature,
                pokemonGender,
                pokemonSelected,
                pokemonFavorite: false,
                pokemonPlacementId: 1,
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

    /*
    * TRAINER GETTERS AND SETTERS!
    * */

    registerNewUser(userid: string, nextTrainerNum: number): Promise<userData | null> {
        return this.prisma.userData.create({
            data: {
                userId: userid,
                userBlacklisted: false,
                trainerNumber: nextTrainerNum,
                userBag: {
                    create: {
                        userRedeems: 0
                    }
                }
            }
        });
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
}
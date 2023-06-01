import {
    PrismaClient,
    userData,
    PokemonServer,
    Pokemon,
    Pokemons,
    PokemonGender,
    PokemonNature,
    PokemonRarity,
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
                pokemonEvolve: true
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

    spawnNewPokemon(serverId: string, channelId: string, messageId: string, pokemonId: string, pokemonName: string, pokemonPicture: string, pokemonGender: PokemonGender, pokemonNature: PokemonNature, pokemonLevel: number, ivData: any): Promise<Pokemons | null> {
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

    setNewPokemonOwner(pokemonId: string, pokemonOwner: string, pokemonPicture: string, pokemonName: string, pokemonNature: PokemonNature, pokemonGender: PokemonGender, pokemonSelected: boolean, ivData: any): Promise<Pokemons | null> {
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

    /*
    * TRAINER GETTERS AND SETTERS!
    * */

    registerNewUser(userid: string, nextTrainerNum: number): Promise<userData | null> {
        return this.prisma.userData.create({
            data: {
                userId: userid,
                userBlacklisted: false,
                trainerNumber: nextTrainerNum,
            }
        });
    }

    findNextTrainerId(): Promise<number> {
        return this.prisma.userData.count();
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
        })
    }
}
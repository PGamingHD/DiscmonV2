import {
    PrismaClient,
    userData,
    PokemonServer,
    Pokemon,
    Pokemons,
    PokemonType,
    PokemonEvolve,
    PokemonsIVs,
    PokemonGender, PokemonNature, PokemonRarity, PokeType
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

    /*addNewPokemon(pokemonId: string, pokemonPokedex: number, pokemonName: string, pokemonPicture: string, pokemonShinyPicture: string, pokemonRarity: PokemonRarity, pokeEvolve: any, pokeType: any): Promise<Pokemon> {
        return this.prisma.pokemon.create({
            data: {
                pokemonId,
                pokemonPokedex,
                pokemonName,
                pokemonPicture,
                pokemonRarity,
                pokemonShinyPicture,
                pokemonEvolve: pokeEvolve,
                pokemonType: pokeType,
            }
        });
    }*/

    addPokemonTypes(pokemonId: string, pokemonType: PokeType, typeUniqueId: string): Promise<PokemonType> {
        return this.prisma.pokemonType.create({
            data: {
                pokemonId,
                pokemonType,
                typeUniqueId,
            }
        });
    }

    addPokemonEvolve(pokemonId: string, nextName: string, evolveUniqueId: string, evolveStage: number): Promise<PokemonEvolve> {
        return this.prisma.pokemonEvolve.create({
            data: {
                pokemonId,
                nextEvolveName: nextName,
                evolveUniqueId,
                currentEvolveStage: evolveStage
            }
        })
    }

    getPokemonCount(): Promise<number> {
        return this.prisma.pokemon.count();
    }

    getPokemon(pokemonName: string): Promise<Pokemon | null> {
        return this.prisma.pokemon.findFirst({
            where: {
                pokemonName
            }
        });
    }

    /*
    * SPAWNED & CLAIMED GETTERS AND SETTERS!
    * */

    spawnNewPokemon(serverId: string, channelId: string, messageId: string, pokemonId: string, pokemonName: string, pokemonPicture: string, pokemonGender: PokemonGender, pokemonNature: PokemonNature): Promise<Pokemons | null> {
        return this.prisma.pokemons.create({
            data: {
                pokemonId,
                pokemonName,
                pokemonPicture,
                pokemonXP: 0,
                pokemonLevel: 1,
                pokemonCatch: true,
                pokemonSelected: false,
                pokemonFavorite: false,
                pokemonGender,
                pokemonNature,
                spawnedServer: serverId,
                spawnedChannel: channelId,
                spawnedMessage: messageId,
            }
        });
    }

    findSpawnedPokemon(channelId: string): Promise<Pokemons | null> {
        return this.prisma.pokemons.findFirst({
            where: {
                spawnedChannel: channelId,
                pokemonCatch: true
            }
        });
    }

    setSpawnedOwner(pokemonId: string, pokemonOwner: string): Promise<Pokemons | null> {
        return this.prisma.pokemons.update({
            where: {
                pokemonId,
            },
            data: {
                pokemonOwner,
                pokemonCatch: false,

                spawnedServer: null,
                spawnedMessage: null,
                spawnedChannel: null,
            }
        });
    }

    setNewPokemonOwner(pokemonId: string, pokemonOwner: string, pokemonPicture: string, pokemonName: string, pokemonNature: PokemonNature, pokemonGender: PokemonGender, pokemonSelected: boolean, ): Promise<Pokemons | null> {
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
                pokemonLevel: 1,
                pokemonXP: 0,
                pokemonCatch: false,
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
            }
        });
    }

    findNextTrainerId(): Promise<number> {
        return this.prisma.userData.count();
    }

    findPokemonTrainer(userId: string): Promise<userData | null> {
        return this.prisma.userData.findFirst({
            where: {
                userId
            }
        });
    }
}
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
  lotteryGlobal,
  userTickets,
} from "@prisma/client";

export class Database {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /*
   * POKEMON GETTERS & SETTERS
   * */

  AddNewPokemon(data: any): Promise<Pokemon> {
    return this.prisma.pokemon.create({ data });
  }

  GetPokemonCount(): Promise<number> {
    return this.prisma.pokemon.count();
  }

  GetPokemonRarityCount(pokemonRarity: PokemonRarity): Promise<number> {
    return this.prisma.pokemon.count({
      where: {
        pokemonRarity,
      },
    });
  }

  GetPokemon(pokemonName: string): Promise<Pokemon | null> {
    return this.prisma.pokemon.findFirst({
      where: {
        pokemonName,
      },
      include: {
        pokemonEvolve: true,
        pokemonEVs: true,
        pokemonType: true,
      },
    });
  }

  GetAllPokemons(): Promise<Pokemon[]> {
    return this.prisma.pokemon.findMany({
      orderBy: [
        {
          pokemonPokedex: "asc",
        },
      ],
      include: {
        pokemonType: true,
        pokedexEntries: true,
      },
    });
  }

  GetAllDexPokemons(userId: string) {
    return this.prisma.pokemon.findMany({
      include: {
        pokemonType: true,
        pokedexEntries: {
          where: {
            userId,
          },
        },
      },
    });
  }

  GetSpecificPokemonName(name: string): Promise<Pokemon | null> {
    return this.prisma.pokemon.findFirst({
      where: {
        pokemonName: name,
      },
      include: {
        pokemonEVs: true,
        pokemonType: true,
      },
    });
  }

  GetSpecificPokemonId(id: number): Promise<Pokemon | null> {
    return this.prisma.pokemon.findFirst({
      where: {
        pokemonPokedex: id,
      },
      include: {
        pokemonEVs: true,
        pokemonType: true,
      },
    });
  }

  GetRandomPokemon(
    pokemonRarity: PokemonRarity,
    randomSkip: number
  ): Promise<Pokemon | null> {
    return this.prisma.pokemon.findFirst({
      where: {
        pokemonRarity,
      },
      include: {
        pokemonEVs: true,
      },
      skip: randomSkip,
      take: 1,
    });
  }

  /*
   * SPAWNED & CLAIMED GETTERS AND SETTERS!
   * */

  SpawnNewPokemon(
    serverId: string,
    channelId: string,
    messageId: string,
    pokemonId: string,
    pokemonName: string,
    pokemonPicture: string,
    pokemonGender: PokemonGender,
    pokemonNature: PokemonNature,
    pokemonRarity: PokemonRarity,
    pokemonLevel: number,
    ivData: any,
    evData: any
  ): Promise<Pokemons | null> {
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
          create: ivData,
        },
        PokemonsEVs: {
          create: evData,
        },
      },
    });
  }

  SpawnNewRedeemPokemon(
    pokemonId: string,
    ownerId: string,
    placementId: number,
    pokemonName: string,
    pokemonPicture: string,
    pokemonGender: PokemonGender,
    pokemonNature: PokemonNature,
    pokemonRarity: PokemonRarity,
    pokemonLevel: number,
    ivData: any,
    evData: any
  ): Promise<Pokemons | null> {
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
          create: ivData,
        },
        PokemonsEVs: {
          create: evData,
        },
      },
    });
  }

  FindSpawnedPokemon(
    channelId: string,
    pokemonName: string
  ): Promise<Pokemons | null> {
    return this.prisma.pokemons.findFirst({
      where: {
        pokemonName,
        spawnedChannel: channelId,
        pokemonCatch: true,
      },
    });
  }

  FindOneSpawnedPokemon(channelId: string): Promise<Pokemons | null> {
    return this.prisma.pokemons.findFirst({
      where: {
        spawnedChannel: channelId,
        pokemonCatch: true,
      },
    });
  }

  FindSpawnedExactPokemon(
    pokemonId: string,
    channelId: string
  ): Promise<Pokemons | null> {
    return this.prisma.pokemons.findFirst({
      where: {
        pokemonId,
        spawnedChannel: channelId,
        pokemonCatch: true,
      },
    });
  }

  FindDeleteCatchablePokemon(): Promise<Pokemons[]> {
    return this.prisma.pokemons.findMany({
      where: {
        pokemonCatch: true,
      },
    });
  }

  FindUserSelectedPokemon(userId: string): Promise<Pokemons | null> {
    return this.prisma.pokemons.findFirst({
      where: {
        pokemonSelected: true,
        pokemonOwner: userId,
      },
      include: {
        PokemonsEVs: true,
        PokemonIVs: true,
      },
    });
  }

  FindAllPokemons(): Promise<Pokemons[]> {
    return this.prisma.pokemons.findMany({
      include: {
        PokemonIVs: true,
      },
    });
  }

  FindPlacementPokemon(
    userId: string,
    placementId: number
  ): Promise<Pokemons | null> {
    return this.prisma.pokemons.findFirst({
      where: {
        pokemonOwner: userId,
        pokemonPlacementId: placementId,
      },
    });
  }

  SetSpawnedOwner(
    pokemonId: string,
    pokemonOwner: string,
    placementId: number
  ): Promise<Pokemons | null> {
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
      },
    });
  }

  SetNewPokemonOwner(
    pokemonId: string,
    pokemonOwner: string,
    pokemonPicture: string,
    pokemonName: string,
    pokemonNature: PokemonNature,
    pokemonGender: PokemonGender,
    pokemonRarity: PokemonRarity,
    pokemonSelected: boolean,
    pokemonPlacementId: number,
    ivData: any,
    evData: any
  ): Promise<Pokemons | null> {
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
          create: ivData,
        },
        PokemonsEVs: {
          create: evData,
        },
      },
    });
  }

  SetPokemonEvolve(
    pokemonId: string,
    evolveName: string,
    evolvePic: string
  ): Promise<Pokemons | null> {
    return this.prisma.pokemons.update({
      where: {
        pokemonId,
      },
      data: {
        pokemonName: evolveName,
        pokemonPicture: evolvePic,
        pokemonXP: 0,
      },
    });
  }

  SetPokemonLevelUp(pokemonId: string): Promise<Pokemons | null> {
    return this.prisma.pokemons.update({
      where: {
        pokemonId,
      },
      data: {
        pokemonLevel: { increment: 1 },
        pokemonXP: 0,
      },
    });
  }

  SetPokemonXP(pokemonId: string, XP: number): Promise<Pokemons | null> {
    return this.prisma.pokemons.update({
      where: {
        pokemonId,
      },
      data: {
        pokemonXP: { increment: XP },
      },
    });
  }

  SetPokemonSelected(
    pokemonId: string,
    selected: boolean
  ): Promise<Pokemons | null> {
    return this.prisma.pokemons.update({
      where: {
        pokemonId,
      },
      data: {
        pokemonSelected: selected,
      },
    });
  }

  SetPokemonFavorite(
    pokemonId: string,
    favorite: boolean
  ): Promise<Pokemons | null> {
    return this.prisma.pokemons.update({
      where: {
        pokemonId,
      },
      data: {
        pokemonFavorite: favorite,
      },
    });
  }

  SetPokemonAuction(
    pokemonId: string,
    auction: boolean
  ): Promise<Pokemons | null> {
    return this.prisma.pokemons.update({
      where: {
        pokemonId,
      },
      data: {
        pokemonAuction: auction,
      },
    });
  }

  SetPokemonOwner(
    pokemonId: string,
    newOwnerId: string,
    placementId: number
  ): Promise<Pokemons | null> {
    return this.prisma.pokemons.update({
      where: {
        pokemonId,
      },
      data: {
        pokemonOwner: newOwnerId,
        pokemonPlacementId: placementId,
      },
    });
  }

  DeleteSpawnedPokemon(pokemonId: string) {
    return this.prisma.pokemons.delete({
      where: {
        pokemonId,
      },
    });
  }

  DeleteCatchablePokemon() {
    return this.prisma.pokemons.deleteMany({
      where: {
        pokemonCatch: true,
      },
    });
  }

  DeleteCaughtPokemon(pokemonId: string) {
    return this.prisma.pokemons.delete({
      where: {
        pokemonId,
      },
    });
  }

  DeleteAllTrainerPokemons(userId: string) {
    return this.prisma.pokemons.deleteMany({
      where: {
        pokemonOwner: userId,
      },
    });
  }

  /*
   * TRAINER GETTERS AND SETTERS!
   * */

  RegisterNewUser(
    userid: string,
    nextTrainerNum: number
  ): Promise<userData | null> {
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
          },
        },
        userCatchBuddy: {
          create: {
            catcherRefill: 0,
            pokemonUpgrade: 0,
            pokemonLuckUpgrade: 0,
            pokemonDuration: 0,
            catcherLeft: 0,
            catcherNext: 0,
          },
        },
        voteStreak: {
          create: {
            voteStreak: 0,
            latestVote: 0,
          },
        },
      },
    });
  }

  RegisterUserPokedex(userId: string, pokemonId: string) {
    return this.prisma.pokemon
      .findMany()
      .then((allPokemons: Pokemon[]) => {
        const dexEntries = allPokemons.map((pokemon: Pokemon) => {
          if (pokemon.pokemonId === pokemonId) {
            return {
              pokemonId: pokemon.pokemonId,
              caught: true,
              userId: userId,
            };
          }
          return {
            pokemonId: pokemon.pokemonId,
            caught: false,
            userId: userId,
          };
        });

        return this.prisma.pokedexEntry.createMany({
          data: dexEntries,
        });
      })
      .then((createdEntries) => {
        return createdEntries;
      })
      .catch((error) => {
        console.error("Error registering user Pokedex:", error);
        throw error;
      });
  }

  RegisterUserChallenges(userId: string) {
    return this.prisma.userChallenges.createMany({
      data: [
        {
          challengesOwner: userId,
          challengesName: "Catch 20 Legendary Pokémons",
          challengesDescription:
            "These legendary Pokémons are known to be harder to catch, are you up for the challenge?",
          challengesAmount: 25,
          challengesCaughtAmount: 0,
          challengesCompleted: false,
          challengesToCatch: "legendary",
          challengesTokenReward: 100,
        },
        {
          challengesOwner: userId,
          challengesName: "Catch 10,000 Pokémons",
          challengesDescription:
            "There are tons of Pokémons out there, can you even reach this amount?",
          challengesAmount: 10000,
          challengesCaughtAmount: 0,
          challengesCompleted: false,
          challengesToCatch: "any",
          challengesTokenReward: 100,
        },
        {
          challengesOwner: userId,
          challengesName: "Catch 100 Pidgeys",
          challengesDescription:
            "These pidgeys have been flying all around the city, please catch them asap!",
          challengesAmount: 100,
          challengesCaughtAmount: 0,
          challengesCompleted: false,
          challengesToCatch: "Pidgey",
          challengesCoinReward: 100000,
        },
        {
          challengesOwner: userId,
          challengesName: "Catch 25 Bulbasaurs",
          challengesDescription:
            "Please catch them for me, these have been running around all day.",
          challengesAmount: 25,
          challengesCaughtAmount: 0,
          challengesCompleted: false,
          challengesToCatch: "Bulbasaur",
          challengesCoinReward: 250000,
        },
        {
          challengesOwner: userId,
          challengesName: "Catch 10 Shiny Pokémons",
          challengesDescription:
            "These Pokémons have a different color, these must be special.",
          challengesAmount: 10,
          challengesCaughtAmount: 0,
          challengesCompleted: false,
          challengesToCatch: "shiny",
          challengesCoinReward: 2500000,
        },
        {
          challengesOwner: userId,
          challengesName: "Catch 1 Mew",
          challengesDescription:
            "A very special Pokémon has been roaming around, could you try catch this?",
          challengesAmount: 1,
          challengesCaughtAmount: 0,
          challengesCompleted: false,
          challengesToCatch: "Mew",
          challengesTokenReward: 25,
        },
      ],
    });
  }

  AddChannelIncense(
    serverId: string,
    channelId: string,
    enabled: boolean,
    timeout: number
  ): Promise<channelIncense | null> {
    return this.prisma.channelIncense.create({
      data: {
        serverId,
        channelId,
        incenseEnabled: enabled,
        incenseTimeout: timeout,
      },
    });
  }

  RemoveChannelIncense(channelId: string) {
    return this.prisma.channelIncense.delete({
      where: {
        channelId,
      },
    });
  }

  FindChannelIncense(
    channelId: string,
    serverId: string
  ): Promise<channelIncense | null> {
    return this.prisma.channelIncense.findFirst({
      where: {
        channelId,
        serverId,
      },
    });
  }

  FindNextTrainerId(): Promise<userData | null> {
    return this.prisma.userData.findFirst({
      orderBy: [
        {
          trainerNumber: "asc",
        },
      ],
      take: 1,
    });
  }

  FindPokemonTrainer(userId: string): Promise<userData | null> {
    return this.prisma.userData.findFirst({
      where: {
        userId,
      },
      include: {
        userBag: true,
        userCatchBuddy: true,
        voteStreak: true,
        userChallenges: true,
      },
    });
  }

  GetPokemonTrainerDex(pokemonId: string, userId: string) {
    return this.prisma.pokedexEntry.findFirst({
      where: { pokemonId, userId },
    });
  }

  GetPokemonNextPokeId(userId: string): Promise<Pokemons[]> {
    return this.prisma.pokemons.findMany({
      where: {
        pokemonOwner: userId,
        NOT: {
          pokemonPlacementId: null,
        },
      },
      orderBy: [
        {
          pokemonPlacementId: "desc",
        },
      ],
      take: 1,
      skip: 0,
    });
  }

  GetTrainerPokemons(userId: string): Promise<Pokemons[]> {
    return this.prisma.pokemons.findMany({
      where: {
        pokemonOwner: userId,
      },
      include: {
        PokemonIVs: true,
      },
      orderBy: [
        {
          pokemonPlacementId: "asc",
        },
      ],
    });
  }

  GetTrainerTopCoins(): Promise<userData[]> {
    return this.prisma.userData.findMany({
      orderBy: [
        {
          userCoins: "desc",
        },
      ],
      take: 10,
    });
  }

  GetTrainerTopTokens(): Promise<userData[]> {
    return this.prisma.userData.findMany({
      orderBy: [
        {
          userTokens: "desc",
        },
      ],
      take: 10,
    });
  }

  GetTrainerTopBattles(): Promise<userData[]> {
    return this.prisma.userData.findMany({
      orderBy: [
        {
          trainerBattles: "desc",
        },
      ],
      take: 10,
    });
  }

  IncreaseBattlesWon(userId: string): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        trainerBattles: { increment: 1 },
      },
    });
  }

  IncreaseUserRedeems(
    userId: string,
    amount: number
  ): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userBag: {
          update: {
            userRedeems: { increment: amount },
          },
        },
      },
    });
  }

  IncreaseUserIncenses(
    userId: string,
    amount: number
  ): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userBag: {
          update: {
            spawnIncense: { increment: amount },
          },
        },
      },
    });
  }

  IncreaseUserBCandy(userId: string, amount: number): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userBag: {
          update: {
            catchBuddyCandy: { increment: amount },
          },
        },
      },
    });
  }

  SetPokemonTrainerDex(userId: string, pokemonId: string) {
    return this.prisma.pokedexEntry.update({
      where: { pokemonId_userId: { pokemonId, userId } },
      data: { caught: true },
    });
  }

  SetUserRedeems(userId: string, amount: number): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userBag: {
          update: {
            userRedeems: amount,
          },
        },
      },
    });
  }

  SetUserBCandy(userId: string, amount: number): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userBag: {
          update: {
            catchBuddyCandy: amount,
          },
        },
      },
    });
  }

  SetTrainerOrder(
    userId: string,
    orderBy: PokemonOrder
  ): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        pokemonOrder: orderBy,
      },
    });
  }

  SetTrainerIncenses(
    userId: string,
    incenses: number
  ): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userBag: {
          update: {
            spawnIncense: incenses,
          },
        },
      },
    });
  }

  SortTrainerPokemonsLevel(userId: string): Promise<Pokemons[]> {
    return this.prisma.pokemons.findMany({
      where: {
        pokemonOwner: userId,
      },
      include: {
        PokemonIVs: true,
      },
      orderBy: [
        {
          pokemonLevel: "desc",
        },
      ],
    });
  }

  SortTrainerPokemonsFavorite(userId: string): Promise<Pokemons[]> {
    return this.prisma.pokemons.findMany({
      where: {
        pokemonOwner: userId,
      },
      include: {
        PokemonIVs: true,
      },
      orderBy: [
        {
          pokemonFavorite: "desc",
        },
      ],
    });
  }

  SortTrainerPokemonsIV(userId: string): Promise<Pokemons[]> {
    return this.prisma.pokemons.findMany({
      where: {
        pokemonOwner: userId,
      },
      include: {
        PokemonIVs: true,
      },
    });
  }

  DisplayTrainerPokemons(
    userId: string,
    Rarity: PokemonRarity
  ): Promise<Pokemons[]> {
    return this.prisma.pokemons.findMany({
      where: {
        pokemonOwner: userId,
        pokemonRarity: Rarity,
      },
      include: {
        PokemonIVs: true,
      },
    });
  }

  RemoveTrainerData(userId: string) {
    return this.prisma.userData.delete({
      where: {
        userId,
      },
    });
  }

  SetTimeoutStatus(userId: string, status: boolean, date: number) {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userTimeout: status,
        userTimeoutDate: date,
      },
    });
  }

  IncrementTotalTimeouts(userId: string) {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userTotalTimeouts: { increment: 1 },
      },
    });
  }

  SetUserBlacklistedStatus(userId: string, status: boolean) {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userBlacklisted: status,
      },
    });
  }

  /*
   * SERVER GETTERS & SETTERS
   * */

  GetServer(serverId: string): Promise<PokemonServer | null> {
    return this.prisma.pokemonServer.findFirst({
      where: {
        serverId,
      },
    });
  }

  AddServer(serverId: string): Promise<PokemonServer> {
    return this.prisma.pokemonServer.create({
      data: {
        serverId,
        serverBlacklisted: false,
        serverSpawn: 0,
        serverLanguage: "en",
      },
    });
  }

  IncrementServerSpawnChance(
    serverId: string,
    increment: number
  ): Promise<PokemonServer | null> {
    return this.prisma.pokemonServer.update({
      where: {
        serverId,
      },
      data: {
        serverSpawn: { increment },
      },
    });
  }

  SetServerSpawnChance(
    serverId: string,
    number: number
  ): Promise<PokemonServer | null> {
    return this.prisma.pokemonServer.update({
      where: {
        serverId,
      },
      data: {
        serverSpawn: number,
      },
    });
  }

  SetRedirectChannel(
    serverId: string,
    channelId: string | null
  ): Promise<PokemonServer | null> {
    return this.prisma.pokemonServer.update({
      where: {
        serverId,
      },
      data: {
        serverRedirect: channelId,
      },
    });
  }

  SetAnnouncer(
    serverId: string,
    enabled: boolean
  ): Promise<PokemonServer | null> {
    return this.prisma.pokemonServer.update({
      where: {
        serverId,
      },
      data: {
        serverAnnouncer: enabled,
      },
    });
  }

  /*
   * PAYMENT GETTERS & SETTERS
   * */

  CreatePayment(
    invoiceOwner: string,
    invoiceId: string,
    invoiceType: string
  ): Promise<userPayment | null> {
    return this.prisma.userPayment.create({
      data: {
        invoiceOwner,
        invoiceId,
        invoiceType,
      },
    });
  }

  HasPayment(invoiceId: string): Promise<userPayment | null> {
    return this.prisma.userPayment.findFirst({
      where: {
        invoiceId,
      },
    });
  }

  IncreaseCoins(
    userId: string,
    amount: number | TrainerRanks
  ): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userCoins: {
          increment: amount as number,
        },
      },
    });
  }

  IncreaseTokens(
    userId: string,
    amount: number | TrainerRanks
  ): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userTokens: {
          increment: amount as number,
        },
      },
    });
  }

  SetTrainerRank(
    userId: string,
    newRank: number | TrainerRanks
  ): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        trainerRank: newRank as TrainerRanks,
      },
    });
  }

  SetTokens(userId: string, newTokens: number): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userTokens: newTokens,
      },
    });
  }

  AddTokens(userId: string, tokens: number): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userTokens: { increment: tokens },
      },
    });
  }

  DecreaseTokens(userId: string, tokens: number): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userTokens: { decrement: tokens },
      },
    });
  }

  SetCoins(userId: string, newCoins: number): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userCoins: newCoins,
      },
    });
  }

  AddCoins(userId: string, coins: number): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userCoins: { increment: coins },
      },
    });
  }

  DecreaseCoins(userId: string, coins: number): Promise<userData | null> {
    return this.prisma.userData.update({
      where: {
        userId,
      },
      data: {
        userCoins: { decrement: coins },
      },
    });
  }

  FindChallenge(
    userId: string,
    challengeId: number
  ): Promise<userChallenges | null> {
    return this.prisma.userChallenges.findFirst({
      where: {
        challengesOwner: userId,
        challengesId: challengeId,
      },
    });
  }

  IncrementChallengeCaught(
    challengesId: number
  ): Promise<userChallenges | null> {
    return this.prisma.userChallenges.update({
      where: {
        challengesId,
      },
      data: {
        challengesCaughtAmount: { increment: 1 },
      },
    });
  }

  SetChallengeCompleted(challengesId: number): Promise<userChallenges | null> {
    return this.prisma.userChallenges.update({
      where: {
        challengesId,
      },
      data: {
        challengesCompleted: true,
      },
    });
  }

  /*
   * CODES GETTERS & SETTERS
   * */

  CreateCode(
    code: string,
    rewardType: RewardType,
    rewardAmount: number,
    codeLimitation: number
  ): Promise<globalCodes | null> {
    return this.prisma.globalCodes.create({
      data: {
        code,
        codeLimitation,
        rewardAmount,
        rewardType,
        codeRedeemed: 0,
      },
    });
  }

  FindCode(code: string): Promise<globalCodes | null> {
    return this.prisma.globalCodes.findFirst({
      where: {
        code,
      },
    });
  }

  FindUserCode(userId: string, code: string): Promise<userCodes | null> {
    return this.prisma.userCodes.findFirst({
      where: {
        userId,
        code,
      },
    });
  }

  IncreaseCodeRedeemed(code: string): Promise<globalCodes | null> {
    return this.prisma.globalCodes.update({
      where: {
        code,
      },
      data: {
        codeRedeemed: { increment: 1 },
      },
    });
  }

  RedeemAttempt(userId: string, code: string): Promise<userCodes | null> {
    return this.prisma.userCodes.create({
      data: {
        userId,
        code,
      },
    });
  }

  /*
   * AUCTIONS GETTERS & SETTERS
   * */

  AddPokemonAuction(
    pokemonId: string,
    userId: string,
    endTime: number,
    auctionStart: number,
    auctionId: number,
    currentDate: number
  ) {
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
      },
    });
  }

  SetAuctionBid(
    auctionId: number,
    newBid: number,
    bidAmounts: number,
    bidTime: number,
    leader: string
  ): Promise<PokemonsAuction | null> {
    return this.prisma.pokemonsAuction.update({
      where: {
        auctionId,
      },
      data: {
        auctionCurrent: newBid,
        bidAmounts,
        leaderData: leader,
        leaderBidTime: bidTime,
      },
    });
  }

  FindNextAuctionId(): Promise<PokemonsAuction | null> {
    return this.prisma.pokemonsAuction.findFirst({
      orderBy: [
        {
          auctionId: "asc",
        },
      ],
      take: 1,
    });
  }

  FindAllAuctions(): Promise<PokemonsAuction[]> {
    return this.prisma.pokemonsAuction.findMany({
      include: {
        pokemon: {
          include: {
            PokemonIVs: true,
          },
        },
        leader: true,
      },
      orderBy: [
        {
          auctionId: "asc",
        },
      ],
    });
  }

  FindSpecificAuction(auctionId: number): Promise<PokemonsAuction | null> {
    return this.prisma.pokemonsAuction.findFirst({
      where: {
        auctionId,
      },
      include: {
        pokemon: true,
      },
    });
  }

  RemovePokemonAuction(pokemonId: string) {
    return this.prisma.pokemonsAuction.delete({
      where: {
        pokemonId,
      },
    });
  }

  /*
   * CATCHBUDDY GETTERS & SETTERS
   * */

  GetAllBuddies(): Promise<userCatchBuddy[]> {
    return this.prisma.userCatchBuddy.findMany();
  }

  GetOneBuddy(userId: string): Promise<userCatchBuddy | null> {
    return this.prisma.userCatchBuddy.findFirst({
      where: {
        userId,
      },
    });
  }

  SetCatchAvailableStatus(
    userId: string,
    status: boolean
  ): Promise<userCatchBuddy> {
    return this.prisma.userCatchBuddy.update({
      where: {
        userId,
      },
      data: {
        catchAvailable: status,
      },
    });
  }

  SetCatcherEnabledStatus(userId: string, status: boolean) {
    return this.prisma.userCatchBuddy.update({
      where: {
        userId,
      },
      data: {
        catcherEnabled: status,
      },
    });
  }

  SetCatcherNextTime(
    userId: string,
    nextTime: number
  ): Promise<userCatchBuddy> {
    return this.prisma.userCatchBuddy.update({
      where: {
        userId,
      },
      data: {
        catcherNext: nextTime,
      },
    });
  }

  SetCatcherRefillTime(userId: string, refillTime: number) {
    return this.prisma.userCatchBuddy.update({
      where: {
        userId,
      },
      data: {
        catcherRefill: refillTime,
      },
    });
  }

  SetCatcherLeftTime(userId: string, leftTime: number) {
    return this.prisma.userCatchBuddy.update({
      where: {
        userId,
      },
      data: {
        catcherLeft: leftTime,
      },
    });
  }

  IncremenetCatcherCaught(userId: string): Promise<userCatchBuddy> {
    return this.prisma.userCatchBuddy.update({
      where: {
        userId,
      },
      data: {
        catcherCaught: { increment: 1 },
      },
    });
  }

  IncrementPokemonUpgrade(userId: string): Promise<userCatchBuddy> {
    return this.prisma.userCatchBuddy.update({
      where: {
        userId,
      },
      data: {
        pokemonUpgrade: { increment: 1 },
      },
    });
  }

  IncrementDurationUpgrade(userId: string): Promise<userCatchBuddy> {
    return this.prisma.userCatchBuddy.update({
      where: {
        userId,
      },
      data: {
        pokemonDuration: { increment: 1 },
      },
    });
  }

  IncrementLuckUpgrade(userId: string): Promise<userCatchBuddy> {
    return this.prisma.userCatchBuddy.update({
      where: {
        userId,
      },
      data: {
        pokemonLuckUpgrade: { increment: 1 },
      },
    });
  }

  /*
   * VOTES GETTERS & SETTERS
   * */

  SetNewVote(userId: string, voteTimestamp: number): Promise<VoteStreak> {
    return this.prisma.voteStreak.update({
      where: {
        userId,
      },
      data: {
        latestVote: voteTimestamp,
      },
    });
  }

  SetNewExpireVote(
    userId: string,
    voteExpireTimestamp: number
  ): Promise<VoteStreak> {
    return this.prisma.voteStreak.update({
      where: {
        userId,
      },
      data: {
        latestVoteExpire: voteExpireTimestamp,
      },
    });
  }

  IncrementVoteStreak(userId: string): Promise<VoteStreak> {
    return this.prisma.voteStreak.update({
      where: {
        userId,
      },
      data: {
        voteStreak: { increment: 1 },
      },
    });
  }

  /*
   * LOTTERY GETTERS & SETTERS
   * */

  GetLotteryGlobals(): Promise<lotteryGlobal | null> {
    return this.prisma.lotteryGlobal.findFirst({
      where: {
        lotteryId: 1,
      },
    });
  }

  CountUserTickets(userId: string): Promise<number> {
    return this.prisma.userTickets.count({
      where: {
        ticketsOwner: userId,
      },
    });
  }

  CountAllTickets(): Promise<number> {
    return this.prisma.userTickets.count();
  }

  FindAllTickets(): Promise<userTickets[]> {
    return this.prisma.userTickets.findMany({});
  }

  GetSpecificTicket(randomSkip: number) {
    return this.prisma.userTickets.findFirst({
      skip: randomSkip,
      take: 1,
    });
  }

  FindUserTickets(userId: string) {
    return this.prisma.userTickets.findFirst({
      where: {
        ticketsOwner: userId,
      },
    });
  }

  AddNewTickets(data: any) {
    return this.prisma.userTickets.createMany({ data });
  }

  IncrementLotteryPars() {
    return this.prisma.lotteryGlobal.update({
      where: {
        lotteryId: 1,
      },
      data: {
        currentParticipants: { increment: 1 },
      },
    });
  }

  IncrementTotalEntries(entries: number) {
    return this.prisma.lotteryGlobal.update({
      where: {
        lotteryId: 1,
      },
      data: {
        totalBought: { increment: entries },
      },
    });
  }

  IncrementTotalJackpot(increment: number) {
    return this.prisma.lotteryGlobal.update({
      where: {
        lotteryId: 1,
      },
      data: {
        currentJackpot: { increment: increment },
      },
    });
  }

  SetNewGlobalLotteryData(
    currentJackpot: number,
    currentlyEnding: number,
    totalBought: number,
    currentParticipants: number
  ) {
    return this.prisma.lotteryGlobal.update({
      where: {
        lotteryId: 1,
      },
      data: {
        totalBought,
        currentJackpot,
        currentlyEnding,
        currentParticipants,
      },
    });
  }

  DeleteLotteryTickets() {
    return this.prisma.userTickets.deleteMany({});
  }
}

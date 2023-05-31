/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `Pokemon` (
    `pokemonId` VARCHAR(32) NOT NULL,
    `pokemonPokedex` INTEGER NOT NULL,
    `pokemonName` VARCHAR(32) NOT NULL DEFAULT 'Unknown',
    `pokemonPicture` VARCHAR(120) NOT NULL DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDK5_M9hXf_9mGi98hp7qu3rO4f6LmalxCwjM-ZhS15w&s',
    `pokemonShinyPicture` VARCHAR(120) NOT NULL DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDK5_M9hXf_9mGi98hp7qu3rO4f6LmalxCwjM-ZhS15w&s',
    `pokemonRarity` ENUM('COMMON', 'UNCOMMON', 'RARE', 'LEGEND', 'ULTRABEAST', 'SHINY') NOT NULL DEFAULT 'COMMON',

    UNIQUE INDEX `Pokemon_pokemonId_key`(`pokemonId`),
    UNIQUE INDEX `Pokemon_pokemonPokedex_key`(`pokemonPokedex`),
    PRIMARY KEY (`pokemonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokemons` (
    `pokemonId` VARCHAR(32) NOT NULL,
    `pokemonName` VARCHAR(32) NOT NULL,
    `pokemonPicture` VARCHAR(120) NOT NULL,
    `pokemonOwner` VARCHAR(32) NULL,
    `pokemonPlacementId` INTEGER NULL,
    `pokemonXP` INTEGER NOT NULL,
    `pokemonLevel` INTEGER NOT NULL,
    `pokemonCatch` BOOLEAN NOT NULL DEFAULT true,
    `pokemonSelected` BOOLEAN NOT NULL DEFAULT false,
    `pokemonFavorite` BOOLEAN NOT NULL DEFAULT false,
    `pokemonGender` ENUM('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE',
    `pokemonNature` ENUM('ADAMANT', 'BASHFUL', 'BRAVE', 'BOLD', 'CALM', 'CAREFUL', 'DOCILE', 'GENTLE', 'HARDY', 'HASTY', 'IMPISH', 'JOLLY', 'LAX', 'LONELY', 'MILD', 'MODEST', 'NAIVE', 'NAUGHTY', 'QUIET', 'QUIRKY', 'RASH', 'RELAXED', 'SASSY', 'SERIOUS', 'TIMID') NOT NULL DEFAULT 'ADAMANT',
    `spawnedServer` VARCHAR(32) NULL,
    `spawnedChannel` VARCHAR(32) NULL,
    `spawnedMessage` VARCHAR(32) NULL,

    UNIQUE INDEX `Pokemons_pokemonId_key`(`pokemonId`),
    UNIQUE INDEX `Pokemons_spawnedChannel_key`(`spawnedChannel`),
    UNIQUE INDEX `Pokemons_spawnedMessage_key`(`spawnedMessage`),
    PRIMARY KEY (`pokemonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PokemonType` (
    `typeUniqueId` VARCHAR(32) NOT NULL,
    `pokemonId` VARCHAR(32) NOT NULL,
    `pokemonType` ENUM('NORMAL', 'FIRE', 'WATER', 'GRASS', 'FLYING', 'FIGHTING', 'POISON', 'ELECTRIC', 'GROUND', 'ROCK', 'PSYCHIC', 'ICE', 'BUG', 'GHOST', 'STEEL', 'DRAGON', 'DARK', 'FAIRY') NOT NULL DEFAULT 'NORMAL',

    UNIQUE INDEX `PokemonType_typeUniqueId_key`(`typeUniqueId`),
    PRIMARY KEY (`typeUniqueId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PokemonEvolve` (
    `evolveUniqueId` VARCHAR(32) NOT NULL,
    `pokemonId` VARCHAR(32) NOT NULL,
    `nextEvolveName` VARCHAR(32) NOT NULL,
    `currentEvolveStage` INTEGER NOT NULL,

    UNIQUE INDEX `PokemonEvolve_evolveUniqueId_key`(`evolveUniqueId`),
    UNIQUE INDEX `PokemonEvolve_pokemonId_key`(`pokemonId`),
    PRIMARY KEY (`evolveUniqueId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PokemonsIVs` (
    `pokemonId` VARCHAR(32) NOT NULL,
    `HP` INTEGER NOT NULL,
    `Attack` INTEGER NOT NULL,
    `Defense` INTEGER NOT NULL,
    `SpecialAtk` INTEGER NOT NULL,
    `SpecialDef` INTEGER NOT NULL,
    `Speed` INTEGER NOT NULL,

    UNIQUE INDEX `PokemonsIVs_pokemonId_key`(`pokemonId`),
    PRIMARY KEY (`pokemonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userData` (
    `userId` VARCHAR(32) NOT NULL,
    `userBlacklisted` BOOLEAN NOT NULL DEFAULT false,
    `userTokens` INTEGER NOT NULL DEFAULT 0,
    `userCoins` INTEGER NOT NULL DEFAULT 500,
    `trainerNumber` INTEGER NOT NULL,

    UNIQUE INDEX `userData_userId_key`(`userId`),
    UNIQUE INDEX `userData_trainerNumber_key`(`trainerNumber`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PokemonServer` (
    `serverId` VARCHAR(32) NOT NULL,
    `serverBlacklisted` BOOLEAN NOT NULL DEFAULT false,
    `serverRedirect` VARCHAR(32) NULL,
    `serverSpawn` INTEGER NOT NULL,
    `serverLanguage` VARCHAR(6) NOT NULL,

    UNIQUE INDEX `PokemonServer_serverId_key`(`serverId`),
    PRIMARY KEY (`serverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PokemonType` ADD CONSTRAINT `PokemonType_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemon`(`pokemonId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokemonEvolve` ADD CONSTRAINT `PokemonEvolve_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemon`(`pokemonId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokemonsIVs` ADD CONSTRAINT `PokemonsIVs_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemons`(`pokemonId`) ON DELETE RESTRICT ON UPDATE CASCADE;

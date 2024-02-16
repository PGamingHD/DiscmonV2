/*
  Warnings:

  - You are about to alter the column `serverLanguage` on the `pokemonserver` table. The data in that column could be lost. The data in that column will be cast from `VarChar(6)` to `Enum(EnumId(8))`.
  - You are about to drop the column `orderPokemonBy` on the `userdata` table. All the data in the column will be lost.
  - Added the required column `pokemonTotalIVs` to the `PokemonsIVs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `catchBuddyCandy` to the `userBag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spawnIncense` to the `userBag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainerBattles` to the `userData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pokemonbattle` DROP FOREIGN KEY `PokemonBattle_pokemonId_fkey`;

-- DropForeignKey
ALTER TABLE `pokemonevolve` DROP FOREIGN KEY `PokemonEvolve_pokemonId_fkey`;

-- DropForeignKey
ALTER TABLE `pokemonevs` DROP FOREIGN KEY `PokemonEVs_pokemonId_fkey`;

-- DropForeignKey
ALTER TABLE `pokemontype` DROP FOREIGN KEY `PokemonType_pokemonId_fkey`;

-- DropForeignKey
ALTER TABLE `userbag` DROP FOREIGN KEY `userBag_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userpayment` DROP FOREIGN KEY `userPayment_invoiceOwner_fkey`;

-- AlterTable
ALTER TABLE `pokemons` ADD COLUMN `pokemonAuction` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pokemonRarity` ENUM('COMMON', 'UNCOMMON', 'RARE', 'LEGEND', 'MYTHICAL', 'ULTRABEAST', 'SHINY', 'DEVELOPER') NOT NULL DEFAULT 'COMMON';

-- AlterTable
ALTER TABLE `pokemonserver` ADD COLUMN `serverAnnouncer` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `serverLanguage` ENUM('en') NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE `pokemonsivs` ADD COLUMN `pokemonTotalIVs` FLOAT NOT NULL;

-- AlterTable
ALTER TABLE `userbag` ADD COLUMN `catchBuddyCandy` INTEGER NOT NULL,
    ADD COLUMN `spawnIncense` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `userdata` DROP COLUMN `orderPokemonBy`,
    ADD COLUMN `pokemonOrder` ENUM('ID', 'IV', 'LEVEL', 'FAVORITE') NOT NULL DEFAULT 'ID',
    ADD COLUMN `trainerBattles` INTEGER NOT NULL,
    ADD COLUMN `userTimeout` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `userTimeoutDate` BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN `userTotalTimeouts` INTEGER NOT NULL DEFAULT 0,
    MODIFY `trainerNumber` INTEGER NOT NULL AUTO_INCREMENT;

-- CreateTable
CREATE TABLE `PokemonsEVs` (
    `pokemonId` VARCHAR(32) NOT NULL,
    `HP` INTEGER NOT NULL,
    `Attack` INTEGER NOT NULL,
    `Defense` INTEGER NOT NULL,
    `SpecialAtk` INTEGER NOT NULL,
    `SpecialDef` INTEGER NOT NULL,
    `Speed` INTEGER NOT NULL,

    UNIQUE INDEX `PokemonsEVs_pokemonId_key`(`pokemonId`),
    PRIMARY KEY (`pokemonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PokedexEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pokemonId` VARCHAR(32) NOT NULL,
    `discovered` BOOLEAN NOT NULL DEFAULT false,
    `caught` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(32) NOT NULL,

    UNIQUE INDEX `PokedexEntry_pokemonId_userId_key`(`pokemonId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userCodes` (
    `userId` VARCHAR(32) NOT NULL,
    `code` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `userCodes_userId_key`(`userId`),
    UNIQUE INDEX `userCodes_code_key`(`code`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `globalCodes` (
    `code` VARCHAR(60) NOT NULL,
    `codeLimitation` INTEGER NOT NULL,
    `codeRedeemed` INTEGER NOT NULL,
    `rewardType` ENUM('POKEMON', 'COINS', 'TOKENS') NOT NULL DEFAULT 'COINS',
    `rewardAmount` INTEGER NOT NULL,

    UNIQUE INDEX `globalCodes_code_key`(`code`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `channelIncense` (
    `serverId` VARCHAR(32) NOT NULL,
    `channelId` VARCHAR(32) NOT NULL,
    `incenseEnabled` BOOLEAN NOT NULL,
    `incenseTimeout` BIGINT NOT NULL,

    UNIQUE INDEX `channelIncense_channelId_key`(`channelId`),
    PRIMARY KEY (`channelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PokemonsAuction` (
    `pokemonId` VARCHAR(32) NOT NULL,
    `auctionId` INTEGER NOT NULL,
    `auctionStart` INTEGER NOT NULL,
    `auctionCurrent` INTEGER NOT NULL,
    `endTime` BIGINT NOT NULL,
    `bidAmounts` INTEGER NOT NULL,
    `leaderBidTime` BIGINT NOT NULL,
    `leaderData` VARCHAR(32) NULL,

    UNIQUE INDEX `PokemonsAuction_pokemonId_key`(`pokemonId`),
    UNIQUE INDEX `PokemonsAuction_auctionId_key`(`auctionId`),
    PRIMARY KEY (`pokemonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userCatchBuddy` (
    `userId` VARCHAR(32) NOT NULL,
    `catcherEnabled` BOOLEAN NOT NULL DEFAULT false,
    `catcherRefill` BIGINT NOT NULL,
    `catcherLeft` BIGINT NOT NULL,
    `catcherNext` BIGINT NOT NULL,
    `catchAvailable` BOOLEAN NOT NULL DEFAULT false,
    `catcherCaught` BIGINT NOT NULL DEFAULT 0,
    `pokemonDuration` INTEGER NOT NULL,
    `pokemonUpgrade` INTEGER NOT NULL,
    `pokemonLuckUpgrade` INTEGER NOT NULL,

    UNIQUE INDEX `userCatchBuddy_userId_key`(`userId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoteStreak` (
    `userId` VARCHAR(32) NOT NULL,
    `latestVote` BIGINT NOT NULL DEFAULT 0,
    `latestVoteExpire` BIGINT NOT NULL DEFAULT 0,
    `voteStreak` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `VoteStreak_userId_key`(`userId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userChallenges` (
    `challengesId` INTEGER NOT NULL AUTO_INCREMENT,
    `challengesOwner` VARCHAR(32) NOT NULL,
    `challengesName` VARCHAR(64) NOT NULL,
    `challengesDescription` VARCHAR(256) NOT NULL,
    `challengesAmount` INTEGER NOT NULL,
    `challengesToCatch` VARCHAR(32) NOT NULL,
    `challengesCaughtAmount` INTEGER NOT NULL DEFAULT 0,
    `challengesCompleted` BOOLEAN NOT NULL DEFAULT false,
    `challengesCoinReward` INTEGER NULL,
    `challengesTokenReward` INTEGER NULL,
    `challengesPokemonReward` VARCHAR(32) NULL,
    `challengesPokemonRewardShiny` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `userChallenges_challengesId_key`(`challengesId`),
    PRIMARY KEY (`challengesId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lotteryGlobal` (
    `lotteryId` INTEGER NOT NULL DEFAULT 0,
    `currentJackpot` BIGINT NOT NULL,
    `currentParticipants` INTEGER NOT NULL,
    `currentlyEnding` BIGINT NOT NULL,
    `totalBought` BIGINT NOT NULL,

    PRIMARY KEY (`lotteryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userTickets` (
    `ticketId` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketsOwner` VARCHAR(32) NOT NULL,

    UNIQUE INDEX `userTickets_ticketId_key`(`ticketId`),
    PRIMARY KEY (`ticketId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PokemonType` ADD CONSTRAINT `PokemonType_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemon`(`pokemonId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokemonEvolve` ADD CONSTRAINT `PokemonEvolve_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemon`(`pokemonId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokemonsEVs` ADD CONSTRAINT `PokemonsEVs_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemons`(`pokemonId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokemonEVs` ADD CONSTRAINT `PokemonEVs_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemon`(`pokemonId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokemonBattle` ADD CONSTRAINT `PokemonBattle_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemons`(`pokemonId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokedexEntry` ADD CONSTRAINT `PokedexEntry_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemon`(`pokemonId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokedexEntry` ADD CONSTRAINT `PokedexEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `userData`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userBag` ADD CONSTRAINT `userBag_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `userData`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userPayment` ADD CONSTRAINT `userPayment_invoiceOwner_fkey` FOREIGN KEY (`invoiceOwner`) REFERENCES `userData`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userCodes` ADD CONSTRAINT `userCodes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `userData`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokemonsAuction` ADD CONSTRAINT `PokemonsAuction_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemons`(`pokemonId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokemonsAuction` ADD CONSTRAINT `PokemonsAuction_leaderData_fkey` FOREIGN KEY (`leaderData`) REFERENCES `userData`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userCatchBuddy` ADD CONSTRAINT `userCatchBuddy_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `userData`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteStreak` ADD CONSTRAINT `VoteStreak_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `userData`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userChallenges` ADD CONSTRAINT `userChallenges_challengesOwner_fkey` FOREIGN KEY (`challengesOwner`) REFERENCES `userData`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userTickets` ADD CONSTRAINT `userTickets_ticketsOwner_fkey` FOREIGN KEY (`ticketsOwner`) REFERENCES `userData`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

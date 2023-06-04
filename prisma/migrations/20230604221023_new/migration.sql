/*
  Warnings:

  - You are about to drop the column `TotalIV` on the `pokemonsivs` table. All the data in the column will be lost.
  - Added the required column `nextEvolveLevel` to the `PokemonEvolve` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pokemonsivs` DROP FOREIGN KEY `PokemonsIVs_pokemonId_fkey`;

-- DropIndex
DROP INDEX `Pokemons_spawnedChannel_key` ON `pokemons`;

-- AlterTable
ALTER TABLE `pokemon` ADD COLUMN `pokemonAlolanPicture` VARCHAR(120) NULL,
    MODIFY `pokemonShinyPicture` VARCHAR(120) NULL,
    MODIFY `pokemonRarity` ENUM('COMMON', 'UNCOMMON', 'RARE', 'LEGEND', 'MYTHICAL', 'ULTRABEAST', 'SHINY', 'DEVELOPER') NOT NULL DEFAULT 'COMMON';

-- AlterTable
ALTER TABLE `pokemonevolve` ADD COLUMN `nextEvolveLevel` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pokemonsivs` DROP COLUMN `TotalIV`;

-- AlterTable
ALTER TABLE `userdata` ADD COLUMN `orderPokemonBy` ENUM('IV', 'LEVEL', 'FAVORITE') NULL,
    ADD COLUMN `trainerRank` ENUM('NORMAL_TRAINER', 'BRONZE_TRAINER', 'SILVER_TRAINER', 'GOLD_TRAINER', 'PLATINUM_TRAINER', 'MODERATOR', 'ADMINISTRATOR', 'DEVELOPER') NOT NULL DEFAULT 'NORMAL_TRAINER';

-- CreateTable
CREATE TABLE `PokemonEVs` (
    `pokemonId` VARCHAR(32) NOT NULL,
    `HP` INTEGER NOT NULL,
    `Attack` INTEGER NOT NULL,
    `Defense` INTEGER NOT NULL,
    `SpecialAtk` INTEGER NOT NULL,
    `SpecialDef` INTEGER NOT NULL,
    `Speed` INTEGER NOT NULL,

    UNIQUE INDEX `PokemonEVs_pokemonId_key`(`pokemonId`),
    PRIMARY KEY (`pokemonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PokemonBattle` (
    `pokemonId` VARCHAR(32) NOT NULL,
    `opponentTrainer` VARCHAR(32) NOT NULL,
    `opponentHP` INTEGER NOT NULL,
    `mainTrainer` VARCHAR(32) NOT NULL,
    `mainHP` INTEGER NOT NULL,

    UNIQUE INDEX `PokemonBattle_pokemonId_key`(`pokemonId`),
    PRIMARY KEY (`pokemonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userBag` (
    `userId` VARCHAR(32) NOT NULL,
    `userRedeems` INTEGER NOT NULL,

    UNIQUE INDEX `userBag_userId_key`(`userId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userPayment` (
    `invoiceId` VARCHAR(120) NOT NULL,
    `invoiceOwner` VARCHAR(32) NOT NULL,
    `invoiceType` VARCHAR(32) NOT NULL,

    UNIQUE INDEX `userPayment_invoiceId_key`(`invoiceId`),
    PRIMARY KEY (`invoiceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PokemonEVs` ADD CONSTRAINT `PokemonEVs_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemon`(`pokemonId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokemonsIVs` ADD CONSTRAINT `PokemonsIVs_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemons`(`pokemonId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokemonBattle` ADD CONSTRAINT `PokemonBattle_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemons`(`pokemonId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userBag` ADD CONSTRAINT `userBag_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `userData`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userPayment` ADD CONSTRAINT `userPayment_invoiceOwner_fkey` FOREIGN KEY (`invoiceOwner`) REFERENCES `userData`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

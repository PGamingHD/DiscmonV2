-- DropForeignKey
ALTER TABLE `pokedexentry` DROP FOREIGN KEY `PokedexEntry_pokemonId_fkey`;

-- DropForeignKey
ALTER TABLE `pokedexentry` DROP FOREIGN KEY `PokedexEntry_userId_fkey`;

-- AddForeignKey
ALTER TABLE `PokedexEntry` ADD CONSTRAINT `PokedexEntry_pokemonId_fkey` FOREIGN KEY (`pokemonId`) REFERENCES `Pokemon`(`pokemonId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PokedexEntry` ADD CONSTRAINT `PokedexEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `userData`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

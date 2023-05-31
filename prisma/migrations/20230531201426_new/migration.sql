/*
  Warnings:

  - Added the required column `TotalIV` to the `PokemonsIVs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pokemonsivs` ADD COLUMN `TotalIV` INTEGER NOT NULL;

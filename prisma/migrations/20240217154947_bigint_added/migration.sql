-- AlterTable
ALTER TABLE `userdata` MODIFY `userTokens` BIGINT NOT NULL DEFAULT 0,
    MODIFY `userCoins` BIGINT NOT NULL DEFAULT 500;

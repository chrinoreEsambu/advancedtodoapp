/*
  Warnings:

  - You are about to drop the column `message` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `message`,
    ADD COLUMN `commentaire` VARCHAR(191) NULL;

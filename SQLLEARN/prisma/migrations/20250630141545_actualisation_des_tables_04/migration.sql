/*
  Warnings:

  - Made the column `assigneeId` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `creatorId` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_assigneeId_fkey`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_creatorId_fkey`;

-- DropIndex
DROP INDEX `Tasks_assigneeId_fkey` ON `tasks`;

-- DropIndex
DROP INDEX `Tasks_creatorId_fkey` ON `tasks`;

-- AlterTable
ALTER TABLE `tasks` MODIFY `assigneeId` VARCHAR(191) NOT NULL,
    MODIFY `creatorId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

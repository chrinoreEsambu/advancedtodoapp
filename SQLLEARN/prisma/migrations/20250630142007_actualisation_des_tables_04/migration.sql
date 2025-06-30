-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_creatorId_fkey`;

-- DropIndex
DROP INDEX `Tasks_creatorId_fkey` ON `tasks`;

-- AlterTable
ALTER TABLE `tasks` MODIFY `creatorId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `Users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

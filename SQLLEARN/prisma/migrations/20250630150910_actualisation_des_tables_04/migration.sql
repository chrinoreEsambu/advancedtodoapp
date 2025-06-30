-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_assigneeId_fkey`;

-- DropIndex
DROP INDEX `Tasks_assigneeId_fkey` ON `tasks`;

-- AlterTable
ALTER TABLE `tasks` MODIFY `assigneeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `Users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

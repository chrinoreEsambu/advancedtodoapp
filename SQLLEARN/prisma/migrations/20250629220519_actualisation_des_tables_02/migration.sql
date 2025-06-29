-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_assignToId_fkey`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_fromAdminId_fkey`;

-- DropIndex
DROP INDEX `Tasks_assignToId_fkey` ON `tasks`;

-- DropIndex
DROP INDEX `Tasks_fromAdminId_fkey` ON `tasks`;

-- AlterTable
ALTER TABLE `tasks` MODIFY `fromAdminId` VARCHAR(191) NULL,
    MODIFY `assignToId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_fromAdminId_fkey` FOREIGN KEY (`fromAdminId`) REFERENCES `Users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_assignToId_fkey` FOREIGN KEY (`assignToId`) REFERENCES `Users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

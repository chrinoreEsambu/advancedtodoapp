-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `Comments_taskId_fkey`;

-- DropIndex
DROP INDEX `Comments_taskId_fkey` ON `comments`;

-- AlterTable
ALTER TABLE `comments` MODIFY `taskId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Tasks`(`task_id`) ON DELETE SET NULL ON UPDATE CASCADE;

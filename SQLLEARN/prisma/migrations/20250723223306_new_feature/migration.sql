/*
  Warnings:

  - You are about to drop the column `commentaire` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `commentaire`,
    ADD COLUMN `taskState` ENUM('todo', 'inprogress', 'request', 'done') NOT NULL DEFAULT 'todo';

-- CreateTable
CREATE TABLE `Comments` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `replyById` VARCHAR(191) NULL,
    `replyToId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Tasks`(`task_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_replyById_fkey` FOREIGN KEY (`replyById`) REFERENCES `Users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_replyToId_fkey` FOREIGN KEY (`replyToId`) REFERENCES `Comments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

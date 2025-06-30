/*
  Warnings:

  - You are about to drop the column `UpdateAt` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `assignToId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `creatAt` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `fromAdminId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `assigneeId` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Made the column `state` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_assignToId_fkey`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_fromAdminId_fkey`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_user_id_fkey`;

-- DropIndex
DROP INDEX `Tasks_assignToId_fkey` ON `tasks`;

-- DropIndex
DROP INDEX `Tasks_fromAdminId_fkey` ON `tasks`;

-- DropIndex
DROP INDEX `Tasks_user_id_fkey` ON `tasks`;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `UpdateAt`,
    DROP COLUMN `assignToId`,
    DROP COLUMN `creatAt`,
    DROP COLUMN `fromAdminId`,
    DROP COLUMN `user_id`,
    ADD COLUMN `assignedById` VARCHAR(191) NULL,
    ADD COLUMN `assigneeId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `creatorId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `state` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `updateAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_assignedById_fkey` FOREIGN KEY (`assignedById`) REFERENCES `Users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

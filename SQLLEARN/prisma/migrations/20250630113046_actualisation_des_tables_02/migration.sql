/*
  Warnings:

  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `state` VARCHAR(191) NULL DEFAULT 'pending';

-- DropTable
DROP TABLE `session`;

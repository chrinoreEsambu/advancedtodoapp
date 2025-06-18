/*
  Warnings:

  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `task` DROP PRIMARY KEY,
    MODIFY `task_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`task_id`);

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `updateAt` DROP DEFAULT;

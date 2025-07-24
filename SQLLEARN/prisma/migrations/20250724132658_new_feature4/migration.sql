/*
  Warnings:

  - The values [accept] on the enum `Tasks_taskState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `taskState` ENUM('todo', 'inprogress', 'request', 'accepted', 'done') NULL DEFAULT 'todo';

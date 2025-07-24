-- AlterTable
ALTER TABLE `tasks` MODIFY `task` VARCHAR(191) NULL,
    MODIFY `state` VARCHAR(191) NULL DEFAULT 'pending',
    MODIFY `taskState` ENUM('todo', 'inprogress', 'request', 'done') NULL DEFAULT 'todo';

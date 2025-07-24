-- AlterTable
ALTER TABLE `tasks` MODIFY `taskState` ENUM('todo', 'inprogress', 'request', 'denied', 'accepted', 'done') NULL DEFAULT 'todo';

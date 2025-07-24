-- AlterTable
ALTER TABLE `tasks` MODIFY `taskState` ENUM('todo', 'inprogress', 'request', 'accepted', 'done') NULL DEFAULT 'todo';

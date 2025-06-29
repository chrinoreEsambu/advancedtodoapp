-- CreateTable
CREATE TABLE `Users` (
    `user_id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `mail` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'users',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_nom_key`(`nom`),
    UNIQUE INDEX `Users_mail_key`(`mail`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tasks` (
    `task_id` VARCHAR(191) NOT NULL,
    `task` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL DEFAULT 'pendding',
    `user_id` VARCHAR(191) NOT NULL,
    `fromAdminId` VARCHAR(191) NOT NULL,
    `assignToId` VARCHAR(191) NOT NULL,
    `creatAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_fromAdminId_fkey` FOREIGN KEY (`fromAdminId`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_assignToId_fkey` FOREIGN KEY (`assignToId`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `rating` INTEGER NULL DEFAULT 0,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `avatar_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_avatar_id_key`(`avatar_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `type` ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET') NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active_till` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `file_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` ENUM('LIKE', 'DISLIKE') NOT NULL DEFAULT 'LIKE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `post_id` INTEGER NULL,
    `comment_id` INTEGER NULL,

    UNIQUE INDEX `rating_user_id_post_id_key`(`user_id`, `post_id`),
    UNIQUE INDEX `rating_user_id_comment_id_key`(`user_id`, `comment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'PRIVATE') NOT NULL DEFAULT 'PUBLISHED',
    `author_id` INTEGER NULL,
    `rating` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `post_id` INTEGER NOT NULL,
    `rating` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `__post_picture` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `__post_picture_AB_unique`(`A`, `B`),
    INDEX `__post_picture_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `__post_category` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `__post_category_AB_unique`(`A`, `B`),
    INDEX `__post_category_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_avatar_id_fkey` FOREIGN KEY (`avatar_id`) REFERENCES `file`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otp` ADD CONSTRAINT `otp_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `__post_picture` ADD CONSTRAINT `__post_picture_A_fkey` FOREIGN KEY (`A`) REFERENCES `file`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `__post_picture` ADD CONSTRAINT `__post_picture_B_fkey` FOREIGN KEY (`B`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `__post_category` ADD CONSTRAINT `__post_category_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `__post_category` ADD CONSTRAINT `__post_category_B_fkey` FOREIGN KEY (`B`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TRIGGER update_post_rating_after_insert
AFTER INSERT ON rating
FOR EACH ROW
BEGIN
    IF NEW.post_id IS NOT NULL THEN
        UPDATE post
        SET rating = (
            SELECT COUNT(*) FROM rating r
            WHERE r.post_id = NEW.post_id AND r.type = 'LIKE'
            ) - (
            SELECT COUNT(*) FROM rating r
            WHERE r.post_id = NEW.post_id AND r.type = 'DISLIKE'
        )
        WHERE id = NEW.post_id;
    END IF;
END;

CREATE TRIGGER update_post_rating_after_update
AFTER UPDATE ON rating
FOR EACH ROW
BEGIN
    IF NEW.post_id IS NOT NULL THEN
        UPDATE post
        SET rating = (
            SELECT COUNT(*) FROM rating r
            WHERE r.post_id = NEW.post_id AND r.type = 'LIKE'
            ) - (
            SELECT COUNT(*) FROM rating r
            WHERE r.post_id = NEW.post_id AND r.type = 'DISLIKE'
        )
        WHERE id = NEW.post_id;
    END IF;
END;

CREATE TRIGGER update_post_rating_after_delete
AFTER DELETE ON rating
FOR EACH ROW
BEGIN
    IF OLD.post_id IS NOT NULL THEN
        UPDATE post
        SET rating = (
            SELECT COUNT(*) FROM rating r
            WHERE r.post_id = OLD.post_id AND r.type = 'LIKE'
            ) - (
            SELECT COUNT(*) FROM rating r
            WHERE r.post_id = OLD.post_id AND r.type = 'DISLIKE'
        )
        WHERE id = OLD.post_id;
    END IF;
END;


CREATE TRIGGER update_comment_rating_after_insert
AFTER INSERT ON rating
FOR EACH ROW
BEGIN
    IF NEW.comment_id IS NOT NULL THEN
        UPDATE comment
        SET rating = (
            SELECT COUNT(*) FROM rating r
            WHERE r.comment_id = NEW.comment_id AND r.type = 'LIKE'
            ) - (
            SELECT COUNT(*) FROM rating r
            WHERE r.comment_id = NEW.comment_id AND r.type = 'DISLIKE'
        )
        WHERE id = NEW.comment_id;
    END IF;
END;

CREATE TRIGGER update_comment_rating_after_update
AFTER UPDATE ON rating
FOR EACH ROW
BEGIN
    IF NEW.comment_id IS NOT NULL THEN
        UPDATE comment
        SET rating = (
            SELECT COUNT(*) FROM rating r
            WHERE r.comment_id = NEW.comment_id AND r.type = 'LIKE'
            ) - (
            SELECT COUNT(*) FROM rating r
            WHERE r.comment_id = NEW.comment_id AND r.type = 'DISLIKE'
        )
        WHERE id = NEW.comment_id;
    END IF;
END;

CREATE TRIGGER update_comment_rating_after_delete
AFTER DELETE ON rating
FOR EACH ROW
BEGIN
    IF OLD.comment_id IS NOT NULL THEN
        UPDATE comment
        SET rating = (
            SELECT COUNT(*) FROM rating r
            WHERE r.comment_id = OLD.comment_id AND r.type = 'LIKE'
            ) - (
            SELECT COUNT(*) FROM rating r
            WHERE r.comment_id = OLD.comment_id AND r.type = 'DISLIKE'
        )
        WHERE id = OLD.comment_id;
    END IF;
END;

CREATE TRIGGER update_user_rating_after_insert_post
AFTER INSERT ON post
FOR EACH ROW
BEGIN
    UPDATE user
    SET rating = (
        SELECT COALESCE(SUM(p.rating), 0) FROM post p
        WHERE p.author_id = NEW.author_id
        ) + (
        SELECT COALESCE(SUM(c.rating), 0) FROM comment c
        WHERE c.user_id = NEW.author_id
    )
    WHERE id = NEW.author_id;
END;

CREATE TRIGGER update_user_rating_after_update_post
AFTER UPDATE ON post
FOR EACH ROW
BEGIN
    UPDATE user
    SET rating = (
        SELECT COALESCE(SUM(p.rating), 0) FROM post p
        WHERE p.author_id = NEW.author_id
        ) + (
        SELECT COALESCE(SUM(c.rating), 0) FROM comment c
        WHERE c.user_id = NEW.author_id
    )
    WHERE id = NEW.author_id;
END;

CREATE TRIGGER update_user_rating_after_delete_post
AFTER DELETE ON post
FOR EACH ROW
BEGIN
    UPDATE user
    SET rating = (
        SELECT COALESCE(SUM(p.rating), 0) FROM post p
        WHERE p.author_id = OLD.author_id
        ) + (
        SELECT COALESCE(SUM(c.rating), 0) FROM comment c
        WHERE c.user_id = OLD.author_id
    )
    WHERE id = OLD.author_id;
END;

CREATE TRIGGER update_user_rating_after_insert_comment
AFTER INSERT ON comment
FOR EACH ROW
BEGIN
    UPDATE user
    SET rating = (
        SELECT COALESCE(SUM(p.rating), 0) FROM post p
        WHERE p.author_id = NEW.user_id
        ) + (
        SELECT COALESCE(SUM(c.rating), 0) FROM comment c
        WHERE c.user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
END;

CREATE TRIGGER update_user_rating_after_update_comment
AFTER UPDATE ON comment
FOR EACH ROW
BEGIN
    UPDATE user
    SET rating = (
        SELECT COALESCE(SUM(p.rating), 0) FROM post p
        WHERE p.author_id = NEW.user_id
        ) + (
        SELECT COALESCE(SUM(c.rating), 0) FROM comment c
        WHERE c.user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
END;

CREATE TRIGGER update_user_rating_after_delete_comment
AFTER DELETE ON comment
FOR EACH ROW
BEGIN
    UPDATE user
    SET rating = (
        SELECT COALESCE(SUM(p.rating), 0) FROM post p
        WHERE p.author_id = OLD.user_id
        ) + (
        SELECT COALESCE(SUM(c.rating), 0) FROM comment c
        WHERE c.user_id = OLD.user_id
    )
    WHERE id = OLD.user_id;
END;

/*
  Warnings:

  - You are about to alter the column `accountVerificationExpire` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `accountVerificationExpire` DATETIME(3) NULL;

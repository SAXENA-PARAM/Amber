/*
  Warnings:

  - You are about to drop the column `approved` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `downvotes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `repliesCount` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `linkdinprofile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGitHubLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserGitHubLink" DROP CONSTRAINT "UserGitHubLink_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "approved",
DROP COLUMN "downvotes",
DROP COLUMN "repliesCount",
DROP COLUMN "upvotes";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "linkdinprofile";

-- DropTable
DROP TABLE "Certificate";

-- DropTable
DROP TABLE "UserGitHubLink";

-- DropTable
DROP TABLE "Vote";

-- DropEnum
DROP TYPE "VoteType";

/*
  Warnings:

  - You are about to drop the column `linkdinProfile` on the `Instructor` table. All the data in the column will be lost.
  - You are about to drop the `InsGitHubLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InsGitHubLink" DROP CONSTRAINT "InsGitHubLink_instructorId_fkey";

-- AlterTable
ALTER TABLE "Instructor" DROP COLUMN "linkdinProfile";

-- DropTable
DROP TABLE "InsGitHubLink";

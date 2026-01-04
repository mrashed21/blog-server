/*
  Warnings:

  - The `views` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "thumbnail" DROP NOT NULL,
DROP COLUMN "views",
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

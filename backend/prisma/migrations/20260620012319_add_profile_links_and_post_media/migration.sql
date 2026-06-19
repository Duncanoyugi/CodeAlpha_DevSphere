-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "githubRepoUrl" TEXT,
ADD COLUMN     "liveDemoUrl" TEXT,
ADD COLUMN     "mediaSize" INTEGER,
ADD COLUMN     "mediaType" TEXT,
ADD COLUMN     "mediaUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "linkedInUrl" TEXT,
ADD COLUMN     "portfolioUrl" TEXT;

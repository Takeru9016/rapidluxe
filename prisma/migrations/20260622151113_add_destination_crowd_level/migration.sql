-- CreateEnum
CREATE TYPE "DestinationCrowdLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'VERY_HIGH');

-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "crowdLevel" "DestinationCrowdLevel";

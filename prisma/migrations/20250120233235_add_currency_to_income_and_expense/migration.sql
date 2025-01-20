-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BRL', 'USD', 'EUR');

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'BRL';

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'BRL';

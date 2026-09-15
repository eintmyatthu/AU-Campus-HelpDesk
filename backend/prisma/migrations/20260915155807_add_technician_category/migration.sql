-- AlterTable
ALTER TABLE "User" ADD COLUMN     "technicianCategory" "Category";

-- CreateIndex
CREATE INDEX "User_role_technicianCategory_idx" ON "User"("role", "technicianCategory");

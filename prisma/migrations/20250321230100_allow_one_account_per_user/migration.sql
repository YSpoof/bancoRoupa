/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_clientId_key" ON "Account"("clientId");

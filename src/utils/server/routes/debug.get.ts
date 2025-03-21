import { Request, Response } from 'express';
import { prisma } from '../customClients';

export async function debugRoute(_req: Request, res: Response): Promise<void> {
  const allUsers = await prisma.client.findMany();
  const allAccounts = await prisma.account.findMany();

  res.json({ users: allUsers, accounts: allAccounts });
}

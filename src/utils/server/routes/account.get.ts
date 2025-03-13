import { Request, Response } from 'express';
import { prisma } from '../customClients';

export async function accountRoute(req: Request, res: Response): Promise<void> {
  const accounts = await prisma.account.findMany({
    where: {
      clientId: req.client!.id,
    },
  });

  res.json(accounts);
}

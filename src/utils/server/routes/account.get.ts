import { Request, Response } from 'express';
import { prisma } from '../customClients';

export async function accountRoute(req: Request, res: Response): Promise<void> {
  const account = await prisma.account.findFirst({
    where: {
      clientId: req.client!.id,
    },
  });

  res.json(account);
}

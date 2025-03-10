import { Request, Response } from 'express';
import { prisma } from '../customClients';

export async function validateRoute(
  req: Request,
  res: Response
): Promise<void> {
  const accounts = await prisma.account.findMany({
    where: {
      clientId: req.client!.id,
    },
  });

  res.json({
    name: req.client!.name,
    accounts,
  });
}

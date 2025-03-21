import { Request, Response } from 'express';
import { prisma } from '../customClients';
import { messages } from '../messages';

export async function deleteRoute(req: Request, res: Response): Promise<void> {
  try {
    await prisma.account.delete({ where: { clientId: req.client?.id } });
    await prisma.client.delete({ where: { id: req.client?.id } });

    res.json({ message: messages.accountDeleted });
  } catch (error) {
    res.status(500).json({ message: messages.serverError });
  }
}

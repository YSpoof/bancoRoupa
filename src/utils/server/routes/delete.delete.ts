import { Request, Response } from 'express';
import { prisma } from '../customClients';
import { messages } from '../messages';

export async function deleteRoute(req: Request, res: Response): Promise<void> {
  const userId = req.params['id'];
  const accountId = req.params['accountId'];

  if (!userId || !accountId) {
    res.status(400).json({ message: messages.invalidParams });
    return;
  }

  try {
    await prisma.account.delete({ where: { id: accountId } });
    await prisma.client.delete({ where: { id: userId } });

    res.json({ message: messages.accountDeleted });
  } catch (error) {
    res.status(500).json({ message: messages.serverError });
  }
}

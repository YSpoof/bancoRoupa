import { Request, Response } from 'express';
import { prisma } from '../customClients';
import { messages } from '../messages';

export async function logoutRoute(req: Request, res: Response): Promise<void> {
  try {
    const clientId = req.client?.id;

    if (!clientId) {
      res.status(403).json({ message: messages.unauthorized });
      return;
    }

    await prisma.client.update({
      where: {
        id: clientId,
      },
      data: {
        refreshToken: null,
      },
    });

    res.status(200).json({ message: messages.loggedOut });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: messages.serverError });
  }
}

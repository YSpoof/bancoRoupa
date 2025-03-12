import { Request, Response } from 'express';
import { prisma } from '../customClients';
import { generateToken, validateRefreshToken } from '../jwt';
import { messages } from '../messages';

export async function refreshRoute(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body as { refreshToken: string };

    if (!refreshToken) {
      res.status(401).json({ message: messages.unauthorized });
      return;
    }

    const userWithTokenOnDb = await prisma.client.findFirst({
      where: {
        refreshToken,
      },
    });

    if (!userWithTokenOnDb) {
      res.status(403).json({ message: messages.invalidToken });
      return;
    }

    const payload = validateRefreshToken(refreshToken);

    if (!payload) {
      res.status(403).json({ message: messages.invalidToken });
      return;
    }

    const newToken = generateToken(userWithTokenOnDb);
    res.json({ token: newToken });
  } catch (error) {
    console.error('Error in refresh token route:', error);
    res
      .status(500)
      .json({ message: messages.serverError || 'Internal server error' });
  }
}

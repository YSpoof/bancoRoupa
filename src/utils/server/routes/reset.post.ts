import { Request, Response } from 'express';
import { bcrypt, prisma } from '../customClients';
import { generateRefreshToken, generateToken } from '../jwt';
import { messages } from '../messages';

export async function resetRoute(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (email) {
      const client = await prisma.client.findUnique({
        where: { email },
      });

      if (!client) {
        res.status(404).json({ message: messages.userNotFound });
        return;
      }

      const newClient = await prisma.client.update({
        where: { id: client.id },
        data: { password: await bcrypt.hash(password, 10) },
      });

      const token = generateToken(newClient);
      const refreshToken = generateRefreshToken(newClient);

      await prisma.client.update({
        where: { id: client.id },
        data: { refreshToken },
      });
      res.status(200).json({
        id: client.id,
        name: client.name,
        email: client.email,
        token,
        refreshToken,
      });
      return;
    }
  } catch (error) {
    console.error('Reset error:', error);
    res
      .status(500)
      .json({ message: messages.serverError || 'Internal server error' });
  }
}

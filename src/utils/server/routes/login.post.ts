import { Request, Response } from 'express';
import { bcrypt, prisma } from '../customClients';
import { generateRefreshToken, generateToken } from '../jwt';
import { messages } from '../messages';

export async function loginRoute(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({ message: messages.missingFields });
      return;
    }

    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      res.status(404).json({ message: messages.userNotFound });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, client.password);

    if (!isValidPassword) {
      res.status(403).json({ message: messages.invalidPassword });
      return;
    }

    const token = generateToken(client);
    const refreshToken = generateRefreshToken(client);

    await prisma.client.update({
      where: { id: client.id },
      data: { refreshToken },
    });

    res.status(200).json({ token, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res
      .status(500)
      .json({ message: messages.serverError || 'Internal server error' });
  }
}

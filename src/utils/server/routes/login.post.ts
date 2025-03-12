import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { bcrypt, prisma } from '../customClients';
import { generateRefreshToken, generateToken } from '../jwt';
import { messages } from '../messages';

export async function loginRoute(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    // Traditional email/password login
    if (email && password) {
      const client = await prisma.client.findUnique({
        where: { email },
      });

      if (!client) {
        res.status(404).json({ message: messages.userNotFound });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, client.password);

      if (!isValidPassword) {
        res.status(403).json({ message: messages.invalidCredentials });
        return;
      }

      const token = generateToken(client);
      const refreshToken = generateRefreshToken(client);

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

    // Token-based login if no email/password
    const token = req.headers.authorization?.split(' ')[1];
    console.warn('Req headers -> ', req.headers);

    if (!token) {
      res.status(400).json({ message: messages.invalidToken });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as {
        id: string;
        email: string;
        name: string;
      };

      const client = await prisma.client.findUnique({
        where: { id: decoded.id },
      });

      if (!client) {
        res.status(404).json({ message: messages.userNotFound });
        return;
      }

      // Generate fresh tokens
      const newToken = generateToken(client);
      const refreshToken = generateRefreshToken(client);

      await prisma.client.update({
        where: { id: client.id },
        data: { refreshToken },
      });

      res.status(200).json({
        id: client.id,
        name: client.name,
        email: client.email,
        token: newToken,
        refreshToken,
      });
    } catch (jwtError) {
      res.status(401).json({ message: messages.tokenExpired });
      return;
    }
  } catch (error) {
    console.error('Login error:', error);
    res
      .status(500)
      .json({ message: messages.serverError || 'Internal server error' });
  }
}

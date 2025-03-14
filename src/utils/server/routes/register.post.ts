import { Request, Response } from 'express';
import { bcrypt, prisma } from '../customClients';
import { generateRefreshToken, generateToken } from '../jwt';
import { messages } from '../messages';

export async function registerRoute(
  req: Request,
  res: Response
): Promise<void> {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ message: messages.missingFields });
    return;
  }

  const existingUser = await prisma.client.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    res.status(409).json({ message: messages.userAlreadyExists });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.client.create({
    data: {
      name,
      email,
      password: hashedPassword,
      Account: {
        create: {
          pixi: email,
          balance: 0,
        },
      },
    },
  });

  const token = generateToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  // store refresh token for user in prisma db
  await prisma.client.update({
    where: {
      id: newUser.id,
    },
    data: {
      refreshToken,
    },
  });

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    token,
    refreshToken,
  });
}

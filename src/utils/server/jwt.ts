import type { Client } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { messages } from './messages';

declare global {
  namespace Express {
    interface Request {
      client?: Client;
    }
  }
}

// Function to generate a JWT token
export const generateToken = (client: Client) => {
  const payload = {
    id: client.id,
    name: client.name,
    email: client.email,
  };

  return jwt.sign(payload, process.env['JWT_SECRET']!, {
    expiresIn: '5s',
  });
};

export const generateRefreshToken = (client: Client) => {
  const payload = {
    id: client.id,
    name: client.name,
    email: client.email,
  };

  return jwt.sign(payload, process.env['JWT_REFRESH_SECRET']!);
};

// Function to get the data from a JWT token
export const validateJwtToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: messages.unauthorized });
    return;
  }

  jwt.verify(token, process.env['JWT_SECRET']!, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: messages.invalidToken });
    }

    req.client = decoded as Client;
    next();
    return;
  });
};

export const validateRefreshToken = (token: string): boolean => {
  let isValid = false;

  jwt.verify(token, process.env['JWT_REFRESH_SECRET']!, (err, _decoded) => {
    if (err) {
      isValid = false;
      return;
    }

    isValid = true;
  });

  return isValid;
};

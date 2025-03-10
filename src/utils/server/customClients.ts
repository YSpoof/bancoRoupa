import type { PrismaClient as Prisma } from '@prisma/client';
import type * as BcryptType from 'bcrypt';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
const prisma: Prisma = new PrismaClient();

const bcrypt: typeof BcryptType = require('bcrypt');

export { bcrypt, prisma };

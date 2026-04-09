import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    throw error;
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

export default prisma;

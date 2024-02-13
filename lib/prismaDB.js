import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCliente(userId) {
  const cliente = await prisma.users.findUnique({
    where: { userId: userId },
  });
  return cliente;
}

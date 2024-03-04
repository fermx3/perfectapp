import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserInfo(userId) {
  const userInfo = await prisma.users.findUnique({
    where: {
      userId: userId,
    },
    select: {
      userInfo: true,
    },
  });
  return userInfo.userInfo;
}

export async function getClientes() {
  const clientes = await prisma.clientes.findMany();

  return clientes;
}

export async function getCliente(clientId) {
  const cliente = await prisma.clientes.findUnique({
    where: {
      userId: clientId,
    },
  });

  return cliente;
}

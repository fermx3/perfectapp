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
  const rawClientes = await prisma.users.findMany({
    where: {
      role: {
        equals: 'LEAL',
      },
    },
    select: {
      userId: true,
      userInfo: true,
    },
  });

  const clientes = rawClientes.map((cliente) => ({
    userId: cliente.userId,
    ...cliente.userInfo,
  }));

  return clientes;
}

export async function getCliente(clientId) {
  const rawCliente = await prisma.users.findUnique({
    where: {
      userId: clientId,
    },
  });

  const cliente = {
    userId: rawCliente.userId,
    ...rawCliente.userInfo,
  };

  return cliente;
}

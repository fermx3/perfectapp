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

export async function getLeales() {
  const rawLeales = await prisma.users.findMany({
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

  const clientes = rawLeales.map((cliente) => ({
    userId: cliente.userId,
    ...cliente.userInfo,
  }));

  return clientes;
}

export async function getLeal(clientId) {
  const rawLeal = await prisma.users.findUnique({
    where: {
      userId: clientId,
    },
  });

  const leal = {
    userId: rawLeal.userId,
    ...rawLeal.userInfo,
  };

  return leal;
}

export async function getAsesores() {
  const rawAsesores = await prisma.users.findMany({
    where: {
      role: {
        equals: 'ASESOR',
      },
    },
    select: {
      userId: true,
      userInfo: true,
    },
  });

  const asesores = rawAsesores.map((asesor) => ({
    userId: asesor.userId,
    ...asesor.userInfo,
  }));

  return asesores;
}

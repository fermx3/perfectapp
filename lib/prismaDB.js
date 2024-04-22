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
    cuotaPallets: rawLeal.cuotaPallets,
    datosLeal: rawLeal.datosLeal,
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

export async function getUser(userId) {
  const user = await prisma.users.findUnique({
    where: {
      userId: userId,
    },
  });

  return user;
}

export async function changePassword(userId, hashedPassword) {
  const updatePass = await prisma.users.update({
    where: {
      userId: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
  return updatePass;
}

export async function firstLogin(userId) {
  const firstLogin = await prisma.users.update({
    where: { userId: userId },
    data: {
      datosLeal: { puntosLeal: 100 },
    },
  });
  return firstLogin;
}

export async function actualizarDatosLeal(userId, data) {
  const datosLeal = await getDatosLeal(userId);

  const result = await prisma.users.update({
    where: { userId: userId },
    data: {
      datosLeal: {
        ...data,
        puntosLeal: datosLeal.puntosLeal,
      },
    },
  });

  return result;
}

export async function getDatosLeal(userId) {
  const datosLeal = await prisma.users.findUnique({
    where: { userId: userId },
    select: {
      datosLeal: true,
    },
  });

  return datosLeal.datosLeal;
}

export async function firstLealDataUpdate(userId) {
  const datosLeal = await getDatosLeal(userId);

  const result = await prisma.users.update({
    where: { userId: userId },
    data: {
      datosLeal: {
        ...datosLeal,
        puntosLeal: datosLeal.puntosLeal + 100,
      },
    },
  });

  return result;
}

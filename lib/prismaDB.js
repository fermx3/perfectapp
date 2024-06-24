import { PrismaClient } from '@prisma/client';
import moment from 'moment';

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

// export async function getLealesAsignados(zonas) {
//   const rawLeales = await prisma.users.findMany({
//     where: {
//       userInfo: { is: zonas },
//       // AND: [
//       //   {
//       //     role: {
//       //       equals: 'LEAL',
//       //     },
//       //   },
//       //   {
//       //     userInfo: { zona: { hasSome: zonas } },
//       //   },
//       // ],
//     },
//     select: {
//       userId: true,
//       userInfo: true,
//     },
//   });

//   const clientes = rawLeales.map((cliente) => ({
//     userId: cliente.userId,
//     ...cliente.userInfo,
//   }));

//   return clientes;
// }

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
    valorDePuntos: rawLeal.valorDePuntos,
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
  const firstLoginDate = moment().format();
  const datosLeal = await getDatosLeal(userId);

  const firstLogin = await prisma.users.update({
    where: { userId: userId },
    data: {
      datosLeal: { puntosLeal: datosLeal.puntosLeal + 2000, firstLoginDate },
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
        firstLoginDate: datosLeal.firstLoginDate,
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
        puntosLeal: datosLeal.puntosLeal + 3000,
      },
    },
  });

  return result;
}

export async function getPromociones(empresa) {
  const result = await prisma.config.findUnique({
    where: { empresa: empresa },
    select: {
      promocionesDelMes: true,
    },
  });

  return result;
}

export async function getOpcionesDeNoCompra(empresa) {
  const result = await prisma.config.findUnique({
    where: { empresa: empresa },
    select: {
      opcionesDeNoCompra: true,
    },
  });

  return result.opcionesDeNoCompra;
}

export async function getDistribuidores(empresa) {
  const result = await prisma.config.findUnique({
    where: { empresa: empresa },
    select: {
      distribuidores: true,
    },
  });

  return result.distribuidores;
}

export async function getSettings(empresa) {
  const result = await prisma.config.findUnique({
    where: { empresa: empresa },
  });

  return result;
}

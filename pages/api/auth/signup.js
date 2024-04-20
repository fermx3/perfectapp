import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

import { hashPassword } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { crearLealSchema } from '@/lib/schemas/schemas';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    res.status(401).json({ error: { message: 'Not authenticated!' } });
    return;
  }

  const prisma = new PrismaClient();

  // const response = crearLealSchema.safeParse(req.body);

  // if (!response.success) {
  //   const { errors } = response.error;

  //   return res.status(400).json({
  //     error: { message: 'Invalid request :(', errors },
  //   });
  // }

  //zod
  const response = crearLealSchema.safeParse(req.body);
  let zodErrors = {};
  if (!response.success) {
    response.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

  const { userId, password, role, userInfo } = response.data;

  // if (
  //   !userId ||
  //   /\D/.test(userId) ||
  //   !password ||
  //   password.trim().length < 8 ||
  //   !nivelDeCliente ||
  //   !nombre ||
  //   !role
  // ) {
  //   res.status(422).json({
  //     message: 'Entrada invalida',
  //   });
  //   return;
  // }

  async function main() {
    //Check if the userId already exists
    const existingUser = await prisma.users.findUnique({
      where: { userId: userId },
    });

    if (existingUser) {
      res
        // .status(422)
        .json({
          errors: {
            userId: 'El numero de usuario ya existe. Intenta otra vez.',
          },
        });
      prisma.$disconnect();
      return;
    }
    //
    const hashedPassword = await hashPassword(password);
    const result = await prisma.users.create({
      data: {
        userId: userId,
        password: hashedPassword,
        role: role,
        userInfo: userInfo,
      },
    });

    res.status(201).json({ message: 'Usuario creado!' });
  }

  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
    });
}

export default handler;

import { hashPassword } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const prisma = new PrismaClient();

  const data = req.body;

  const { userId, password, nivelDeCliente, nombreDelUser, role } = data;

  if (
    !userId ||
    /\D/.test(userId) ||
    !password ||
    password.trim().length < 8 ||
    !nivelDeCliente ||
    !nombreDelUser ||
    !role
  ) {
    res.status(422).json({
      message:
        'Entrada invalida - la contraseña debe ser mayor a 8 caracteres.',
    });
    return;
  }

  async function main() {
    //Check if the userId already exists
    const existingUser = await prisma.users.findUnique({
      where: { userId: userId },
    });

    if (existingUser) {
      res.status(422).json({ message: 'El numero de usuario ya existe.' });
      return;
    }
    //
    const hashedPassword = await hashPassword(password);
    const result = await prisma.users.create({
      data: {
        userId: userId,
        password: hashedPassword,
        role: role,
        userInfo: {
          nombreDelUser: nombreDelUser,
          nivelDeCliente: nivelDeCliente,
        },
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

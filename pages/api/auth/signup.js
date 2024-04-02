import { hashPassword } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { crearLealSchema } from '@/lib/schemas/schemas';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const prisma = new PrismaClient();

  const data = await req.body;

  const { userId, password, nivelDeCliente, nombre, role } = data;

  //zod
  // const result = crearLealSchema.safeParse(data);
  // let zodErrors = {};
  // if (!result.success) {
  //   result.error.issues.forEach((issue) => {
  //     zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
  //   });
  // }

  // res.json(
  //   Object.keys(zodErrors).length > 0
  //     ? { errors: zodErrors }
  //     : { success: true }
  // );

  if (
    !userId ||
    /\D/.test(userId) ||
    !password ||
    password.trim().length < 8 ||
    !nivelDeCliente ||
    !nombre ||
    !role
  ) {
    res.status(422).json({
      message: 'Entrada invalida',
    });
    return;
  }

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
          nombre: nombre,
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

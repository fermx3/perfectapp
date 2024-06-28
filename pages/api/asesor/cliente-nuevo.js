import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { clienteNuevoSchema } from '@/lib/schemas/schemas';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ASESOR') {
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
  const response = clienteNuevoSchema.safeParse(req.body);
  let zodErrors = {};
  if (!response.success) {
    response.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

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
    const result = await prisma.prospectos.create({
      data: response.data,
    });

    res.status(201).json({ message: 'Cliente enviado!' });
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

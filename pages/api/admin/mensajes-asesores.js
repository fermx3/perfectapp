import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { actualizarMensajesSchema } from '@/lib/schemas/schemas';

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
  const response = actualizarMensajesSchema.safeParse(req.body);
  let zodErrors = {};
  if (!response.success) {
    response.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

  async function main() {
    console.log(response.data);

    // if (
    //   response.data.infoDeCategoria.titulo === '' &&
    //   response.data.infoDeCategoria.contenido === ''
    // ) {
    //   await prisma.mensajesAsesores.delete({
    //     where: { _id: 'infoDeCategoria' },
    //   });
    // }

    // if (
    //   response.data.infoDeComunicacion.titulo === '' &&
    //   response.data.infoDeComunicacion.contenido === ''
    // ) {
    //   await prisma.mensajesAsesores.delete({
    //     where: { _id: 'infoDeComunicacion' },
    //   });
    // }

    // if (
    //   response.data.infoDeFidelizacion.titulo === '' &&
    //   response.data.infoDeFidelizacion.contenido === ''
    // ) {
    //   await prisma.mensajesAsesores.delete({
    //     where: { _id: 'infoDeFidelizacion' },
    //   });
    // }

    const result = await prisma.mensajesAsesores.createMany({
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

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { actualizarMensajesSchema } from '@/lib/schemas/schemas';

import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri);

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    res.status(401).json({ error: { message: 'Not authenticated!' } });
    return;
  }

  await client.connect();
  const database = client.db('perfectapp');
  const mensajesAsesores = database.collection('mensajesAsesores');

  // const response = crearLealSchema.safeParse(req.body);

  // if (!response.success) {
  //   const { errors } = response.error;

  //   return res.status(400).json({
  //     error: { message: 'Invalid request :(', errors },
  //   });
  // }

  //zod
  const body = actualizarMensajesSchema.safeParse(req.body);
  let zodErrors = {};
  if (!body.success) {
    body.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

  async function main() {
    console.log(body.data);
    const dataToInsert = [];

    if (
      body.data.infoDeCategoria.titulo === '' &&
      body.data.infoDeCategoria.contenido === ''
    ) {
      await mensajesAsesores.deleteOne({ _id: 'infoDeCategoria' });
    } else {
      dataToInsert.push({
        _id: 'infoDeCategoria',
        ...body.data.infoDeCategoria,
      });
      await mensajesAsesores.updateOne(
        { _id: 'infoDeCategoria' },
        { $set: body.data.infoDeCategoria },
        { upsert: true }
      );
    }

    if (
      body.data.infoDeComunicacion.titulo === '' &&
      body.data.infoDeComunicacion.contenido === ''
    ) {
      await mensajesAsesores.deleteOne({ _id: 'infoDeComunicacion' });
    } else {
      dataToInsert.push({
        _id: 'infoDeComunicacion',
        ...body.data.infoDeComunicacion,
      });
      await mensajesAsesores.updateOne(
        { _id: 'infoDeComunicacion' },
        { $set: body.data.infoDeComunicacion },
        { upsert: true }
      );
    }

    if (
      body.data.infoDeFidelizacion.titulo === '' &&
      body.data.infoDeFidelizacion.contenido === ''
    ) {
      await mensajesAsesores.deleteOne({ _id: 'infoDeFidelizacion' });
    } else {
      dataToInsert.push({
        _id: 'infoDeFidelizacion',
        ...body.data.infoDeFidelizacion,
      });
      await mensajesAsesores.updateOne(
        { _id: 'infoDeFidelizacion' },
        { $set: body.data.infoDeFidelizacion },
        { upsert: true }
      );
    }

    // const result = await mensajesAsesores.insertMany([
    //   { _id: 'infoDeCategoria', ...body.data.infoDeCategoria },
    //   { _id: 'infoDeComunicacion', ...body.data.infoDeComunicacion },
    //   { _id: 'infoDeFidelizacion', ...body.data.infoDeFidelizacion },
    // ]);

    // const result = await mensajesAsesores.updateMany(
    //   {},
    //   { $set: dataToInsert },
    //   { upsert: true }
    // );

    res.status(201).json({ message: 'Cliente enviado!' });
  }

  main()
    .then(async () => {
      await client.close();
    })
    .catch(async (e) => {
      console.error(e);
      await client.close();
    });
}

export default handler;

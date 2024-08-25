import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
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

  const empresa = session?.user?.empresa;

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
    const dataToInsert = {
      infoDeCategoria: {
        titulo: body.data.infoDeCategoria.titulo,
        contenido: body.data.infoDeCategoria.contenido,
        tipo: 'infoDeCategoria',
        empresa,
      },
      infoDeComunicacion: {
        titulo: body.data.infoDeComunicacion.titulo,
        contenido: body.data.infoDeComunicacion.contenido,
        tipo: 'infoDeComunicacion',
        empresa,
      },
      infoDeFidelizacion: {
        titulo: body.data.infoDeFidelizacion.titulo,
        contenido: body.data.infoDeFidelizacion.contenido,
        tipo: 'infoDeFidelizacion',
        empresa,
      },
    };

    if (
      body.data.infoDeCategoria.titulo === '' &&
      body.data.infoDeCategoria.contenido === ''
    ) {
      await mensajesAsesores.deleteOne({ _id: `infoDeCategoria_${empresa}` });
    } else {
      // dataToInsert.push({
      //   _id: `infoDeCategoria_${empresa}`,
      //   tipo: 'infoDeCategoria',
      //   empresa,
      //   ...body.data.infoDeCategoria,
      // });
      await mensajesAsesores.updateOne(
        { _id: `infoDeCategoria_${empresa}` },
        { $set: dataToInsert.infoDeCategoria },
        { upsert: true }
      );
    }

    if (
      body.data.infoDeComunicacion.titulo === '' &&
      body.data.infoDeComunicacion.contenido === ''
    ) {
      await mensajesAsesores.deleteOne({
        _id: `infoDeComunicacion_${empresa}`,
      });
    } else {
      // dataToInsert.push({
      //   _id: `infoDeComunicacion_${empresa}`,
      //   tipo: 'infoDeComunicacion',
      //   empresa,
      //   ...body.data.infoDeComunicacion,
      // });
      await mensajesAsesores.updateOne(
        { _id: `infoDeComunicacion_${empresa}` },
        { $set: dataToInsert.infoDeComunicacion },
        { upsert: true }
      );
    }

    if (
      body.data.infoDeFidelizacion.titulo === '' &&
      body.data.infoDeFidelizacion.contenido === ''
    ) {
      await mensajesAsesores.deleteOne({
        _id: `infoDeFidelizacion_${empresa}`,
      });
    } else {
      // dataToInsert.push({
      //   _id: `infoDeFidelizacion_${empresa}`,
      //   tipo: 'infoDeFidelizacion',
      //   empresa,
      //   ...body.data.infoDeFidelizacion,
      // });
      await mensajesAsesores.updateOne(
        { _id: `infoDeFidelizacion_${empresa}` },
        { $set: dataToInsert.infoDeFidelizacion },
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

    res.status(201).json({ message: 'Mensajes modificados' });
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

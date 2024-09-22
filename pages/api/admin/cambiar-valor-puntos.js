import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { cambiarValorDePuntosSchema } from '@/lib/schemas/schemas';

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
  const collection = database.collection('config');

  // const response = crearLealSchema.safeParse(req.body);

  // if (!response.success) {
  //   const { errors } = response.error;

  //   return res.status(400).json({
  //     error: { message: 'Invalid request :(', errors },
  //   });
  // }

  //zod
  const body = cambiarValorDePuntosSchema.safeParse(req.body);
  let zodErrors = {};
  if (!body.success) {
    body.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

  async function main() {
    const result = await collection.updateOne(
      { empresa },
      { $set: { valorDePuntos: body.data } }
    );

    res.status(201).json({ message: 'Puntos modificados' });
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

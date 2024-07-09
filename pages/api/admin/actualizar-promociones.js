import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

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
  const collection = database.collection('config');

  const body = req.body.promociones;

  // const response = crearLealSchema.safeParse(req.body);

  // if (!response.success) {
  //   const { errors } = response.error;

  //   return res.status(400).json({
  //     error: { message: 'Invalid request :(', errors },
  //   });
  // }

  //zod
  //   const body = actualizarMensajesSchema.safeParse(req.body);
  //   let zodErrors = {};
  //   if (!body.success) {
  //     body.error.issues.forEach((issue) => {
  //       zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
  //     });
  //     res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  //   }

  async function main() {
    const dataToInsert = body.map((promo) => {
      return {
        promo: promo.promo,
        nivelDeCliente: promo.nivelDeCliente
          .filter((nivel) => nivel.selected)
          .reduce((acc, nivel) => {
            acc.push(nivel.name);
            return acc;
          }, []),
        sku: promo.sku,
      };
    });

    const result = await collection.updateOne(
      { empresa: 'upfield' },
      { $set: { promocionesDelMes: dataToInsert } },
      { upsert: true }
    );

    res.status(201).json({ message: 'Promociones Actualizadas' });
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

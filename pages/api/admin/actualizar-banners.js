import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import { MongoClient } from 'mongodb';
import { actualizarBannersSchema } from '@/lib/schemas/schemas';

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
  const collection = database.collection('bannersLeales');

  //zod
  const response = actualizarBannersSchema.safeParse(req.body);
  let zodErrors = {};
  if (!response.success) {
    response.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

  console.log('response', response.data.bannersLeales);

  async function main() {
    const ids = response.data.bannersLeales.map((banner) => banner._id);
    await collection.deleteMany({ _id: { $nin: ids }, empresa: empresa });

    const bulkOps = response.data.bannersLeales.map((banner) => ({
      updateOne: {
        filter: { _id: `${empresa}-${banner.titulo}` },
        update: {
          $set: { ...banner, _id: `${empresa}-${banner.titulo}`, empresa },
        },
        upsert: true,
      },
    }));

    await collection.bulkWrite(bulkOps);

    // const dataToInsert = body.map((promo) => {
    //   return {
    //     promo: promo.promo,
    //     nivelDeCliente: promo.nivelDeCliente
    //       .filter((nivel) => nivel.selected)
    //       .reduce((acc, nivel) => {
    //         acc.push(nivel.name);
    //         return acc;
    //       }, []),
    //     sku: promo.sku,
    //     grupo: promo.grupo,
    //   };
    // });

    // const result = await collection.updateOne(
    //   { empresa: session.user.empresa },
    //   { $set: { promocionesDelMes: dataToInsert } },
    //   { upsert: true }
    // );

    res.status(201).json({ message: 'Banners actualizados' });
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

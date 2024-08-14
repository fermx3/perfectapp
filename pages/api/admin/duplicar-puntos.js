import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri);

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    res.status(401).json({ error: { message: 'Not authenticated!' } });
    return;
  }

  const body = req.body;

  if (body.lealesQueRebasaronCuota.length === 0) {
    res.status(400).json({
      error: { message: 'No hay leales que rebasaron cuota para duplicar!' },
    });
    return;
  }

  await client.connect();
  const database = client.db('perfectapp');
  const users = database.collection('users');

  async function main() {
    const result = await users.bulkWrite(
      body.lealesQueRebasaronCuota.map((leal) => ({
        updateOne: {
          filter: { _id: leal._id },
          update: {
            $inc: { 'datosLeal.puntosLeal': leal.puntosGenerados },
            $addToSet: {
              mesesCuotaRebasada: leal.mes,
            },
          },
          upsert: true,
        },
      }))
    );
  }

  main()
    .then(async () => {
      res.status(201).json({ message: 'Puntos duplicados!' });
      await client.close();
    })
    .catch(async (e) => {
      console.error(e);
      await client.close();
    });
}

export default handler;

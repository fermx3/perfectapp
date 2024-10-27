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

  await client.connect();
  const database = client.db('perfectapp');
  const ordenes = database.collection('ordenes');

  const body = req.body;

  async function main() {
    const result2 = await ordenes.updateMany(
      { _id: { $in: body.ordenesParaValidar.map((orden) => orden._id) } },
      { $set: { ordenArchivada: false } }
    );
  }

  main()
    .then(async () => {
      res.status(201).json({ message: 'Venta archivada' });
      await client.close();
    })
    .catch(async (e) => {
      console.error(e);
      await client.close();
    });
}

export default handler;

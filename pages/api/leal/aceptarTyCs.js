import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { aceptarTyCSchema } from '@/lib/schemas/schemas';
import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  const uri = process.env.DATABASE_URL;

  const client = new MongoClient(uri);

  const data = aceptarTyCSchema.safeParse(req.body);

  let zodErrors = {};
  if (!data.success) {
    data.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

  const userId = session.user.userId;

  async function run() {
    try {
      await client.connect();
      const database = client.db('perfectapp');
      const users = database.collection('users');

      const { aceptoTyC } = data.data;
      const result = await users.updateOne(
        { _id: userId },
        { $set: { aceptoTyC } }
      );
    } finally {
      await client.close();
    }
  }
  run().catch((error) => {
    res
      .status(400)
      .json({ message: 'Error al aceptar los términos y condiciones' });
  });

  res.status(200).json({ message: 'TyC aceptados' });
}

export default handler;

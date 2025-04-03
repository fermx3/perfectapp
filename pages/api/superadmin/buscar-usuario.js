const { getServerSession } = require('next-auth');
const { authOptions } = require('../auth/[...nextauth]');
const { MongoClient } = require('mongodb');

const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri);

async function handler(req, res) {
  if (req.method !== 'GET') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'SUPERADMIN') {
    res.status(401).json({ error: { message: 'Not authenticated!' } });
    return;
  }

  const empresa = session.user.empresa;

  await client.connect();
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const { userId } = req.query;

  const user = await users.findOne(
    {
      _id: userId,
      role: { $ne: 'SUPERADMIN' },
    },
    {
      projection: {
        _id: 1,
        role: 1,
        'userInfo.nombre': 1,
      },
    }
  );

  if (!user) {
    res.status(404).json({ error: { message: 'Usuario no encontrado' } });
    return;
  }

  res.status(200).json({ user });
}

export default handler;

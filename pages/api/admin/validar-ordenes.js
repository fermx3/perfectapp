import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { MongoClient } from 'mongodb';
import moment from 'moment';

const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri);

const date = moment().format();

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
  const users = database.collection('users');
  const ordenes = database.collection('ordenes');

  const body = req.body;

  async function main() {
    console.log(body);
    const userDataToUpdate = {
      $inc: { 'datosLeal.puntosLeal': body.puntosGenerados },
      ventas: { fecha: body.fecha, orden: body.orden },
    };

    const result = await users.updateOne(
      { _id: body.cliente },
      {
        $inc: { 'datosLeal.puntosLeal': body.puntosGenerados },
        $push: { ventas: { fecha: date, orden: body.orden } },
      },
      { upsert: true }
    );

    const result2 = await ordenes.updateOne(
      { _id: body._id },
      { $set: { ordenValidada: true } }
    );
  }

  main()
    .then(async () => {
      res.status(201).json({ message: 'Venta validada!' });
      await client.close();
    })
    .catch(async (e) => {
      console.error(e);
      await client.close();
    });
}

export default handler;

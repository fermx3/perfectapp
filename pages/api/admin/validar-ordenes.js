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
    console.log(body.ordenesParaValidar);

    const result = await users.bulkWrite(
      body.ordenesParaValidar.map((orden) => ({
        updateOne: {
          filter: { _id: orden.cliente },
          update: {
            $inc: { 'datosLeal.puntosLeal': orden.puntosGenerados },
            $push: {
              ventas: {
                fecha: orden.fecha,
                fechaDeValidacion: date,
                orden: orden.orden,
              },
            },
          },
          upsert: true,
        },
      }))
    );

    const result2 = await ordenes.updateMany(
      { _id: { $in: body.ordenesParaValidar.map((orden) => orden._id) } },
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

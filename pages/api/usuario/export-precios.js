import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import { put } from '@vercel/blob';

const Json2csvParser = require('json2csv').Parser;

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !['USUARIO', 'ADMIN'].includes(session.user.role)) {
    res.status(401).json({ error: { message: 'Not authenticated!' } });
    return;
  }

  const data = await req.body;

  async function run() {
    try {
      // Get the database and collection on which to run the operation
      const database = client.db('perfectapp');
      const visitas = database.collection('visitas');
      // Execute query
      const precios = await visitas
        .aggregate([
          {
            $match: {
              empresa: session.user.empresa,
            },
          },
          {
            $match: {
              comentarios1: {
                $not: {
                  $regex: 'test',
                },
              },
            },
          },
          {
            $project: {
              numeroDePromotor: '$asesor',
              numeroDeCliente: 1,
              competidores: 1,
              finVisita: 1,
              evidenciaPrecios: 1,
              inicioVisita: {
                $dateFromString: {
                  dateString: '$inicioVisita',
                },
              },
            },
          },
          {
            $match: {
              inicioVisita: {
                $gte: new Date(data.fechaInicio),
                $lt: new Date(data.fechaFin),
              },
            },
          },
          {
            $sort: {
              inicioVisita: 1,
            },
          },
          {
            $unwind: {
              path: '$competidores',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$competidores.productos',
            },
          },
          {
            $project: {
              marca: '$competidores.nombre',
              gramos: '$competidores.productos.gramos',
              numeroDePromotor: 1,
              numeroDeCliente: 1,
              finVisita: 1,
              evidenciaPrecios: 1,
              precio: '$competidores.productos.precio',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'numeroDePromotor',
              foreignField: '_id',
              as: 'promotorInfo',
              pipeline: [
                {
                  $project: {
                    numeroDeCoordinador: '$userInfo.coordinador',
                    promotor: '$userInfo.nombre',
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'numeroDeCliente',
              foreignField: '_id',
              as: 'clienteInfo',
            },
          },
          {
            $unwind: {
              path: '$promotorInfo',
            },
          },
          {
            $unwind: {
              path: '$clienteInfo',
            },
          },
          {
            $project: {
              finVisita: 1,
              numeroDeCliente: 1,
              numeroDePromotor: 1,
              sku: 1,
              cajas: 1,
              numeroDeCoordinador: '$promotorInfo.numeroDeCoordinador',
              promotor: '$promotorInfo.promotor',
              cliente: '$clienteInfo.userInfo.nombre',
              grupo: '$clienteInfo.userInfo.grupo',
              central: '$clienteInfo.userInfo.central',
              ubicacion: '$clienteInfo.userInfo.ubicacion',
              canal: '$clienteInfo.userInfo.canal',
              prioridad: '$clienteInfo.userInfo.nivelDeCliente',
              marca: 1,
              gramos: 1,
              precio: 1,
              evidenciaPrecios: 1,
            },
          },
        ])
        .toArray();

      // Print a message if no documents were found
      if (precios.length === 0) {
        res.status(404).send({ message: 'No documents found!', url: '' });
        console.log('No documents found!');
      }
      // Print returned documents

      const json2csvParser = new Json2csvParser({ header: true });
      const csvData = json2csvParser.parse(precios);

      const blob = await put(
        `temp/precios/precios_${data.fechaInicio}-${data.fechaFin}.csv`,
        csvData,
        {
          access: 'public',
        }
      );

      res.status(200).json({ message: 'Precios exportados', url: blob.url });
    } finally {
      await client.close();
    }
  }
  run().catch((error) => {
    res.status(400).send({
      message: 'Error desconocido, contacta al administrador.',
      //   message: error,
    });
    console.log('There was an error', error);
  });
}

export default handler;

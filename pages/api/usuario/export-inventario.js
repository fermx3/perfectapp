import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import { put } from '@vercel/blob';

const Json2csvParser = require('json2csv').Parser;

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  const session = await getServerSession(req, res, authOptions);

  if (!session || !['USUARIO', 'ADMIN'].includes(session.user.role)) {
    res.status(401).json({ error: { message: 'Not authenticated!' } });
    return;
  }

  const data = await req.body;

  console.log(data.fechaInicio);

  async function run() {
    try {
      // Get the database and collection on which to run the operation
      const database = client.db('perfectapp');
      const visitas = database.collection('visitas');
      // Execute query
      const inventario = await visitas
        .aggregate([
          {
            $match: {
              empresa: session.user.empresa,
              inventario: {
                $exists: true,
              },
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
              inventario: 1,
              finVisita: 1,
              inicioVisita: 1,
            },
          },
          {
            $match: {
              inicioVisita: {
                $gte: data.fechaInicio,
                $lt: data.fechaFin,
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
              path: '$inventario',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              sku: '$inventario.producto',
              numeroDePromotor: 1,
              numeroDeCliente: 1,
              finVisita: 1,
              cajas: '$inventario.cajas',
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
            },
          },
        ])
        .toArray();

      // Print a message if no documents were found
      if (inventario.length === 0) {
        res.status(404).send({
          message:
            'No se encontró ningun documento correspondiente a las fechas señaladas',
        });
        console.log(
          'No se encontró ningun documento correspondiente a las fechas señaladas'
        );
        await client.close();
        return;
      }
      // Print returned documents

      const json2csvParser = new Json2csvParser({ header: true });
      const csvData = json2csvParser.parse(inventario);

      const blob = await put(
        `temp/inventario/inventario_${data.fechaInicio}-${data.fechaFin}.csv`,
        csvData,
        {
          access: 'public',
        }
      );

      res.status(200).json({ message: 'Inventario exportado', url: blob.url });
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

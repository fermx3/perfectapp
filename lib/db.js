import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL;

export async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.DATABASE_URL);

  return client;
}

export async function getLealesAsignados(zonas) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const lealesAsignados = await users
    .aggregate([
      {
        $project: {
          _id: 0,
          userId: 1,
          userInfo: 1,
          role: 1,
        },
      },
      {
        $match: {
          $and: [
            {
              role: 'LEAL',
            },
            {
              'userInfo.zona': {
                $in: zonas,
              },
            },
          ],
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$$ROOT', '$userInfo'],
          },
        },
      },
      {
        $unset: 'role',
      },
    ])
    .toArray();

  // const query = {
  //   $and: [{ role: 'LEAL' }, { 'userInfo.zona': { $in: ['norte'] } }],
  // };

  // const selectedFields = { _id: 0, userId: 1, userInfo: 1 };

  // const lealesAsignados = await leales
  //   .find(query)
  //   .project(selectedFields)
  //   .toArray();

  // Print the ID of the inserted document
  // res.status(201).json({ message: 'Listo! Ya estás suscrito!' });
  await client.close();
  return lealesAsignados;
}

export async function getUsuario(userID) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const query = { userId: userID };

  const selectedFields = {
    projection: { _id: 0, userId: 1, userInfo: 1, role: 1 },
  };

  const usuario = await users.findOne(query, selectedFields);

  // Print the ID of the inserted document
  await client.close();
  return usuario;
}

export async function getAllVisitas() {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const visitas = database.collection('visitas');

  const allVisitas = await visitas.aggregate([
    {
      $unwind: {
        path: '$competidores',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$competidores.productos',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$ordenDeCompra',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  // Print the ID of the inserted document
  await client.close();
  return allVisitas;
}

export async function getAvisoDePrivacidad() {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const config = database.collection('config');

  const selectedFields = {
    projection: { _id: 0, avisoDePrivacidad: 1 },
  };

  const avisoDePrivacidad = await config.findOne({}, selectedFields);

  // Print the ID of the inserted document
  await client.close();
  return avisoDePrivacidad;
}

export async function getTerminosYCondiciones() {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const config = database.collection('config');

  const selectedFields = {
    projection: { _id: 0, terminosYCondiciones: 1 },
  };

  const terminosYCondiciones = await config.findOne({}, selectedFields);

  // Print the ID of the inserted document
  await client.close();
  return terminosYCondiciones;
}

export async function getVisitasConOrdenesPorCliente(fecha, clientId) {
  const client = new MongoClient(uri);

  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const visitas = database.collection('visitas');

  const visitasConOrdenes = await visitas
    .aggregate([
      {
        $match: {
          $and: [
            {
              inicioVisita: new RegExp(fecha),
            },
            {
              numeroDeCliente: { $in: clientId },
            },
            {
              hayOrdenDeCompra: true,
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$ordenDeCompra',
        },
      },
      {
        $group: {
          _id: null,
          ordenesDeCompra: {
            $push: '$ordenDeCompra',
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ])
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return visitasConOrdenes[0]?.ordenesDeCompra || null;
}

export async function getCuotaTotals(zonas) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const cuotaTotals = await users
    .aggregate([
      {
        $match: {
          'userInfo.zona': {
            $in: zonas,
          },
        },
      },
      {
        $project: {
          'cuotaPallets.iberia1Kg': {
            $convert: {
              input: '$cuotaPallets.iberia1Kg',
              to: 'double',
            },
          },
          'cuotaPallets.iberia90g': {
            $convert: {
              input: '$cuotaPallets.iberia90g',
              to: 'double',
            },
          },
          'cuotaPallets.iberia225g': {
            $convert: {
              input: '$cuotaPallets.iberia225g',
              to: 'double',
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          iberia1Kg: {
            $sum: '$cuotaPallets.iberia1Kg',
          },
          iberia225g: {
            $sum: '$cuotaPallets.iberia225g',
          },
          iberia90g: {
            $sum: '$cuotaPallets.iberia90g',
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ])
    .toArray();
  // Print the ID of the inserted document
  await client.close();
  return cuotaTotals[0];
}

export async function getUserIdsFromAGivenZonas(zonas) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const userIds = await users
    .aggregate([
      {
        $match: {
          'userInfo.zona': { $in: zonas },
        },
      },
      {
        $group: {
          _id: 0,
          userIds: {
            $push: '$userId',
          },
        },
      },
    ])
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return userIds[0].userIds;
}

export async function getUserIdsFromGivenZonasThatPurchased(fecha, asesores) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const visitas = database.collection('visitas');

  const userIds = await visitas
    .aggregate([
      {
        $match: {
          $and: [
            {
              hayOrdenDeCompra: true,
            },
            {
              inicioVisita: new RegExp(fecha),
            },
            {
              asesor: { $in: asesores },
            },
            {
              comentarios1: {
                $not: new RegExp('test'),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: 0,
          userIds: {
            $push: '$numeroDeCliente',
          },
        },
      },
    ])
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return userIds[0]?.userIds || [];
}

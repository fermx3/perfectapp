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
  const users = database.collection('visitas');

  const visitas = await users.aggregate([
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
  return visitas;
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

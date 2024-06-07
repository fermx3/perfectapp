import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL;

// export async function connectToDatabase() {
//   const client = await MongoClient.connect(process.env.DATABASE_URL);
//   const database = client.db('perfectapp');

//   return database;
// }

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

  console.log(lealesAsignados);

  // Print the ID of the inserted document
  // res.status(201).json({ message: 'Listo! Ya estás suscrito!' });
  // console.log(lealesAsignados);
  await client.close();
  return lealesAsignados;
}

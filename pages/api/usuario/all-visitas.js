import { MongoClient } from 'mongodb';
const Json2csvParser = require('json2csv').Parser;
const path = require('path');
const fs = require('fs');

async function handler(req, res) {
  if (req.method !== 'GET') {
    return;
  }

  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  async function run() {
    try {
      // Get the database and collection on which to run the operation
      const database = client.db('perfectapp');
      const visitas = database.collection('visitas');
      // Execute query
      const allVisitas = await visitas
        .aggregate([
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
        ])
        .toArray();
      // Print a message if no documents were found
      if ((await visitas.countDocuments({})) === 0) {
        console.log('No documents found!');
      }
      // Print returned documents

      const json2csvParser = new Json2csvParser({ header: true });
      const csvData = json2csvParser.parse(allVisitas);
      const newPath = path.join(
        process.cwd(),
        'public',
        'downloads',
        'visitas.csv'
      );

      fs.writeFile(newPath, csvData, function (error) {
        if (error) throw error;
        res.status(201).json({ message: 'Write to visitas.csv successfully!' });
      });
    } finally {
      await client.close();
    }
  }
  run().catch((error) => {
    res.status(400).send({
      //   message: 'Error desconocido, contacta al administrador.',
      message: error,
    });
    console.log('There was an error', error);
  });
}

export default handler;

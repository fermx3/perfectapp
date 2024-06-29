import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri);

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const body = await req.body;

  console.log(body);

  async function run() {
    try {
      // Connect to the database and access its collection
      await client.connect();
      const database = client.db('perfectapp');
      const contactos = database.collection('contactos');

      // Create a document to insert
      // const doc = {
      //   email: 'test@test.com',
      // };
      // Insert the defined document into the 'emails' collection
      const result = await contactos.insertOne(body);
      // Print the ID of the inserted document
      res.status(201).json({
        message:
          '¡Enviamos tu información! Pronto uno de nuestros asesores se pondrá en contacto contigo.',
      });
      console.log(result.insertedId);
    } finally {
      // Close the MongoDB client connection
      await client.close();
    }
  }

  run().catch((error) => {
    // if (error.code === 11000) {
    //   res.status(400).send({
    //     message: 'El email ya está suscrito.',
    //   });
    // } else {
    res.status(400).send({
      message: 'Error desconocido, contacta al administrador.',
    });
    console.log('There was an error', error);
    // }
  });
}

export default handler;

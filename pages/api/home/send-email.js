import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri);

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const body = await req.body;

  const htmlFormat = `
  <div>
  <h1>¡Se ha suscrito un nuevo email al newsletter!</h1>
  <p>Email: ${body.email}</p>
  </div>
  `;

  async function run() {
    const SMTPuser = process.env.SMTP_USERNAME;
    const SMTPpass = process.env.SMTP_PASSWORD;
    const email1 = process.env.EMAIL1;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
      auth: {
        user: SMTPuser,
        pass: SMTPpass,
      },
    });

    try {
      // Connect to the database and access its collection
      await client.connect();
      const database = client.db('perfectapp');
      const emails = database.collection('newsletter');

      // Create a document to insert
      // const doc = {
      //   email: 'test@test.com',
      // };
      // Insert the defined document into the 'emails' collection
      const result = await emails.insertOne({
        ...body,
        createdAt: new Date(),
      });

      //Send email
      try {
        const mail = await transporter.sendMail({
          from: 'perfectapp',
          to: email1,
          replyTo: SMTPuser,
          subject: 'Registro en newsletter',
          html: htmlFormat,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message:
            'No se pudo enviar el correo. Vuelve a intentar o contacta a un administrador.',
        });
      }

      // Print the ID of the inserted document
      res.status(201).json({ message: 'Listo! Ya estás suscrito!' });
    } finally {
      // Close the MongoDB client connection
      await client.close();
    }
  }

  // if (!error) {
  //   // Send email
  //   try {
  //     const mail = await transporter.sendMail({
  //       from: 'perfectapp',
  //       to: email1,
  //       replyTo: SMTPuser,
  //       subject: 'Registro en newsletter',
  //       html: htmlFormat,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({
  //       message:
  //         'No se pudo enviar el correo. Vuelve a intentar o contacta a un administrador.',
  //     });
  //   }
  // }

  run().catch((error) => {
    if (error.code === 11000) {
      res.status(400).send({
        message: 'El email ya está suscrito.',
      });
    } else {
      res.status(400).send({
        message: 'Error desconocido, contacta al administrador.',
      });
      console.log('There was an error', error);
    }
  });
}

export default handler;

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
  <h2>Nuevo mensaje de contacto</h2>
  <p>Nombre: ${body.nombre}</p>
  <p>Email: ${body.email}</p>
  <p>Teléfono: ${body.telefono}</p>
  <p>Empresa: ${body.empresa}</p>
  <p>Ubicación: ${body.ubicacion}</p>
  <p>Giro: ${body.giro}</p>
  <p>Mensaje: </p>
  <p>${body.necesidad}</p>
  </div>
  `;

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
      const result = await contactos.insertOne({
        ...body,
        createdAt: new Date(),
      });

      // Send email
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
        const mail = await transporter.sendMail({
          from: 'perfectapp',
          to: email1,
          replyTo: SMTPuser,
          subject: 'Nuevo mensaje de contacto',
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

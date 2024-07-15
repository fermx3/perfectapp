import nodemailer from 'nodemailer';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = await req.body;

  const htmlFormat = `
  <h1>Solicitud de base de datos con los siguientes filtros:</h1>
  <p>Fecha inicial: ${data.fechaInicio}</p>
  <p>Fecha final: ${data.fechaFin}</p>
  <p>Cliente: ${data.cliente}</p>
  <p>Central: ${data.central}</p>
  <p>Usuario que solicita: ${data.userID}</p>
  `;

  async function main() {
    //Send mails
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
        subject: 'Solicitud de base de datos',
        html: htmlFormat,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          'No se pudo enviar el correo. Vuelve a intentar o contacta a un administrador.',
      });
    }

    //Return success message if everything correct
    res
      .status(201)
      .json({ message: 'Informacion enviada. Se enviara la base de datos.' });
  }

  main()
    .then(async () => {
      console.log('Correo enviado');
    })
    .catch(async (e) => {
      console.error(e);
    });
}

export default handler;

// import { createTransport } from 'nodemailer';

// // Create a transporter object
// const transporter = createTransport({
//     service: 'your_email_service_provider',
//     auth: {
//         user: 'your_email_address',
//         pass: 'your_email_password'
//     }
// });

// // Define the email options
// const mailOptions = {
//     from: 'sender_email_address',
//     to: 'recipient_email_address',
//     subject: 'Email Subject',
//     text: 'Email Body'
// };

// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.log('Error:', error);
//     } else {
//         console.log('Email sent:', info.response);
//     }
// });

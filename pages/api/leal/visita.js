import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const prisma = new PrismaClient();

  const data = await req.body;

  const htmlFormat = `
  <div>
        <h2>Resumen</h2>
        <div>
          <p>Asesor: ${data.asesor}</p>
          <p>Cliente: ${data.numeroDeCliente}</p>
        </div>
        <div>
          <h3>Competidores</h3>
          <p>Número de competidores: ${data.competidores.length}</p>
          ${data.competidores.map(
            (competidor) =>
              `<div>
              <h4>${competidor.nombre}</h4>
              <h5>Productos:</h5>
              ${competidor.productos.map(
                (producto) =>
                  `<div>
                  <p>Gramos: ${producto.gramos}gr</p>
                  <p>Precio: $${producto.precio}</p>
                  ${
                    producto.hasPromo &&
                    `<div>
                        <p>Precio con promoción: $${producto.precioConPromo}</p>
                        <p>${producto.precioConPromoReason}</p>
                      </div>`
                  }
                  <p>PoP: ${producto.pop ? 'Si' : 'No'}</p>
                </div>`
              )}
            </div>`
          )}
          <p>Comentarios: ${data.comentarios1}</p>
        </div>
        <div>
          <h3>Promociones</h3>
          <div>
            <h4>Promociones del mes</h4>
            ${data.promociones.map(
              (promocion) =>
                `<div>
                <h5>${promocion.promo}</h5>
                <p>
                  ${promocion.implementada ? 'Implementada' : 'NO implementada'}
                </p>
              </div>`
            )}
          </div>
          <div>
            <h4>Cuneta</h4>
            <p>
              Cuenta con inventario:
              ${data.cuentaConInventario ? 'Si' : 'No'}
            </p>
            ${
              data.cuentaConInventario &&
              `<div>
                  <h5>Inventario:</h5>
                  ${data.inventario.map(
                    (item) =>
                      `<div>
                      <h6>${item.producto}</h6>
                      <p>${item.cajas} cajas</p>
                    </div>`
                  )}
                </div>`
            }
            ${
              data.hayOrdenDeCompra
                ? `<div>
                  <h5>Orden de compra:</h5>
                  <p>Distribuidor: ${data.distribuidor}</p>
                  ${data.ordenDeCompra.map(
                    (item) =>
                      `<div>
                      <h6>${item.producto}</h6>
                      <p>${item.cajas} cajas</p>
                    </div>`
                  )}
                </div>`
                : `
                <div>
                  <p>No hay orden de compra.</p>
                  <p>¿Porqué no compra?: ${data.porqueNoCompra}</p>  
                </div>
                `
            }
          </div>
          <p>Comentarios: ${data.comentarios2}</p>
        </div>
        <div>
          <h3>Comunicación</h3>
          <div>
            <h4>Plan de comunicación del mes</h4>
            ${data.planDeComunicacion.map(
              (material) =>
                `<div>
                <h5>${material.materiales}</h5>
                <p>Alcance: ${material.alcance ? 'Si' : 'No'}</p>
              </div>`
            )}
          </div>
          <div>
            <h4>Implementación Materiales</h4>
            ${data.materiales.map(
              (material) =>
                `<div>
                <h5>${material.material}</h5>
                <p>PoP: ${material.pop ? 'Si' : 'No'}</p>
              </div>`
            )}
          </div>
          <div>
            <h4>Implementación de Exhibición</h4>
            ${data.exhibiciones.map(
              (exhibicion) =>
                `<div>
                <h5>${exhibicion.producto}</h5>
                <p>Periodo negociado: ${exhibicion.periodoNegociado}</p>
                <p>PoP: ${exhibicion.pop ? 'Si' : 'No'}</p>
              </div>`
            )}
          </div>
          <p>Comentarios: ${data.comentarios3}</p>
        </div>
      </div>
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
        subject: 'Registro de Visita',
        html: htmlFormat,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          'No se pudo enviar el correo. Vuelve a intentar o contacta a un administrador.',
      });
    }

    //Create record on DB
    const result = await prisma.visitas.create({ data: data });

    if (data.hayOrdenDeCompra) {
      const result2 = await prisma.ordenes.create({
        data: {
          id: data.finVisita + data.numeroDeCliente + Math.random() * 1000,
          asesor: data.asesor,
          cliente: data.numeroDeCliente,
          fecha: data.finVisita,
          distribuidor: data.distribuidor,
          orden: data.ordenDeCompra,
          ordenValidada: false,
        },
      });
    }

    //Return success message if everything correct
    res.status(201).json({ message: 'Informacion enviada. Visita completa.' });
  }

  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
    });
}

export default handler;

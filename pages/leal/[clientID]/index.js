import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { getLeal, getSettings } from '@/lib/prismaDB';
import moment from 'moment';

import { getVisitasConOrdenesPorCliente } from '@/lib/db';

import Dashboard from '@/components/dashboard/dashboard';
import ButtonGroup from '@/components/button-group';
import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import Container from '@/components/layout/container';
import Modal from '@/components/ui/modal';
import ModalPage from '@/components/ui/modal-page';

import classes from './index.module.scss';
import Image from 'next/image';
import BackgroundGradientContainer from '@/components/layout/background-gradient-container';

function TycProgramaFidelizacionHTML() { return (
 <>
  <ol>
    <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
      <p style={{ textAlign: "justify" }}>
        <span style={{ fontSize: "12pt" }}>
          Empresa organizadora del Programa&nbsp;
        </span>
      </p>
    </li>
  </ol>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Upfield México, S. de R.L de C.V. (en adelante “Upfield” y/o el
      “Organizador”) con domicilio ubicado en Boulevard Palmas Hills Lote I y
      II, Piso 20, Huixquilucan de Degollado, Estado de México, C.P. 52763, pone
      a disposición los presentes Términos y Condiciones que regirán el Programa
      de Fidelización de Upfield (en adelante el “Programa”) para clientes (en
      adelante el “Cliente” y/o los “Clientes”) en los mercados de abasto.
      &nbsp;para recompensar la lealtad como clientes y reconocer y premiar el
      compromiso continuo con productos Upfield.
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Para participar en el Programa el Cliente deberá dar lectura integra a los
      siguientes Términos y Condiciones, cumplir totalmente con las bases,
      requisitos y condiciones establecidos por el Organizador, así como también
      someterse a las reglas de participación aquí establecidas, lo cual implica
      el conocimiento y aceptación incondicional y expreso de los mismos.&nbsp;
    </span>
  </p>
  <ol start={2}>
    <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
      <p style={{ textAlign: "justify" }}>
        <span style={{ fontSize: "12pt" }}>Vigencia del Programa</span>
      </p>
    </li>
  </ol>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      El Programa estará vigente a partir del 1 de mayo de 2024 y hasta el 30 de
      septiembre de 2024.&nbsp;
    </span>
  </p>
  <ol start={3}>
    <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
      <p style={{ textAlign: "justify" }}>
        <span style={{ fontSize: "12pt" }}>
          Ámbito territorial del Programa: Valle de México y Puebla
        </span>
      </p>
    </li>
    <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
      <p style={{ textAlign: "justify" }}>
        <span style={{ fontSize: "12pt" }}>
          Productos participantes del Programa&nbsp;
        </span>
      </p>
    </li>
  </ol>
  <ul>
    <li style={{ listStyleType: "disc", fontSize: "12pt" }}>
      <p style={{ textAlign: "justify" }}>
        <span style={{ fontSize: "12pt" }}>
          Iberia 90g, 225g, 500g y 170g&nbsp;
        </span>
      </p>
    </li>
    <li style={{ listStyleType: "disc", fontSize: "12pt" }}>
      <p style={{ textAlign: "justify" }}>
        <span style={{ fontSize: "12pt" }}>Iberia 1Kg.&nbsp;</span>
      </p>
    </li>
    <li style={{ listStyleType: "disc", fontSize: "12pt" }}>
      <p style={{ textAlign: "justify" }}>
        <span style={{ fontSize: "12pt" }}>Primavera 360g. y 110g.&nbsp;</span>
      </p>
    </li>
  </ul>
  <ol start={5}>
    <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
      <p style={{ textAlign: "justify" }}>
        <span style={{ fontSize: "12pt" }}>Detalles del Programa&nbsp;</span>
      </p>
      <ol>
        <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
          <p style={{ textAlign: "justify" }}>
            <span style={{ fontSize: "12pt" }}>
              ¿A quién va dirigido?&nbsp;
            </span>
          </p>
        </li>
        <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
          <p style={{ textAlign: "justify" }}>
            <span style={{ fontSize: "12pt" }}>
              A clientes previamente seleccionados por Upfield dentro de cada
              mercado de abasto, evaluando: potencial de compra, posible alianza
              estratégica, inventario de productos participantes en su negocio y
              valor de compra.
            </span>
          </p>
        </li>
        <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
          <p style={{ textAlign: "justify" }}>
            <span style={{ fontSize: "12pt" }}>
              Inscripción al Programa&nbsp;
            </span>
          </p>
        </li>
      </ol>
    </li>
  </ol>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      El promotor que visite al cliente seleccionado &nbsp; podrá asistirlo en
      los pasos para la inscripción. O bien, el cliente podrá inscribirse al
      Programa en cualquier momento a través del siguiente enlace &nbsp;
    </span>
    <a href="http://www.ruta-perfectapp.com">
      <u>
        <span style={{ color: "#467886", fontSize: "12pt" }}>
          www.ruta-perfectapp.com
        </span>
      </u>
    </a>
    <span style={{ fontSize: "12pt" }}>&nbsp;</span>
  </p>
  <p>
    <br />
  </p>
  <p>
    <br />
  </p>
  <ol start={4}>
    <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
      <p style={{ textAlign: "justify" }}>
        <span style={{ fontSize: "12pt" }}>Mecánica del Programa&nbsp;</span>
      </p>
      <ol>
        <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
          <p style={{ textAlign: "justify" }}>
            <span style={{ fontSize: "12pt" }}>
              Clasificación de Clientes&nbsp;
            </span>
          </p>
        </li>
      </ol>
    </li>
  </ol>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      A &nbsp;partir del 01 de mayo de 2024, &nbsp;(fecha de inicio del
      Programa) se le comunicará al cliente el grupo de cliente al que pertenece
      de conformidad con la siguiente tabla, la cual definelos beneficios a los
      que el Cliente tendrá &nbsp;acceso:&nbsp;
    </span>
  </p>
  <p>
    <br />
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      <span style={{ border: "none" }}>
        <img
          alt="Imagen"
          src="https://lh7-us.googleusercontent.com/docsz/AD_4nXcJXfdVQbovwQecPa9H7s0-p-Ubbczs2A9VxdwDIs9M23I9vUAe81lNQQ766rBBdrI9XxM5E7x56sP2Twr2QW32BewzZ2sw0ahuxGbXV7J_oUcS8P_VV946v2iN5__KRGPynpgN7Q771h1Yx9pij_ytSqou2OK7y4bQ6ae9QQ?key=HDN6mqAzwceX_aRNqQSwRQ"
          width={624}
          height={159}
        />
      </span>
    </span>
  </p>
  <ol start={2}>
    <li style={{ listStyleType: "decimal", fontSize: "12pt" }}>
      <p style={{ textAlign: "justify" }}>
        <span style={{ fontSize: "12pt" }}>Acumulación de puntos&nbsp;</span>
      </p>
    </li>
  </ol>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Los clientes acumularán puntos en la &nbsp;compra de productos
      participantes a partir de 01 de mayo del 2024 &nbsp;y hasta 30 de
      septiembre del 2024 de conformidad con la siguiente tabla de puntos:&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "center" }}>
    <span style={{ fontSize: "12pt" }}>
      <span style={{ border: "none" }}>
        <img
          alt="Imagen"
          src="https://lh7-us.googleusercontent.com/docsz/AD_4nXdBYkQaHEB39PCvxu27jNU4Y1y1pqttOQzaIljbQybEapebWvf-q5wjtE6M1Vue4iXkqBvBl5KLkJc3S6dmqRwxqH9DYzGR7cPSfK7wYpSIhERxTYgqBnW3F7POvll8PjmR4T9dg8cc77m2NyBX8qPE21iR_-tyCPDx0KUNSA?key=HDN6mqAzwceX_aRNqQSwRQ"
          width={342}
          height={232}
        />
      </span>
    </span>
  </p>
  <p>
    <br />
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      • A partir de la compra mínima de 50 cajas (requisito mínimo para canjear
      puntos), Upfield podrá asignar al Cliente los puntos que correspondan
      &nbsp;sobre el total de las cajas compradas durante el mes.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      • La validación del número de cajas compradas será a través del ingreso
      del pedido (s) en la herramienta ruta perfectapp o con evidencia física de
      lo que se compró con algún Cliente. La evidencia física podrá ser
      comprobante físico de compra , factura, o recibo de compra y &nbsp;tendrá
      &nbsp;que ser mostrada &nbsp;al promotor para su validación.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      • Upfield podrá realizar ajustes a la tabla de puntos con el objetivo de
      que el Cliente pueda &nbsp;acumular más puntos por la compra de productos
      participantes. El Cliente podrá consultar la tabla de puntos en&nbsp;
    </span>
    <a href="http://www.ruta-perfectapp.com">
      <u>
        <span style={{ color: "#467886", fontSize: "12pt" }}>
          www.ruta-perfectapp.com
        </span>
      </u>
    </a>
    <span style={{ fontSize: "12pt" }}>
      &nbsp;y a través de los promotores en punto de venta.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      • Si los clientes no realizan compras durante dos meses consecutivos y sus
      compras mínimas no son mayores a 50 cajas por mes, los puntos acumulados
      serán cancelados.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      • Los puntos acumulados no pueden ser transferidos, cedidos o vendidos, y
      solo pertenecen al cliente registrado en el programa de fidelización.
      &nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      • Asimismo, los puntos no pueden ser canjeados por dinero ni por productos
      fuera de la lista de productos participantes establecida • Solo los
      clientes del Grupo 1, Grupo 2 y Grupo 3 participan.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      5.3.3. Multiplicador de puntos&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      • Cada cliente tendrá una cuota de compra mensual determinada por Upfield
      y será comunicada al Cliente durante los primeros 10 (diez) días de cada
      mes.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      • Si el cliente logra cubrir en un 100% &nbsp;el objetivo de compra
      mensual establecido, los puntos asignados por sus compras se multiplicarán
      por dos (2) veces su valor de conformidad con la tabla de puntos señalada
      en el punto 5.3.2. ,
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>5.3.4 Canje de puntos&nbsp;</span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      • A partir del 01 de julio de 2024 y hasta el 30 de septiembre de 2024 los
      &nbsp;clientes podrán canjear los &nbsp;puntos acumulados por los premios
      definidos por Upfield.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Los Clientes podrán consultar la lista de premios disponibles en:&nbsp;
    </span>
    <a href="http://www.ruta-perfectapp.com">
      <u>
        <span style={{ color: "#467886", fontSize: "12pt" }}>
          www.ruta-perfectapp.com
        </span>
      </u>
    </a>
    <span style={{ fontSize: "12pt" }}>
      &nbsp;y a través del promotor. La lista de premios podrá ser actualizada
      periódicamente por Upfield.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>5.3.5. Entrega de premios&nbsp;</span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Los premios serán entregados conforme a los acuerdos establecidos entre el
      promotor y el cliente, dejando por escrito del correo
      hola@estudiosonambulo.com el acuerdo establecido, el acuerdo será: premio
      seleccionado, fecha de entrega, lugar de entrega y responsable que
      recibirá el premio.
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>6. Beneficios adicionales:&nbsp;</span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Los beneficios adicionales estarán sujetos a términos y condiciones
      determinados por Upfield cada mes y serán comunicados al Cliente durante
      los primero 10 días de cada mes&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>7. Promocionales mensuales&nbsp;</span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Los clientes que cubran el 100% del objetivo de compra mensual tendrán
      acceso a promocionales enfocados en incentivar la venta de productos
      Iberia en sus puntos de venta.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Los promocionales serán definidos y comunicados por Upfield al Cliente de
      manera mensual y también podrán ser consultados &nbsp;en&nbsp;
    </span>
    <a href="http://www.ruta-perfectapp.com">
      <u>
        <span style={{ color: "#467886", fontSize: "12pt" }}>
          www.ruta-perfectapp.com
        </span>
      </u>
    </a>
    <span style={{ fontSize: "12pt" }}>
      &nbsp;y a través del promotor. &nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      &nbsp;El objetivo de compra mensual será comunicado en los primeros 10
      días del mes y podrás consultarlo con tu usuario en&nbsp;
    </span>
    <a href="http://www.ruta-perfectapp.com">
      <u>
        <span style={{ color: "#467886", fontSize: "12pt" }}>
          www.ruta-perfectapp.com
        </span>
      </u>
    </a>
    <span style={{ fontSize: "12pt" }}>&nbsp;y con el promotor.</span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Cualquier modificación a la mecánica de promocionales será comunicada
      previamente por Upfield al Cliente.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>&nbsp;8. Restricciones &nbsp;</span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Los puntos acumulados no podrán ser trasladados, cedidos o vendidos y
      pertenecen exclusivamente al cliente registrado en el programa de
      fidelización&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Si el Cliente no &nbsp;cubre el &nbsp;80% del total de las cuotas
      acumuladas de los meses de mayo, junio, julio y agosto &nbsp;no podrá
      &nbsp;canjear &nbsp;los puntos acumulados.
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>9. Propiedad Intelectual</span>
    <strong>
      <span style={{ fontSize: "12pt" }}>&nbsp;</span>
    </strong>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Los elementos (fotos, diseños, logos, marcas, entre otros) de Primavera e
      Iberia, no pueden ser reproducidos, usados, adaptados o comercializados
      sin la aprobación escrita de Upfield (con respecto a su propiedad
      intelectual), sin aprobación expresa y por escrito de representantes
      autorizados de Iberia.
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Los presentes Términos y Condiciones no ceden derecho alguno de propiedad
      intelectual de Primavera e Iberia.
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      10. Políticas comerciales excluidas &nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Las políticas comerciales definidas en precios, comunicación, empaques y
      productos no forman parte de la actividad de fidelización.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      &nbsp;Cualquier cambio a las políticas comerciales o comercialización será
      independiente del programa de fidelización. Agradecemos tu participación
      en nuestro programa de fidelización y esperamos que disfrutes de los
      beneficios y recompensas que ofrecemos como muestra de nuestro
      agradecimiento por tu continua preferencia hacia nuestros productos
      Upfield.&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      Si tienes dudas sobre estos términos y condiciones, no dudes en contactar
      el promotor que estará atendiendo tu negocio, visitar
      www.ruta-perfectapp.com&nbsp;
    </span>
  </p>
  <p style={{ textAlign: "justify" }}>
    <span style={{ fontSize: "12pt" }}>
      ¡Gracias por ser parte de la familia Upfield!
    </span>
  </p>
</>
)}

export default function PanelDeLeal({
  leal,
  promocionesDisponibles,
  session,
  visitasConOrdenes,
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const puntosLeal = leal?.datosLeal ? leal.datosLeal.puntosLeal : 0;
  let badgeUrl = '';

  switch (leal.nivelDeCliente) {
    case 'Platinum':
      badgeUrl = '/images/icons/badges/platinum.svg';
      break;
    case 'Oro':
      badgeUrl = '/images/icons/badges/oro.svg';
      break;
    case 'Plata':
      badgeUrl = '/images/icons/badges/plata.svg';
      break;
    default:
      badgeUrl = '/images/icons/badges/default.svg';
      break;
  }

  return (
    <>
    <BackgroundGradientContainer>
      <Container>
        <header className={classes.header}>
          <div className={classes.nivelBadge}>
            <Image
              src={badgeUrl}
              fill
              alt={`nivel ${leal.nivelDeCliente.toLowerCase()} icon`}
            />
          </div>
          <div>
            <h3>Nivel {leal.nivelDeCliente.toLowerCase()}</h3>
            <p>Puntos leales: {puntosLeal}</p>
          </div>
        </header>
        <main className={classes.main}>
          <div className={classes.hero}>
            <h2>Hola {leal.nombre}</h2>
            <h1>Bienvenido a la experiencia de Los Leales</h1>
            <p>Pronto descubrirás cómo puedes ganar por tu lealtad.</p>
            <p>Acércate a tu asesor.</p>
            {!leal.datosLeal?.nombreDelEncargado && (
              <Button
                href='/leal/actualizar-datos'
                buttonType={BUTTON_TYPE_CLASSES.secondary}
              >
                Actualiza tus datos y gana 3,000 puntos
              </Button>
            )}
          </div>
          <Dashboard
            cuota={leal.cuotaPallets}
            puntos={leal.datosLeal?.puntosLeal}
            promocionesDisponibles={promocionesDisponibles}
            session={session}
            avance={visitasConOrdenes}
          />
          <ButtonGroup
            options={[
              { name: 'Cambiar contraseña', link: '/cambiar-password' },
              {
                name: 'Actualiza tus datos',
                link: '/leal/actualizar-datos',
                buttonType: BUTTON_TYPE_CLASSES.secondary,
              },
              {
                image: '/images/icons/links/whatsapp.svg',
                link: 'https://wa.me/525569293104?text=Soy%20Leal%20y%20necesito%20asistencia',
                buttonType: BUTTON_TYPE_CLASSES.icon,
                tooltip: 'WhatsApp',
                // disabled: true,
              },
              {
                image: '/images/icons/links/mail.svg',
                link: 'mailto:hola@ruta-perfectapp.com?subject=Soy Leal y necesito asistencia',
                newPage: true,
                buttonType: BUTTON_TYPE_CLASSES.icon,
                tooltip: 'e-mail',
                // disabled: true,
              },
              {
                image: '/images/icons/links/encuesta.svg',
                link: '#',
                buttonType: BUTTON_TYPE_CLASSES.icon,
                tooltip: 'Encuesta',
                disabled: true,
              },
            ]}
          />
        </main>
      </Container>
    </BackgroundGradientContainer>
    {isModalOpen && (
      <Modal>
      <ModalPage
        titulo='Términos y Condiciones - Programa de Fidelización de Upfield'
        contenidoHTML={<TycProgramaFidelizacionHTML/>}
        clickHandler={() => setIsModalOpen(false)}
      />
    </Modal>
          )}
</>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { clientID } = context.query;

  if (
    !session ||
    session.user.role !== 'LEAL' ||
    clientID !== session.user.userId
  ) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { promocionesDelMes } = await getSettings('upfield');

  const leal = await getLeal(clientID);
  const nivelDeCliente = leal.nivelDeCliente.toLowerCase();
  const promocionesDisponibles = promocionesDelMes
    .filter((promocion) => {
      const promociones = promocion.nivelDeCliente.includes(nivelDeCliente);
      return promociones;
    })
    .map((promocion) => ({ desc: promocion.promo }));

  const yearMonth = moment().format('YYYY-MM');

  const visitasConOrdenes = await getVisitasConOrdenesPorCliente(yearMonth, [
    clientID,
  ]);

  if (!leal.datosLeal?.firstLoginDate) {
    return {
      redirect: {
        destination: '/cambiar-password',
        permanent: false,
      },
    };
  }

  return {
    props: { session, leal, promocionesDisponibles, visitasConOrdenes },
  };
}

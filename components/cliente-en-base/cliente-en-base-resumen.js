import { useContext } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

import Container from '../layout/container';
import Button from '../button';

import { ClienteEnBaseContext } from '@/store/clienteEnBase.context';
import { StageContext } from '@/store/stage.context';

export default function ClienteEnBaseResumen({ prevHandler }) {
  const { visitaActual, setVisitaActual } = useContext(ClienteEnBaseContext);
  const { currentStage, setCurrentStage } = useContext(StageContext);

  const router = useRouter();

  const submitHandler = function () {
    alert('Order Sent!');
    const finVisita = moment().format();
    //Upload to DB with finVisita
    //Send to mail
    setCurrentStage(0);
    setVisitaActual({});
    router.replace('/');
  };

  return (
    <Container md>
      <h2>Resumen</h2>
      <div>
        <p>Asesor: {visitaActual.asesor}</p>
        <p>Cliente: {visitaActual.numeroDeCliente}</p>
      </div>
      <div>
        <h3>Competidores</h3>
        <p>Número de competidores: {visitaActual.competidores.length}</p>
        {visitaActual.competidores.map((competidor, index) => (
          <div key={index}>
            <h4>{competidor.nombre}</h4>
            <h5>Productos:</h5>
            {competidor.productos.map((producto, index) => (
              <div key={index}>
                <p>Gramos: {producto.gramos}</p>
                <p>Precio: {producto.precio}</p>
                {producto.hasPromo && (
                  <div>
                    <p>Precio con promoción: {producto.precioConPromo}</p>
                    <p>{producto.precioConPromoReason}</p>
                  </div>
                )}
                <p>PoP: {producto.pop ? 'Si' : 'No'}</p>
              </div>
            ))}
            <p>{visitaActual.comentarios1}</p>
          </div>
        ))}
      </div>
      <div>
        <h3>Promociones</h3>
        <div>
          <h4>Promociones del mes</h4>
          {visitaActual.promociones.map((promocion) => (
            <div>
              <h5>{promocion.promo}</h5>
              <p>
                {promocion.implementada ? 'Implementada' : 'NO implementada'}
              </p>
            </div>
          ))}
        </div>
        <div>
          <h4>Cuneta</h4>
          <p>
            Cuenta con inventario:{' '}
            {visitaActual.cuentaConInventario ? 'Si' : 'No'}
          </p>
          {visitaActual.hayOrdenDeCompra ? (
            <div>
              <h5>Orden de compra:</h5>
              {visitaActual.ordenDeCompra.map((item) => (
                <div>
                  <h6>{item.producto}</h6>
                  <p>{item.cajas} cajas</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay orden de compra.</p>
          )}
        </div>
        <p>{visitaActual.comentarios2}</p>
      </div>
      <div>
        <h3>Comunicación</h3>
        <div>
          <h4>Plan de comunicación del mes</h4>
          {visitaActual.planDeComunicacion.map((material) => (
            <div>
              <h5>{material.materiales}</h5>
              <p>Alcance: {material.alcance ? 'Si' : 'No'}</p>
            </div>
          ))}
        </div>
        <div>
          <h4>Implementación Materiales</h4>
          {visitaActual.materiales.map((material) => (
            <div>
              <h5>{material.material}</h5>
              <p>PoP: {material.pop ? 'Si' : 'No'}</p>
            </div>
          ))}
        </div>
        <div>
          <h4>Implementación de Exhibición</h4>
          {visitaActual.exhibiciones.map((exhibicion) => (
            <div>
              <h5>{exhibicion.producto}</h5>
              <p>Periodo negociado: {exhibicion.periodoNegociado}</p>
              <p>PoP: {exhibicion.pop ? 'Si' : 'No'}</p>
            </div>
          ))}
        </div>
        <p>{visitaActual.comentarios3}</p>
      </div>
      <Button type='button' onClick={prevHandler}>
        Anterior
      </Button>
      <Button type='button' onClick={submitHandler}>
        Guardar y enviar
      </Button>
    </Container>
  );
}

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import moment from 'moment';

import Container from '../layout/container';
import Button from '../button';

import {
  setVisitaActual,
  resetStage,
} from '@/store/visitaActual/visitaActual.reducer';
import { selectVisitaActual } from '@/store/visitaActual/visitaActual.selector';
import { useState } from 'react';

export default function ClienteEnBaseResumen({ prevHandler }) {
  const dispatch = useDispatch();
  const visitaActual = useSelector(selectVisitaActual);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  async function uploadVisita(data, finVisita) {
    console.log('upload: ', data);
    const response = await fetch('/api/leal/visita', {
      method: 'POST',
      body: JSON.stringify({ ...data, finVisita: finVisita }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('data: ', data);

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error.message || 'Something went wrong');
    }

    return responseData;
  }

  const submitHandler = async function () {
    setErrorMessage('');
    setSuccessMessage('');

    const finVisita = moment().format();
    console.log('final: ', visitaActual);
    //Upload to DB with finVisita
    try {
      const result = await uploadVisita(visitaActual, finVisita);
      setSuccessMessage(result.message);
    } catch (error) {
      setErrorMessage(
        'Algo salio mal, intenta de nuevo o contacta al administrador.'
      );
      alert(errorMessage);
      return;
    }

    //Send to mail

    alert(successMessage);
    dispatch(resetStage());
    dispatch(setVisitaActual({}));
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
            <div key={promocion.promo}>
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
            <div key={material.materiales}>
              <h5>{material.materiales}</h5>
              <p>Alcance: {material.alcance ? 'Si' : 'No'}</p>
            </div>
          ))}
        </div>
        <div>
          <h4>Implementación Materiales</h4>
          {visitaActual.materiales.map((material) => (
            <div key={material.material}>
              <h5>{material.material}</h5>
              <p>PoP: {material.pop ? 'Si' : 'No'}</p>
            </div>
          ))}
        </div>
        <div>
          <h4>Implementación de Exhibición</h4>
          {visitaActual.exhibiciones.map((exhibicion) => (
            <div key={exhibicion.producto}>
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

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useState } from 'react';
import moment from 'moment';

import Container from '../layout/container';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import Loader from '../ui/loader';

import {
  setVisitaActual,
  resetStage,
} from '@/store/visitaActual/visitaActual.reducer';
import { selectVisitaActual } from '@/store/visitaActual/visitaActual.selector';
import Modal from '../ui/modal';
import ButtonGroup from '../button-group';
import InputGroup from '../forms/input-group';
import FormGroup from '../forms/form-group';

import classes from './cliente-en-base-resumen.module.scss';
import FormControl from '../forms/form-control';
import UploadedImagesGrid from '../blob/uploaded-images-grid';

export default function ClienteEnBaseResumen({ prevHandler }) {
  const dispatch = useDispatch();
  const visitaActual = useSelector(selectVisitaActual);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const router = useRouter();

  async function uploadVisita(data, finVisita) {
    const response = await fetch('/api/leal/visita', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        finVisita: finVisita,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error.message || 'Something went wrong');
    }

    return responseData;
  }

  const submitHandler = async function () {
    setErrorMessage('');
    setSuccessMessage('');
    setIsSending(true);

    const finVisita = moment().format();
    //Upload to DB with finVisita
    try {
      const result = await uploadVisita(visitaActual, finVisita);
      setSuccessMessage(result.message);
    } catch (error) {
      setErrorMessage(
        'Algo salio mal, intenta de nuevo o contacta al administrador.'
      );
      console.log(errorMessage);
      return;
    }

    //Send to mail

    setIsSending(false);
  };

  const handleEndVisita = function () {
    if (errorMessage) {
      setErrorMessage('');
      setIsSending(false);
      return;
    }

    dispatch(resetStage());
    dispatch(setVisitaActual({}));
    setSuccessMessage('');
    router.replace('/login');
  };

  return (
    <div className={classes.resumenContainer}>
      <Container>
        <FormGroup>
          <h2>Resumen</h2>
          <p>Asesor: {visitaActual.asesor}</p>
          <p>Cliente: {visitaActual.numeroDeCliente}</p>
        </FormGroup>
        <FormGroup>
          <h3>Competidores</h3>
          <p>Número de competidores: {visitaActual.competidores.length}</p>
          {visitaActual.competidores.map((competidor, index) => (
            <InputGroup key={index}>
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
            </InputGroup>
          ))}
          <div>
            <h4>Evidencia de precios</h4>
            {visitaActual.evidenciaPrecios &&
            visitaActual.evidenciaPrecios?.length > 0 ? (
              <UploadedImagesGrid
                imagenes={visitaActual.evidenciaPrecios || []}
                visitaActual={visitaActual}
                field='evidenciaPrecios'
              />
            ) : (
              <p className={classes.paragraph}>No hay evidencia de precios</p>
            )}
          </div>
          <p className={classes.paragraph}>
            Comentarios: {visitaActual.comentarios1}
          </p>
        </FormGroup>
        <FormGroup>
          <h3>Promociones</h3>
          <div>
            <h4>Promociones del mes</h4>
            {visitaActual.promociones.length > 0 ? (
              visitaActual.promociones.map((promocion, index) => (
                <div key={index}>
                  <h5>{promocion.promo}</h5>
                  <p>
                    {promocion.implementada
                      ? 'Implementada'
                      : 'NO implementada'}
                  </p>
                </div>
              ))
            ) : (
              <p className={classes.paragraph}>No hay promociones</p>
            )}
          </div>
          <div>
            <h4>Cuneta</h4>
            <p className={classes.paragraph}>
              Cuenta con inventario:{' '}
              {visitaActual.cuentaConInventario ? 'Si' : 'No'}
            </p>
            {visitaActual.cuentaConInventario && (
              <div>
                <h5>Inventario:</h5>
                {visitaActual.inventario.map((item, index) => (
                  <div key={index}>
                    <h6>{item.producto}</h6>
                    <p>{item.cajas} cajas</p>
                  </div>
                ))}
              </div>
            )}
            {visitaActual.hayOrdenDeCompra ? (
              <div>
                <h5>Orden de compra:</h5>
                <p>Distribuidor: {visitaActual.distribuidor}</p>
                {visitaActual.ordenDeCompra.map((item, index) => (
                  <div key={index}>
                    <h6>{item.producto}</h6>
                    <p>{item.cajas} cajas</p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className={classes.paragraph}>No hay orden de compra.</p>
                <p className={classes.paragraph}>
                  ¿Porqué no compra?: {visitaActual.porqueNoCompra}
                </p>
              </div>
            )}
          </div>
          <div>
            <h4>Evidencia de compra</h4>
            {visitaActual.evidenciaCompra &&
            visitaActual.evidenciaCompra?.length > 0 ? (
              <UploadedImagesGrid
                imagenes={visitaActual.evidenciaCompra || []}
                visitaActual={visitaActual}
                field='evidenciaCompra'
              />
            ) : (
              <p className={classes.paragraph}>No hay evidencia de compra</p>
            )}
          </div>
          <p className={classes.paragraph}>
            Comentarios: {visitaActual.comentarios2}
          </p>
        </FormGroup>
        <FormGroup>
          <h3>Comunicación</h3>
          <div>
            <h4>Plan de comunicación del mes</h4>
            {visitaActual.planDeComunicacion.map((material, index) => (
              <div key={index}>
                <h5>{material.materiales}</h5>
                <p>Alcance: {material.alcance ? 'Si' : 'No'}</p>
              </div>
            ))}
          </div>
          <div>
            <h4>Implementación Materiales</h4>
            {visitaActual.materiales.map((material, index) => (
              <div key={index}>
                <h5>{material.material}</h5>
                <p>PoP: {material.pop ? 'Si' : 'No'}</p>
              </div>
            ))}
          </div>
          <div>
            <h4>Implementación de Exhibición</h4>
            {visitaActual.exhibiciones.map((exhibicion, index) => (
              <div key={index}>
                <h5>{exhibicion.producto}</h5>
                <p>Periodo negociado: {exhibicion.periodoNegociado}</p>
                <p>PoP: {exhibicion.pop ? 'Si' : 'No'}</p>
              </div>
            ))}
          </div>
          <div>
            <h4>Evidencia de comunicación</h4>
            {visitaActual.evidenciaCompra &&
            visitaActual.evidenciaComunicacion?.length > 0 ? (
              <UploadedImagesGrid
                imagenes={visitaActual.evidenciaComunicacion || []}
                visitaActual={visitaActual}
                field='evidenciaComunicacion'
              />
            ) : (
              <p className={classes.paragraph}>
                No hay evidencia de comunicación
              </p>
            )}
          </div>
          <p className={classes.paragraph}>
            Comentarios: {visitaActual.comentarios3}
          </p>
        </FormGroup>
        <ButtonGroup
          options={[
            {
              name: 'Anterior',
              onClick: prevHandler,
              type: 'button',
              buttonType: 'secondary',
            },
            {
              name: 'Guardar y enviar',
              buttonType: `${
                isSending
                  ? BUTTON_TYPE_CLASSES.disabled
                  : BUTTON_TYPE_CLASSES.base
              }`,
              type: 'button',
              onClick: submitHandler,
            },
          ]}
        />
        {isSending && <Loader />}
      </Container>
      {(successMessage || errorMessage) && (
        <Modal>
          <p style={{ marginBottom: '1rem' }}>
            {successMessage || errorMessage}
          </p>
          <Button type='button' onClick={handleEndVisita}>
            Ok
          </Button>
        </Modal>
      )}
    </div>
  );
}

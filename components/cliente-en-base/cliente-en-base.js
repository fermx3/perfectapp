import { useState, useContext } from 'react';
import FormControl from '../forms/form-control';

import { ClienteEnBaseContext } from '@/store/clienteEnBase.context';
import Button from '../button';
import InfoMessage from '../ui/info-message';
import FormSection from '../forms/form-section';
import FormGroup from '../forms/form-group';

const getNoDeCompetidoresNumber = function (endNumber) {
  const competidoresNumber = [];
  for (let i = 1; i <= endNumber; i++) {
    competidoresNumber.push(i);
  }
  return competidoresNumber;
};

export default function ClienteEnBase1({ submitHandler }) {
  const { visitaActual, setVisitaActual } = useContext(ClienteEnBaseContext);

  const [competidores, setCompetidores] = useState(
    visitaActual.competidores ? visitaActual.competidores : []
  );

  const [clienteEnBase, setClienteEnBase] = useState({
    noDeCompetidores: visitaActual.noDeCompetidores,
    competidores: competidores,
    comentarios1: visitaActual.comentarios1,
  });

  const [noDeProductos, setNoDeProductos] = useState(1);

  console.log('clienteEnBase: ', clienteEnBase);
  console.log('visitaActual: ', visitaActual);

  return (
    <form onSubmit={(event) => submitHandler(event, clienteEnBase)}>
      <FormSection titulo='Assessment Producto - Empaque - Precio'>
        <FormControl
          type='select'
          label='Numero de competidores'
          options={getNoDeCompetidoresNumber(10)}
          defaultOption={
            visitaActual.noDeCompetidores
              ? visitaActual.noDeCompetidores
              : 'Selecciona un número'
          }
          value={clienteEnBase.noDeCompetidores}
          onChange={(e) => {
            setClienteEnBase({
              ...clienteEnBase,
              noDeCompetidores: Number(e.target.value),
              competidores: [],
            });
            setCompetidores([]);
            setVisitaActual({ ...visitaActual, competidores: [] });
          }}
        />
        {clienteEnBase.noDeCompetidores &&
          [...Array(Number(clienteEnBase.noDeCompetidores))].map(
            (value, index) => (
              <FormGroup titulo={`Competidor ${index + 1}`}>
                <FormControl
                  type='select'
                  id={`competidor${index + 1}`}
                  defaultOption={
                    visitaActual.competidores
                      ? visitaActual.competidores[index]
                        ? visitaActual.competidores[index].competidor
                        : 'Nombre del competidor'
                      : 'Nombre del competidor'
                  }
                  options={['Chipilo', 'Chilchota', 'Lala', 'Otra']}
                  key={index}
                  value={clienteEnBase.competidores[index]}
                  onChange={(e) => {
                    const newArr = [...competidores];
                    newArr[index] = { competidor: e.target.value };
                    setCompetidores(newArr);
                    setClienteEnBase({
                      ...clienteEnBase,
                      competidores: newArr,
                    });
                  }}
                />
                {clienteEnBase.competidores[index] &&
                  [...Array(Number(noDeProductos))].map((value, producto) => {
                    return (
                      <div>
                        <h4>Producto {producto + 1}</h4>
                        <FormControl
                          type='number'
                          id='competidorGramos'
                          label='Gramos'
                          value={
                            clienteEnBase.competidores[index].productos
                              ? clienteEnBase.competidores[index].productos[
                                  producto
                                ].gramos
                              : null
                          }
                          onChange={(e) => {
                            const newArr = [...competidores];
                            // newArr[index].productos[producto].gramos =
                            //   e.target.value;
                            newArr[index] = {
                              ...newArr[index],
                              productos: [
                                {
                                  ...newArr[index].productos[producto],
                                  gramos: e.target.value,
                                },
                              ],
                            };
                            console.log({
                              ...newArr[index].productos[producto],
                            });
                            setCompetidores(newArr);
                            setClienteEnBase({
                              ...clienteEnBase,
                              competidores: newArr,
                            });
                          }}
                        />
                        <FormControl
                          type='number'
                          id='precioConPromo'
                          label='Precio con Promo'
                          value={
                            clienteEnBase.competidores[index].productos
                              ? clienteEnBase.competidores[index].productos[
                                  producto
                                ].precioConPromo
                              : null
                          }
                          onChange={(e) => {
                            const newArr = [...competidores];
                            // newArr[index].productos[producto].precioConPromo =
                            //   e.target.value;
                            newArr[index] = {
                              ...newArr[index],
                              productos: [
                                {
                                  ...newArr[index].productos[producto],
                                  precioConPromo: e.target.value,
                                },
                              ],
                            };
                            setCompetidores(newArr);
                            setClienteEnBase({
                              ...clienteEnBase,
                              competidores: newArr,
                            });
                          }}
                        />
                        <FormControl
                          type='number'
                          id='precioRegular'
                          label='Precio Regular'
                          value={
                            clienteEnBase.competidores[index].productos
                              ? clienteEnBase.competidores[index].productos[
                                  producto
                                ].precio
                              : null
                          }
                          onChange={(e) => {
                            const newArr = [...competidores];
                            // newArr[index].productos[producto].gramos =
                            //   e.target.value;
                            newArr[index] = {
                              ...newArr[index],
                              productos: [
                                {
                                  ...newArr[index].productos[producto],
                                  precio: e.target.value,
                                },
                              ],
                            };
                            setCompetidores(newArr);
                            setClienteEnBase({
                              ...clienteEnBase,
                              competidores: newArr,
                            });
                          }}
                        />
                        <Button
                          type='button'
                          onClick={() => {
                            setNoDeProductos(noDeProductos + 1);
                          }}
                        >
                          +
                        </Button>
                        {producto >= 1 && (
                          <Button
                            type='button'
                            onClick={() => setNoDeProductos(noDeProductos - 1)}
                          >
                            -
                          </Button>
                        )}
                      </div>
                    );
                  })}
              </FormGroup>
            )
          )}
      </FormSection>
      <FormSection titulo='Assessment Promoción - Propuesta'>
        {clienteEnBase.noDeCompetidores &&
          clienteEnBase.competidores.map((competidor) => {
            return <FormGroup titulo={competidor.competidor}></FormGroup>;
          })}
      </FormSection>
      <InfoMessage
        titulo='Informacion de Categoria'
        contenido='Aquí va el contenido de la noticia importante.'
      />
      <FormControl
        type='textarea'
        label='Comentarios'
        value={clienteEnBase.comentarios1}
        onChange={(e) =>
          setClienteEnBase({ ...clienteEnBase, comentarios1: e.target.value })
        }
      />
      <Button>Siguiente</Button>
    </form>
  );
}

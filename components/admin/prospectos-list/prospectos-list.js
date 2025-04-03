import Button, { BUTTON_TYPE_CLASSES } from '@/components/button';
import classes from './prospectos-list.module.scss';
import { useState } from 'react';
import ValidarProspecto from './validar-prospecto';

export default function ProspectosList({ prospectos, zonas, skus }) {
  const [prospecto, setProspecto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (index) => {
    const prospecto = prospectos[index];
    setProspecto(prospecto);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Prospectos sin validar</h2>
      <ul className={classes.prospectos}>
        {prospectos.map((prospecto, index) => (
          <li key={index} className={classes.prospecto}>
            <div>
              <h3>{prospecto.nombre}</h3>
              <p>Canal: {prospecto.canal}</p>
              <p>Central: {prospecto.central}</p>
              <p>Región: {prospecto.region}</p>
              <p>Ubicación: {prospecto.ubicacion}</p>
              {prospecto.grupo && <p>Grupo: {prospecto.grupo}</p>}
              {prospecto.nivelDeCliente && (
                <p>Nivel de cliente: {prospecto.nivelDeCliente}</p>
              )}
              <p>
                Comentarios:{' '}
                {prospecto.comentarios ? prospecto.comentarios : 'Ninguno'}
              </p>
            </div>
            <Button
              type='button'
              buttonType={BUTTON_TYPE_CLASSES.secondary}
              onClick={() => handleClick(index)}
            >
              Validar
            </Button>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <ValidarProspecto
          prospecto={prospecto}
          handleClose={closeModal}
          zonas={zonas}
          skus={skus}
        />
      )}
    </div>
  );
}

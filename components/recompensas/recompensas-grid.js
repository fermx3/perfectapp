import { useState } from 'react';
import Recompensa from './recompensa';

import classes from './recompensas-grid.module.scss';
import FormControl from '../forms/form-control';
import InputGroup from '../forms/input-group';
import { nivelesDeLeales } from '@/lib/schemas/schemas';
import SelectInput from '../forms/select-input';
import FormSection from '../forms/form-section';
import Button, { BUTTON_TYPE_CLASSES } from '../button';

export default function RecompensasGrid({ recompensas, role, featured }) {
  if (featured) {
    const recompensasDestacadas = recompensas.slice(0, 3);
    return (
      <div className={classes.section}>
        <h2>Recompensas Destacadas</h2>
        <div className={classes.grid}>
          {recompensasDestacadas.length !== 0 ? (
            recompensasDestacadas.map((recompensa) => (
              <Recompensa
                key={recompensa._id}
                recompensa={recompensa}
                role={role}
              />
            ))
          ) : (
            <p>No se encontraron recompensas</p>
          )}
        </div>
      </div>
    );
  }

  const [recompensasFiltradas, setRecompensasFiltradas] = useState(recompensas);

  const getMaximumPuntos = () => {
    let max = 0;
    recompensas.forEach((recompensa) => {
      if (recompensa.valorPuntos > max) {
        max = recompensa.valorPuntos;
      }
    });
    return max;
  };

  const maximumPuntos = getMaximumPuntos();

  const [searchValue, setSearchValue] = useState('');
  const [minMaxValues, setMinMaxValues] = useState({
    min: 0,
    max: maximumPuntos,
  });
  const [nivelSeleccionado, setNivelSeleccionado] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    const recompensasFiltradas = recompensas.filter((recompensa) =>
      recompensa.nombre.toLowerCase().includes(value)
    );
    setRecompensasFiltradas(recompensasFiltradas);
  };

  const handleSearchByPuntos = (e, field) => {
    const value = e.target.value;
    const newMinMaxValues = { ...minMaxValues, [field]: value };
    setMinMaxValues(newMinMaxValues);

    const recompensasFiltradas = recompensas.filter(
      (recompensa) =>
        recompensa.valorPuntos >= newMinMaxValues.min &&
        recompensa.valorPuntos <= newMinMaxValues.max
    );
    setRecompensasFiltradas(recompensasFiltradas);
  };

  const handleSearchByNivel = (e) => {
    const value = e.target.value;
    setNivelSeleccionado(value);

    const recompensasFiltradas = recompensas.filter((recompensa) =>
      recompensa.nivelRequerido.includes(value.toLowerCase())
    );
    setRecompensasFiltradas(recompensasFiltradas);
  };

  const resetFilters = () => {
    setRecompensasFiltradas(recompensas);
    setSearchValue('');
    setMinMaxValues({ min: 0, max: maximumPuntos });
    setNivelSeleccionado('');
  };

  return (
    <div className={classes.section}>
      <h2>Recompensas Leales</h2>
      <div className={classes.grid}>
        {recompensasFiltradas.length !== 0 ? (
          recompensasFiltradas.map((recompensa) => (
            <Recompensa
              key={recompensa._id}
              recompensa={recompensa}
              role={role}
            />
          ))
        ) : (
          <p>No se encontraron recompensas</p>
        )}
      </div>

      <div className={classes.filter}>
        <FormSection titulo='Búsqueda por nombre:'>
          <FormControl>
            <input
              type='search'
              placeholder='Buscar recompensa'
              onChange={handleSearch}
              value={searchValue}
            />
          </FormControl>
        </FormSection>
        <FormSection titulo='Filtrar por puntos:'>
          <InputGroup>
            <FormControl
              label='Puntos minimos:'
              error={
                minMaxValues.min > minMaxValues.max
                  ? 'Este valor no puede ser más grande que los puntos máximos'
                  : null
              }
            >
              <input
                type='number'
                min='0'
                max={maximumPuntos}
                step='100'
                value={minMaxValues.min}
                onChange={(e) => handleSearchByPuntos(e, 'min')}
              />
            </FormControl>
            <FormControl
              label='Puntos máximos:'
              error={
                minMaxValues.min > minMaxValues.max
                  ? 'Este valor no puede ser más pequeño que los puntos minimos'
                  : null
              }
            >
              <input
                type='number'
                min='0'
                max={maximumPuntos}
                step='100'
                value={minMaxValues.max}
                onChange={(e) => handleSearchByPuntos(e, 'max')}
              />
            </FormControl>
          </InputGroup>
        </FormSection>
        {role === 'ASESOR' && (
          <FormSection titulo='Filtrar por nivel:'>
            <InputGroup>
              <FormControl label='Buscar por nivel:'>
                <SelectInput
                  options={nivelesDeLeales}
                  value={nivelSeleccionado}
                  defaultValue={'Selecciona un nivel'}
                  onChange={(e) => handleSearchByNivel(e)}
                />
              </FormControl>
            </InputGroup>
          </FormSection>
        )}
        <InputGroup>
          <FormControl>
            <Button
              buttonType={BUTTON_TYPE_CLASSES.secondary}
              onClick={resetFilters}
            >
              Limpiar filtros
            </Button>
          </FormControl>
        </InputGroup>
      </div>
    </div>
  );
}

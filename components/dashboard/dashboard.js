import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import classes from './dashboard.module.scss';

export default function Dashboard({
  cuota,
  puntos,
  promocionesDisponibles,
  avance,
  session,
  clientesQueCompraron,
  clientesTotales,
  valorDePuntos,
  skus,
}) {
  const cuotaTotal = cuota
    ? Object.values(cuota).reduce((a, b) => Number(a) + Number(b), 0)
    : 0;

  function sum(arr) {
    return arr.reduce((a, b) => a + b.cajas, 0);
  }

  const avanceTotal = sum(avance);

  const getAvanceTotalPorcentaje = function () {
    if (cuotaTotal === 0) return 0;
    return ((avanceTotal / cuotaTotal) * 100).toFixed(2);
  };

  const avanceTotalPorcentaje = getAvanceTotalPorcentaje();

  // const avanceTotal = avance ? avance.reduce((a, b) => a + b.cajas, 0) : 0;

  // const total1kg = avance
  //   ? avance
  //       .filter((item) => item.producto === 'Iberia 1Kg')
  //       .reduce((a, b) => a + b.cajas, 0)
  //   : 0;

  // const total90g = avance
  //   ? avance
  //       .filter((item) => item.producto === 'Iberia 90g')
  //       .reduce((a, b) => a + b.cajas, 0)
  //   : 0;

  // const total225g = avance
  //   ? avance
  //       .filter((item) => item.producto === 'Iberia 225g')
  //       .reduce((a, b) => a + b.cajas, 0)
  //   : 0;

  const efectividad = clientesTotales
    ? ((clientesQueCompraron.length / clientesTotales.length) * 100).toFixed(2)
    : undefined;

  const percentage = 66;
  // const avanceTotal = avance[0].ordenesDeCompra.map((i) => <p>{i.cajas}</p>);
  // const skus = cuota ? Object.keys(cuota).length : 0;

  return (
    <>
      {/* {session.user.role === 'LEAL' ? ( */}
      <div className={classes.dashboardLeal}>
        <div className={classes.estadisticaContainer}>
          <div className={classes.cuadro}>
            <p>{cuotaTotal} cajas</p>
            <ul>
              {cuota ? (
                Object.keys(cuota)
                  .sort()
                  .map((key, i) => {
                    return (
                      cuota[key] !== 0 && (
                        <li key={i}>
                          {skus.find((sku) => sku.sku === key)?.producto || key}
                          : {cuota[key]}
                        </li>
                      )
                    );
                  })
              ) : (
                <strong>No hay cuota asignada</strong>
              )}
            </ul>
          </div>
          <h5>Cuota del mes</h5>
        </div>
        <div className={classes.estadisticaContainer}>
          <div className={classes.cuadro}>
            <p>{avanceTotal ? avanceTotal : 0} cajas</p>
            <ul>
              {avance.map((id, i) => {
                return (
                  <li key={i}>
                    {skus.find((sku) => sku.sku === id._id)?.producto ||
                      'error'}
                    : {id.cajas}
                  </li>
                );
              })}
            </ul>
            {/* <p>{avanceTotalPorcentaje()} %</p> */}
          </div>
          <h5>Avance de compra</h5>
        </div>
        <div className={classes.estadisticaContainerSM}>
          <div className={classes.cuadro}>
            <CircularProgressbar
              value={avanceTotalPorcentaje}
              text={`${avanceTotalPorcentaje}%`}
              circleRatio={0.75}
              styles={buildStyles({
                rotation: 1 / 2 + 1 / 8,
                strokeLinecap: 'butt',
                trailColor: '#eee',
                pathColor: '#3171f1',
                textColor: 'black',
                pathTransitionDuration: 1,
                textSize: '1rem',
              })}
            />
          </div>
          <h5>% de avance de compra</h5>
        </div>
        {valorDePuntos ? (
          <div className={classes.estadisticaContainer}>
            <div className={classes.cuadro}>
              <ul>
                {Object.keys(valorDePuntos).map((key, i) => {
                  return (
                    <li key={i}>
                      {skus.find((sku) => sku.sku === key)?.producto || key}:{' '}
                      {valorDePuntos[key] == 1
                        ? `${valorDePuntos[key]} punto`
                        : `${valorDePuntos[key]} puntos`}{' '}
                      x caja
                    </li>
                  );
                })}
              </ul>
            </div>
            <h5>Valor de puntos</h5>
          </div>
        ) : (
          <div className={classes.estadisticaContainer}>
            <div className={classes.cuadro}>
              {promocionesDisponibles.length !== 0 ? (
                <ul>
                  {promocionesDisponibles.map((promo, index) => (
                    <li key={index}>{promo.desc}</li>
                  ))}
                </ul>
              ) : (
                <p>No hay promociones.</p>
              )}
            </div>
            <h5>Promociones del mes</h5>
          </div>
        )}
        {puntos !== undefined && session.user.role !== 'LEAL' && (
          <div className={classes.estadisticaContainer}>
            <div className={classes.cuadro}>
              <p>{puntos}</p>
            </div>
            <h5>Puntos Leales</h5>
          </div>
        )}
        {clientesTotales && (
          <div className={classes.estadisticaContainerSM}>
            <div className={classes.cuadro}>
              <p>{clientesTotales.length}</p>
            </div>
            <h5>Clientes totales</h5>
          </div>
        )}
        {clientesQueCompraron && (
          <div className={classes.estadisticaContainerSM}>
            <div className={classes.cuadro}>
              <p>{clientesQueCompraron.length}</p>
            </div>
            <h5>Clientes que compraron</h5>
          </div>
        )}
        {efectividad !== undefined && (
          <div className={classes.estadisticaContainerSM}>
            <div className={classes.cuadro}>
              <CircularProgressbar
                value={efectividad}
                text={`${efectividad}%`}
                circleRatio={0.75}
                styles={buildStyles({
                  rotation: 1 / 2 + 1 / 8,
                  strokeLinecap: 'butt',
                  trailColor: '#eee',
                  pathColor: '#3171f1',
                  textColor: 'black',
                  pathTransitionDuration: 1,
                  textSize: '1rem',
                })}
              />
            </div>
            <h5>Efectividad</h5>
          </div>
        )}
      </div>
    </>
  );
}

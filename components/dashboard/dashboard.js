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
}) {
  const cuotaTotal = cuota
    ? Object.values(cuota).reduce((a, b) => Number(a) + Number(b), 0)
    : 0;

  function sum(obj) {
    return Object.keys(obj).reduce(
      (sum, key) => sum + parseFloat(obj[key] || 0),
      0
    );
  }

  const skuTitles = {
    iberia90g: 'Iberia 90g',
    iberia225g: 'Iberia 225g',
    iberia1Kg: 'Iberia 1Kg',
    iberia500g: 'Iberia 500g',
  };

  const cajasXPallet = {
    iberia90g: 405,
    iberia225g: 400,
    iberia1Kg: 112,
  };

  const avanceTotal = sum(avance);

  const palletsToCajas = (pallets) => {
    return {
      iberia90g: pallets.iberia90g * cajasXPallet.iberia90g || 0,
      iberia225g: pallets.iberia225g * cajasXPallet.iberia225g || 0,
      iberia1Kg: pallets.iberia1Kg * cajasXPallet.iberia1Kg || 0,
    };
  };

  const cajasToPallets = (cajas) => {
    return {
      iberia90g: (cajas.iberia90g / cajasXPallet.iberia90g).toFixed(2) || 0,
      iberia225g: (cajas.iberia225g / cajasXPallet.iberia225g).toFixed(2) || 0,
      iberia1Kg: (cajas.iberia1Kg / cajasXPallet.iberia1Kg).toFixed(2) || 0,
    };
  };

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
              {Object.keys(cuota).map((key, i) => {
                return (
                  <li key={i}>
                    {skuTitles[key]}: {cuota[key]}
                  </li>
                );
              })}
            </ul>
          </div>
          <h5>Cuota del mes</h5>
        </div>
        <div className={classes.estadisticaContainer}>
          <div className={classes.cuadro}>
            <p>{avanceTotal ? avanceTotal : 0} cajas</p>
            <ul>
              <li>Iberia 1Kg: {avance.iberia1Kg ? avance.iberia1Kg : 0}</li>
              <li>Iberia 225g: {avance.iberia225g ? avance.iberia225g : 0}</li>
              <li>Iberia 90g: {avance.iberia90g ? avance.iberia90g : 0}</li>
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
                      {skuTitles[key]}:{' '}
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

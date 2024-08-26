import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL;

export async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.DATABASE_URL);

  return client;
}

export async function getLealesAsignados(zonas, empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const lealesAsignados = await users
    .aggregate([
      {
        $project: {
          _id: 0,
          userId: 1,
          userInfo: 1,
          role: 1,
          empresa: 1,
        },
      },
      {
        $match: {
          $and: [
            {
              role: 'LEAL',
            },
            {
              empresa,
            },
            {
              'userInfo.zona': {
                $in: zonas,
              },
            },
          ],
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$$ROOT', '$userInfo'],
          },
        },
      },
      {
        $unset: 'role',
      },
    ])
    .toArray();

  // const query = {
  //   $and: [{ role: 'LEAL' }, { 'userInfo.zona': { $in: ['norte'] } }],
  // };

  // const selectedFields = { _id: 0, userId: 1, userInfo: 1 };

  // const lealesAsignados = await leales
  //   .find(query)
  //   .project(selectedFields)
  //   .toArray();

  // Print the ID of the inserted document
  // res.status(201).json({ message: 'Listo! Ya estás suscrito!' });
  await client.close();
  return lealesAsignados;
}

export async function getUsuario(userID) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const query = { userId: userID };

  const selectedFields = {
    projection: { _id: 0, userId: 1, userInfo: 1, role: 1 },
  };

  const usuario = await users.findOne(query, selectedFields);

  // Print the ID of the inserted document
  await client.close();
  return usuario;
}

// export async function getAllVisitas() {
//   const client = new MongoClient(uri);
//   // Connect to the database and access its collection
//   const database = client.db('perfectapp');
//   const visitas = database.collection('visitas');

//   const allVisitas = await visitas.aggregate([
//     {
//       $unwind: {
//         path: '$competidores',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $unwind: {
//         path: '$competidores.productos',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $unwind: {
//         path: '$ordenDeCompra',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//   ]);

//   // Print the ID of the inserted document
//   await client.close();
//   return allVisitas;
// }

export async function getAvisoDePrivacidad() {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const config = database.collection('config');

  const selectedFields = {
    projection: { _id: 0, avisoDePrivacidad: 1 },
  };

  const avisoDePrivacidad = await config.findOne({}, selectedFields);

  // Print the ID of the inserted document
  await client.close();
  return avisoDePrivacidad;
}

export async function getTerminosYCondiciones() {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const config = database.collection('config');

  const selectedFields = {
    projection: { _id: 0, terminosYCondiciones: 1 },
  };

  const terminosYCondiciones = await config.findOne({}, selectedFields);

  // Print the ID of the inserted document
  await client.close();
  return terminosYCondiciones;
}

// export async function getVisitasConOrdenesPorCliente(fecha, clientId) {
//   const client = new MongoClient(uri);

//   // Connect to the database and access its collection
//   const database = client.db('perfectapp');
//   const visitas = database.collection('visitas');

//   const visitasConOrdenes = await visitas
//     .aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               inicioVisita: new RegExp(fecha),
//             },
//             {
//               numeroDeCliente: { $in: clientId },
//             },
//             {
//               hayOrdenDeCompra: true,
//             },
//           ],
//         },
//       },
//       {
//         $unwind: {
//           path: '$ordenDeCompra',
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           ordenesDeCompra: {
//             $push: '$ordenDeCompra',
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//         },
//       },
//     ])
//     .toArray();

//   // Print the ID of the inserted document
//   await client.close();
//   return visitasConOrdenes[0]?.ordenesDeCompra || [];
// }

export async function getCuotaTotals(zonas, empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const cuotaTotals = await users
    .aggregate([
      {
        $match: {
          'userInfo.zona': {
            $in: zonas,
          },
          empresa,
        },
      },
      {
        $project: {
          cuotaPallets: 1,
          _id: 0,
        },
      },
      {
        $project: {
          cuota: {
            $objectToArray: '$cuotaPallets',
          },
        },
      },
      {
        $unwind: {
          path: '$cuota',
        },
      },
      {
        $group: {
          _id: '$cuota.k',
          cajas: {
            $sum: {
              $toDouble: '$cuota.v',
            },
          },
        },
      },
      {
        $addFields: {
          root: {
            $arrayToObject: [[{ k: '$_id', v: '$cajas' }]],
          },
        },
      },
      {
        $group: {
          _id: null,
          root: { $mergeObjects: '$root' },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$root'],
          },
        },
      },
    ])
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return cuotaTotals[0];
}

export async function getUserIdsFromAGivenZonas(zonas, empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const userIds = await users
    .aggregate([
      {
        $match: {
          'userInfo.zona': { $in: zonas },
          empresa,
        },
      },
      {
        $group: {
          _id: 0,
          userIds: {
            $push: '$userId',
          },
        },
      },
    ])
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return userIds[0].userIds;
}

export async function getUserIdsFromGivenZonasThatPurchased(
  fecha,
  zonaAsignadaArr,
  empresa
) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const collection = database.collection('users');

  const userIds = await collection
    .aggregate([
      {
        $match: {
          'userInfo.zona': {
            $in: zonaAsignadaArr,
          },
          empresa,
        },
      },
      {
        $project: {
          ventas: 1,
        },
      },
      {
        $unwind: {
          path: '$ventas',
        },
      },
      {
        $match: {
          'ventas.fecha': new RegExp(fecha),
        },
      },
      {
        $group: {
          _id: null,
          idsConVentas: {
            $addToSet: '$_id',
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ])
    .toArray();

  console.log('userIds', userIds);
  // Print the ID of the inserted document
  await client.close();
  return userIds[0]?.idsConVentas || [];
}

export async function getMensajesAsesores(empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const mensajesAsesores = database.collection('mensajesAsesores');

  const mensajesRaw = await mensajesAsesores.find({ empresa }).toArray();

  const mensajes = {};

  mensajesRaw.map((mensaje) => {
    mensajes[mensaje.tipo] = {
      titulo: mensaje.titulo,
      contenido: mensaje.contenido,
    };
  });

  // Print the ID of the inserted document
  await client.close();
  return mensajes;
}

export async function getOrdenesSinValidar(empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const ordenes = database.collection('ordenes');

  const ordenesSinValidar = await ordenes
    .aggregate([
      {
        $match: {
          ordenValidada: false,
          empresa,
        },
      },
      {
        $sort: {
          fecha: -1,
        },
      },
    ])
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return ordenesSinValidar;
}

export async function getAvanceDeCuota(userId, fecha) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const avanceDeCuota = await users
    .aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $project: {
          ventas: 1,
          _id: 0,
        },
      },
      {
        $unwind: {
          path: '$ventas',
        },
      },
      {
        $match: {
          'ventas.fecha': new RegExp(fecha),
        },
      },
      {
        $project: {
          orden: {
            $objectToArray: '$ventas.orden',
          },
        },
      },
      {
        $unwind: {
          path: '$orden',
        },
      },
      {
        $group: {
          _id: '$orden.k',
          cajas: {
            $sum: '$orden.v',
          },
        },
      },
    ])
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return avanceDeCuota || [];
}

export async function getAvanceDeCuotaByZona(zonasArr, fecha) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const avanceDeCuota = await users
    .aggregate([
      {
        $match: {
          'userInfo.zona': { $in: zonasArr },
        },
      },
      {
        $project: {
          ventas: 1,
          _id: 0,
        },
      },
      {
        $unwind: {
          path: '$ventas',
        },
      },
      {
        $match: {
          'ventas.fecha': new RegExp(fecha),
        },
      },
      {
        $project: {
          orden: {
            $objectToArray: '$ventas.orden',
          },
        },
      },
      {
        $unwind: {
          path: '$orden',
        },
      },
      {
        $group: {
          _id: '$orden.k',
          cajas: {
            $sum: '$orden.v',
          },
        },
      },
    ])
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return avanceDeCuota || [];
}

export async function getRecompensasLeal(empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const collection = database.collection('recompensasLeal');

  const recompensasLeal = await collection
    .find({ empresa })
    .sort({ valorPuntos: -1 })
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return recompensasLeal;
}

export async function getRecompensasByNivel(nivel, empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const collection = database.collection('recompensasLeal');

  const recompensasLeal = await collection
    .find({ nivelRequerido: nivel, empresa })
    .sort({ valorPuntos: -1 })
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return recompensasLeal;
}

export async function getBannersLeales(empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const collection = database.collection('bannersLeales');

  const bannersLeales = await collection.find({ empresa }).toArray();

  // Print the ID of the inserted document
  await client.close();
  return bannersLeales;
}

export async function getUserNamesByRole(role) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const collection = database.collection('users');

  const userNames = await collection
    .find({ role })
    .project({
      _id: 0,
      userId: 1,
      nombre: '$userInfo.nombre',
    })
    .toArray();

  // Print the ID of the inserted document
  await client.close();
  return userNames;
}

export async function getLealesQueRebasaronCuota(month, empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const lealesQueRebasaronCuota = await users
    .aggregate([
      {
        $match: {
          role: 'LEAL',
          empresa,
          ventas: {
            $exists: true,
          },
          'ventas.fecha': new RegExp(month),
        },
      },
      {
        $project: {
          cuotaPallets: 1,
          ventas: {
            $filter: {
              input: '$ventas',
              as: 'v',
              cond: {
                $regexMatch: {
                  input: '$$v.fecha',
                  regex: new RegExp(month),
                },
              },
            },
          },
          valorDePuntos: 1,
          mesesCuotaRebasada: 1,
          mes: month,
        },
      },
      {
        $addFields: {
          'totalVentas.iberia90g': {
            $reduce: {
              input: '$ventas.orden.iberia90g',
              initialValue: {
                cajas: 0,
                puntos: 0,
                cuotaSuperada: false,
              },
              in: {
                cajas: {
                  $add: ['$$value.cajas', '$$this'],
                },
                puntos: {
                  $multiply: [
                    '$$this',
                    {
                      $toInt: '$valorDePuntos.iberia90g',
                    },
                  ],
                },
                cuotaSuperada: {
                  $gte: [
                    '$$this',
                    {
                      $toInt: '$cuotaPallets.iberia90g',
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          'totalVentas.iberia225g': {
            $reduce: {
              input: '$ventas.orden.iberia225g',
              initialValue: {
                cajas: 0,
                puntos: 0,
                cuotaSuperada: false,
              },
              in: {
                cajas: {
                  $add: ['$$value.cajas', '$$this'],
                },
                puntos: {
                  $multiply: [
                    '$$this',
                    {
                      $toInt: '$valorDePuntos.iberia225g',
                    },
                  ],
                },
                cuotaSuperada: {
                  $gte: [
                    '$$this',
                    {
                      $toInt: '$cuotaPallets.iberia225g',
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          'totalVentas.iberia1Kg': {
            $reduce: {
              input: '$ventas.orden.iberia1Kg',
              initialValue: {
                cajas: 0,
                puntos: 0,
                cuotaSuperada: false,
              },
              in: {
                cajas: {
                  $add: ['$$value.cajas', '$$this'],
                },
                puntos: {
                  $multiply: [
                    '$$this',
                    {
                      $toInt: '$valorDePuntos.iberia1Kg',
                    },
                  ],
                },
                cuotaSuperada: {
                  $gte: [
                    '$$this',
                    {
                      $toInt: '$cuotaPallets.iberia1Kg',
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          cajas: {
            $sum: [
              '$totalVentas.iberia90g.cajas',
              '$totalVentas.iberia225g.cajas',
              '$totalVentas.iberia1Kg.cajas',
            ],
          },
        },
      },
      {
        $addFields: {
          cuotaSuperada: {
            $allElementsTrue: [
              [
                '$totalVentas.iberia90g.cuotaSuperada',
                '$totalVentas.iberia225g.cuotaSuperada',
                '$totalVentas.iberia1Kg.cuotaSuperada',
              ],
            ],
          },
        },
      },
      {
        $addFields: {
          puntosGenerados: {
            $objectToArray: '$totalVentas',
          },
        },
      },
      {
        $addFields: {
          puntosGenerados: {
            $reduce: {
              input: '$puntosGenerados.v.puntos',
              initialValue: 0,
              in: {
                $add: ['$$value', '$$this'],
              },
            },
          },
        },
      },
      {
        $match: {
          cuotaSuperada: true,
        },
      },
    ])
    .toArray();

  await client.close();
  return lealesQueRebasaronCuota;
}

export async function getUserInfo(userId) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const userInfo = await users.findOne(
    { userId },
    {
      projection: {
        _id: 0,
        userInfo: 1,
      },
    }
  );

  await client.close();
  return userInfo.userInfo;
}

// export async function getLeales() {
//   const client = new MongoClient(uri);
//   // Connect to the database and access its collection
//   const database = client.db('perfectapp');
//   const users = database.collection('users');

//   const leales = await users
//     .aggregate([
//       {
//         $match: {
//           role: 'LEAL',
//         },
//       },
//       {
//         $project: {
//           userId: 1,
//           userInfo: 1,
//         },
//       },
//       {
//         $replaceRoot: {
//           newRoot: {
//             $mergeObjects: ['$$ROOT', '$userInfo'],
//           },
//         },
//       },
//       {
//         $unset: 'userInfo',
//       },
//     ])
//     .toArray();

//   await client.close();
//   return leales;
// }

export async function getLeal(clientId) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const leal = await users
    .aggregate([
      {
        $match: {
          userId: clientId,
        },
      },
      {
        $project: {
          _id: 0,
          password: 0,
          role: 0,
          ventas: 0,
          mesesCuotaRebasada: 0,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$$ROOT', '$userInfo'],
          },
        },
      },
      {
        $unset: 'userInfo',
      },
    ])
    .toArray();

  await client.close();
  return leal[0];
}

export async function getAsesores() {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const asesores = await users
    .aggregate([
      {
        $match: {
          role: 'ASESOR',
        },
      },
      {
        $project: {
          userId: 1,
          userInfo: 1,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$$ROOT', '$userInfo'],
          },
        },
      },
      {
        $unset: 'userInfo',
      },
    ])
    .toArray();

  await client.close();
  return asesores;
}

export async function getUser(userId) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const user = await users.findOne({ userId });

  await client.close();
  return user;
}

export async function changePassword(userId, hashedPassword) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const result = await users.updateOne(
    { userId },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );

  await client.close();
  return result;
}

export async function firstLogin(userId) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const firstLoginDate = new Date().toISOString();

  const firstLogin = await users.updateOne(
    { userId },
    {
      $set: {
        'datosLeal.firstLoginDate': firstLoginDate,
      },
      $inc: {
        'datosLeal.puntosLeal': 2000,
      },
    }
  );

  await client.close();
  return firstLogin;
}

export async function actualizarDatosLeal(userId, data) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  console.log('data', data);
  const { nombreDelEncargado, email, telefono, fechaDeAniversario } = data;

  const result = await users.updateOne(
    { userId },
    {
      $set: {
        'datosLeal.nombreDelEncargado': nombreDelEncargado,
        'datosLeal.email': email,
        'datosLeal.telefono': telefono,
        'datosLeal.fechaDeAniversario': fechaDeAniversario,
      },
    }
  );

  await client.close();
  return result;
}

export async function getDatosLeal(userId) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const datosLeal = await users.findOne(
    { userId },
    {
      projection: {
        _id: 0,
        datosLeal: 1,
      },
    }
  );

  await client.close();
  return datosLeal.datosLeal;
}

export async function firstLealDataUpdate(userId) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const users = database.collection('users');

  const result = await users.updateOne(
    { userId },
    {
      $inc: {
        'datosLeal.puntosLeal': 3000,
      },
    }
  );

  await client.close();
  return result;
}

export async function getPromociones(empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const config = database.collection('config');

  const result = await config.findOne(
    { empresa },
    {
      projection: {
        _id: 0,
        promocionesDelMes: 1,
      },
    }
  );

  await client.close();
  return result;
}

export async function getOpcionesDeNoCompra(empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const config = database.collection('config');

  const result = await config.findOne(
    { empresa },
    {
      projection: {
        _id: 0,
        opcionesDeNoCompra: 1,
      },
    }
  );

  await client.close();
  return result;
}

export async function getDistribuidores(empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const config = database.collection('config');

  const result = await config.findOne(
    { empresa },
    {
      projection: {
        _id: 0,
        distribuidores: 1,
      },
    }
  );

  await client.close();
  return result;
}

export async function getSettings(empresa) {
  const client = new MongoClient(uri);
  // Connect to the database and access its collection
  const database = client.db('perfectapp');
  const config = database.collection('config');

  const result = await config.findOne(
    { empresa },
    {
      projection: {
        _id: 0,
      },
    }
  );
  await client.close();
  return result;
}

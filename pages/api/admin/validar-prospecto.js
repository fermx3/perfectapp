import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import { hashPassword } from '@/lib/auth';
import { validarProspectoSchema } from '@/lib/schemas/schemas';

import { MongoClient, ObjectId } from 'mongodb';
import { createId } from '@/lib/db';

const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri);

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    res.status(401).json({ error: { message: 'Not authenticated!' } });
    return;
  }

  const empresa = session.user.empresa;

  await client.connect();
  const database = client.db('perfectapp');
  const users = database.collection('users');
  const prospectos = database.collection('prospectos');

  // const response = crearLealSchema.safeParse(req.body);

  // if (!response.success) {
  //   const { errors } = response.error;

  //   return res.status(400).json({
  //     error: { message: 'Invalid request :(', errors },
  //   });
  // }

  //zod
  const response = validarProspectoSchema.safeParse(req.body);
  let zodErrors = {};
  if (!response.success) {
    response.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

  const {
    nombre,
    canal,
    central,
    ubicacion,
    grupo,
    nivelDeCliente,
    zona,
    frecuencia,
    cuota,
    id,
  } = response.data;

  const frecuenciaArr = Object.keys(frecuencia).filter(
    (key) => frecuencia[key] === true
  );

  const userId = await createId(empresa, 'LEAL', central);
  //   const userId = 'IZT-0000';

  async function main() {
    //Check if the userId already exists
    const existingUser = await users.findOne({ _id: userId });

    if (existingUser) {
      res
        // .status(422)
        .json({
          errors: {
            message: 'El numero de usuario ya existe. Intenta otra vez.',
          },
        });
      await client.close();
      return;
    }
    //
    const hashedPassword = await hashPassword(
      process.env.DEFAULT_PASSWORD_LEALES
    );
    const result = await users.insertOne({
      _id: userId,
      password: hashedPassword,
      userId: userId,
      role: 'LEAL',
      userInfo: {
        nombre: nombre,
        nivelDeCliente: nivelDeCliente,
        frecuencia: frecuenciaArr,
        central: central,
        ubicacion: ubicacion,
        canal: canal,
        zona: zona,
        grupo: grupo,
      },
      cuotaDelMes: cuota,
      empresa: empresa,
      dateOfCreation: new Date(),
    });

    const result2 = await prospectos.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { validado: true },
      }
    );

    res.status(201).json({
      message:
        'Prospecto validado! Ahora el cliente está dado de alta en el sistema con la contraseña "SoyLeal2025".',
    });
  }

  main()
    .then(async () => {
      await client.close();
    })
    .catch(async (e) => {
      console.error(e);
      await client.close();
    });
}

export default handler;

import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

import { hashPassword } from '@/lib/auth';
import { crearLealSchema } from '@/lib/schemas/schemas';

import { MongoClient } from 'mongodb';

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

  await client.connect();
  const database = client.db('perfectapp');
  const collection = database.collection('users');

  // const response = crearLealSchema.safeParse(req.body);

  // if (!response.success) {
  //   const { errors } = response.error;

  //   return res.status(400).json({
  //     error: { message: 'Invalid request :(', errors },
  //   });
  // }

  //zod
  const response = crearLealSchema.safeParse(req.body);
  let zodErrors = {};
  if (!response.success) {
    response.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

  const { userId, password, role, userInfo } = response.data;

  // if (
  //   !userId ||
  //   /\D/.test(userId) ||
  //   !password ||
  //   password.trim().length < 8 ||
  //   !nivelDeCliente ||
  //   !nombre ||
  //   !role
  // ) {
  //   res.status(422).json({
  //     message: 'Entrada invalida',
  //   });
  //   return;
  // }

  async function main() {
    //Check if the userId already exists
    const existingUser = await collection.findOne({ userId: userId });

    if (existingUser) {
      res
        // .status(422)
        .json({
          errors: {
            userId: 'El numero de usuario ya existe. Intenta otra vez.',
          },
        });
      await client.close();
      return;
    }
    //
    const hashedPassword = await hashPassword(password);
    const result = await collection.insertOne({
      userId: userId,
      password: hashedPassword,
      role: role,
      userInfo: userInfo,
    });

    res.status(201).json({ message: 'Usuario creado!' });
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

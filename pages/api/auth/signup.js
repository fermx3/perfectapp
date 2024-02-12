import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { userId, password, nivelDeCliente, role } = data;

  if (
    !userId ||
    /\D/.test(userId) ||
    !password ||
    password.trim().length < 8 ||
    !nivelDeCliente ||
    !role
  ) {
    res.status(422).json({
      message:
        'Entrada invalida - la contraseña debe ser mayor a 8 caracteres.',
    });
    return;
  }

  const client = await connectToDatabase();

  const db = client.db();
  //Check if the userId already exists
  const existingUser = await db.collection('users').findOne({ userId: userId });

  if (existingUser) {
    res.status(422).json({ message: 'El numero de usuario ya existe.' });
    client.close();
    return;
  }
  //
  const hashedPassword = await hashPassword(password);

  const result = await db.collection('users').insertOne({
    userId: userId,
    password: hashedPassword,
    nivelDeCliente: nivelDeCliente,
    role: role,
  });

  res.status(201).json({ message: 'Usuario creado!' });
  client.close();
}

export default handler;

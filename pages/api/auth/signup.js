import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { userId, password, tipoDeCliente } = data;

  if (!userId || /\D/.test(userId) || !password || password.trim().length < 8) {
    res.status(422).json({
      message:
        'Entrada invalida - la contraseña debe ser mayor a 8 caracteres.',
    });
    return;
  }

  const client = await connectToDatabase();

  const db = client.db();

  const hashedPassword = await hashPassword(password);

  console.log(data);

  const result = await db.collection('users').insertOne({
    userId: userId,
    password: hashedPassword,
    tipoDeCliente: tipoDeCliente,
  });

  res.status(201).json({ message: 'Usuario creado!' });
}

export default handler;

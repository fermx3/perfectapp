import { hashPassword } from '@/lib/auth';
import { changePassword } from '@/lib/db';

const { getServerSession } = require('next-auth');
const { authOptions } = require('../auth/[...nextauth]');

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'SUPERADMIN') {
    res.status(401).json({ error: { message: 'Not authenticated!' } });
    return;
  }

  const { userId, newPassword } = req.body;

  const hashedPassword = await hashPassword(newPassword);

  const result = await changePassword(userId, hashedPassword);

  if (!result) {
    res.status(404).json({ error: { message: 'No se encuentra al usuario' } });
    return;
  }

  res.status(200).json({ message: 'Contraseña cambiada' });
}

export default handler;

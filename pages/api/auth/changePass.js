import { hashPassword, verifyPassword } from '@/lib/auth';
import { cambiarPasswordSchema } from '@/lib/schemas/schemas';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import { changePassword, firstLogin, getUser } from '@/lib/db';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  const response = cambiarPasswordSchema.safeParse(req.body);
  let zodErrors = {};
  if (!response.success) {
    response.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

  const userId = session.user.userId;
  const { oldPassword, newPassword } = response.data;

  const user = await getUser(userId);

  if (!user) {
    res.status(404).json({ message: 'No se encuentra al usuario' });
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res
      .status(403)
      .json({ field: 'oldPassword', message: 'La contraseña es incorrecta' });
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await changePassword(userId, hashedPassword);

  if (!user.datosLeal?.firstLoginDate) {
    console.log('first login');
    await firstLogin(userId);
  }

  res.status(200).json({ message: 'Contraseña cambiada' });
}

export default handler;

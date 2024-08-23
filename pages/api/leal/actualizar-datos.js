import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { actualizarDatosLealSchema } from '@/lib/schemas/schemas';
import { firstLealDataUpdate } from '@/lib/db';

import { actualizarDatosLeal, getDatosLeal } from '@/lib/db';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  const response = actualizarDatosLealSchema.safeParse(req.body);

  let zodErrors = {};
  if (!response.success) {
    response.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    res.json(Object.keys(zodErrors).length > 0 && { errors: zodErrors });
  }

  const userId = session.user.userId;
  const datosLeal = await getDatosLeal(userId);

  const result = await actualizarDatosLeal(userId, response.data);

  if (!datosLeal.nombreDelEncargado) {
    await firstLealDataUpdate(userId);
  }

  res.status(200).json({ message: 'Datos actualizados' });
}

export default handler;

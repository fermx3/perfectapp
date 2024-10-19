import { put } from '@vercel/blob';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const empresa = session?.user?.empresa;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const blob = await put(`${empresa}/${req.query.filename}`, req, {
    access: 'public',
  });

  return res.status(200).json(blob);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

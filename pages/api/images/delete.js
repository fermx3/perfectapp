import { del } from '@vercel/blob';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function DELETE(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const urlToDelete = req.query.url;

  await del(urlToDelete);

  return res.status(200).json({ success: true });
}

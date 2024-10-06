import { del } from '@vercel/blob';

export default async function DELETE(req, res) {
  const urlToDelete = req.query.url;

  await del(urlToDelete);

  return res.status(200).json({ success: true });
}

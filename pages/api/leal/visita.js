import { PrismaClient } from '@prisma/client';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const prisma = new PrismaClient();

  const data = await req.body;

  async function main() {
    console.log(data);
    const result = await prisma.visitas.create({ data: data });

    res.status(201).json({ message: 'Informacion enviada. Visita completa.' });
  }

  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
    });
}

export default handler;

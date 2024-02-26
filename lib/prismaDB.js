import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserInfo(userId) {
  const userInfo = await prisma.users.findUnique({
    where: {
      userId: userId,
    },
    select: {
      userInfo: true,
    },
  });
  return userInfo.userInfo;
}

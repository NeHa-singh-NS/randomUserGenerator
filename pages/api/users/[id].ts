import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.id as string;

  if (req.method === 'DELETE') {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });

      res.status(200).json(deletedUser); // Return the deleted user
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
      res.status(500).json({ error: `Failed to delete user ${userId}` });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.id; // Retrieve the user ID from the query parameters

  if (req.method === 'PUT') { // Update user if PUT request
    try {
      const { users } = req.body; // Assuming request body contains an array of user data
  
      if (!users || !users.length) {
        return res.status(400).json({ error: 'No users provided for update' });
      }
   
      const updatedUsers = [];
      for (const user of users) {
        const { id, ...userData } = user; // Destructure ID and other user data
  
        const updatedUser = await prisma.user.update({
          where: { id },
          data: userData,
        });
  
        updatedUsers.push(updatedUser);
      }
  
      res.status(200).json(updatedUsers); // Return all updated users
    } catch (error) {
      console.error('Failed to update multiple users:', error);
      res.status(500).json({ error: 'Failed to update users' });
    }
  } else if (req.method === 'DELETE') { // Delete user if DELETE request
    try {
      // Delete the user from the database using Prisma
      const deletedUser = await prisma.user.delete({
        where: { id: userId as string },
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

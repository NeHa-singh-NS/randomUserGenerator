import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const userData = req.body; // Assuming req.body contains the user data from the client

      // Save user data to MongoDB using Prisma
      const createdUser = await prisma.user.create({
        data: {
          gender: userData.gender,
          title: userData.name.title,
          firstName: userData.name.first,
          lastName: userData.name.last,
          streetNumber: userData.location.street.number,
          streetName: userData.location.street.name,
          city: userData.location.city,
          state: userData.location.state,
          country: userData.location.country,
          postcode: userData.location.postcode,
          latitude: parseFloat(userData.location.coordinates.latitude),
          longitude: parseFloat(userData.location.coordinates.longitude),
          timezoneOffset: userData.location.timezone.offset,
          timezoneDescription: userData.location.timezone.description,
          email: userData.email,
          uuid: userData.login.uuid,
          username: userData.login.username,
          password: userData.login.password,
          salt: userData.login.salt,
          md5: userData.login.md5,
          sha1: userData.login.sha1,
          sha256: userData.login.sha256,
          dob: new Date(userData.dob.date),
          age: userData.dob.age,
          registered: new Date(userData.registered.date),
          phone: userData.phone,
          cell: userData.cell,
          largePicture: userData.picture.large,
          mediumPicture: userData.picture.medium,
          thumbnailPicture: userData.picture.thumbnail,
          nat: userData.nat,
        },
      });

      res.status(201).json({ message: 'User created successfully', user: createdUser });
    } catch (error) {
      console.error('Failed to save user:', error);
      res.status(500).json({ error: 'Failed to save user' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

import { Prisma, PrismaClient } from '@prisma/client';
import ObjectID from 'bson-objectid';

const client = new PrismaClient();

const main = async () => {
    const user = await client.user.create({
        data: {
            id: ObjectID().toHexString(),
            fullName: "Admin",
            email: "admin2@me.com",
            active: true,
            role: "user",
        }
    })
    console.log(user);
}

main();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.updateMany({
        where: { email: 'vishwast656@gmail.com' },
        data: { role: 'ADMIN' },
    });
    console.log(`Updated ${user.count} user(s) to ADMIN role.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProperties() {
    console.log('Checking database...');
    try {
        const indralokProps = await prisma.property.findMany({
            where: {
                id: { startsWith: 'indralok-room' }
            },
            include: {
                photos: true
            }
        });
        
        console.log(`Found ${indralokProps.length} properties:`);
        for (const p of indralokProps) {
            console.log(`- ${p.id} (${p.title}), City: ${p.city}, Status: ${p.status}, Photos: ${p.photos.length}`);
        }

        const totalProps = await prisma.property.count();
        console.log(`Total properties in DB: ${totalProps}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkProperties();

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateProperties() {
    console.log('Updating database...');
    try {
        await prisma.property.update({
            where: { id: 'indralok-room-312' },
            data: {
                title: '2BHK Fully Furnished Apartment, Rewa',
                locality: 'Rewa City',
                description: '2BHK fully furnished apartment with balcony, wooden work, false ceiling, and garage parking. Lift is available. Price is around 40 lakhs.'
            }
        });

        await prisma.property.update({
            where: { id: 'indralok-room-412' },
            data: {
                title: '2BHK Fully Furnished Apartment, Rewa',
                locality: 'Rewa City',
                description: '2BHK fully furnished apartment with balcony, wooden work, false ceiling, and garage parking. Lift is available. Price is around 40 lakhs.'
            }
        });

        console.log('✅ Successfully updated properties to hide exact location and room numbers.');
    } catch (e) {
        console.error('Error updating properties:', e);
    } finally {
        await prisma.$disconnect();
    }
}

updateProperties();

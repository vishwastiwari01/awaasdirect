import { Router, Request, Response } from 'express';
import prisma from '../config/database';

const router = Router();

// One-time seed route — protected by a secret header
router.post('/indralok', async (req: Request, res: Response) => {
    const secret = req.headers['x-seed-secret'];
    if (secret !== 'awaasdirect-seed-2026') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    try {
        // Use raw SQL to avoid schema drift issues
        const users = await prisma.$queryRawUnsafe<any[]>(
            `SELECT id, email FROM users WHERE email = 'vishwast656@gmail.com' LIMIT 1`
        );

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: 'Owner user not found. Please log in to the website first.' });
        }

        const ownerId = users[0].id;
        console.log('✅ Found owner:', ownerId);

        const now = new Date().toISOString();

        // Insert Room 312
        await prisma.$queryRawUnsafe(`
            INSERT INTO properties (id, title, description, type, "transactionType", status,
                state, city, locality, pincode, address, latitude, longitude,
                bhk, sqft, furnishing, price, "priceNegotiable", floors,
                "ownerId", "viewCount", "createdAt", "updatedAt")
            VALUES (
                'indralok-room-312',
                '2BHK Fully Furnished Apartment — Flat 312, Indralok Palace, Rewa',
                E'Premium 2BHK fully furnished apartment on the 3rd floor of Indralok Palace Apartment Complex, Rewa.\n\n✨ Key Highlights:\n• 2 Bedrooms | 2 Bathrooms\n• Fully Furnished with premium wooden work & stylish interiors\n• Elegant fall ceiling throughout\n• Private balcony\n• Dedicated garage parking\n• 24/7 lift access\n• Ready to move in\n\n🏠 Building Amenities:\n• Lift / Elevator\n• Garage parking space\n• Gated society with security\n\n📍 Location: Indralok Palace Apartment Complex, Rewa, Madhya Pradesh\n🔑 Flat No: 312 (3rd Floor)\n💰 Price: ₹40 Lakhs (Negotiable)\n\n📞 For site visits & details: 6302429095',
                'APARTMENT', 'SALE', 'ACTIVE',
                'Madhya Pradesh', 'Rewa', 'Indralok Palace Apartment Complex',
                '486001', 'Indralok Palace Apartment Complex, Rewa, Madhya Pradesh',
                24.5362, 81.2999,
                2, 1100, 'FULLY_FURNISHED', 4000000, true, 3,
                '${ownerId}', 0, '${now}', '${now}'
            )
            ON CONFLICT (id) DO NOTHING
        `);

        // Insert Room 412
        await prisma.$queryRawUnsafe(`
            INSERT INTO properties (id, title, description, type, "transactionType", status,
                state, city, locality, pincode, address, latitude, longitude,
                bhk, sqft, furnishing, price, "priceNegotiable", floors,
                "ownerId", "viewCount", "createdAt", "updatedAt")
            VALUES (
                'indralok-room-412',
                '2BHK Fully Furnished Apartment — Flat 412, Indralok Palace, Rewa',
                E'Premium 2BHK fully furnished apartment on the 4th floor of Indralok Palace Apartment Complex, Rewa.\n\n✨ Key Highlights:\n• 2 Bedrooms | 2 Bathrooms\n• Fully Furnished with premium wooden work & stylish interiors\n• Elegant fall ceiling throughout\n• Private balcony with elevated open views\n• Dedicated garage parking\n• 24/7 lift access\n• Ready to move in\n\n🏠 Building Amenities:\n• Lift / Elevator\n• Garage parking space\n• Gated society with security\n\n📍 Location: Indralok Palace Apartment Complex, Rewa, Madhya Pradesh\n🔑 Flat No: 412 (4th Floor)\n💰 Price: ₹40 Lakhs (Negotiable)\n\n📞 For site visits & details: 6302429095',
                'APARTMENT', 'SALE', 'ACTIVE',
                'Madhya Pradesh', 'Rewa', 'Indralok Palace Apartment Complex',
                '486001', 'Indralok Palace Apartment Complex, Rewa, Madhya Pradesh',
                24.5362, 81.2999,
                2, 1100, 'FULLY_FURNISHED', 4000000, true, 4,
                '${ownerId}', 0, '${now}', '${now}'
            )
            ON CONFLICT (id) DO NOTHING
        `);

        return res.status(200).json({
            success: true,
            message: '✅ Both Indralok Palace apartments created successfully!',
            data: { room312: 'indralok-room-312', room412: 'indralok-room-412' }
        });

    } catch (err: any) {
        console.error('Seed error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;

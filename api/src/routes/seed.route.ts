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
        // Find owner
        const owner = await prisma.user.findUnique({
            where: { email: 'vishwast656@gmail.com' }
        });

        if (!owner) {
            return res.status(404).json({ success: false, message: 'Owner user not found. Please log in to the website first.' });
        }

        const commonData = {
            type: 'APARTMENT' as const,
            transactionType: 'SALE' as const,
            status: 'ACTIVE' as const,
            state: 'Madhya Pradesh',
            city: 'Rewa',
            locality: 'Indralok Palace Apartment Complex',
            pincode: '486001',
            address: 'Indralok Palace Apartment Complex, Rewa, Madhya Pradesh',
            latitude: 24.5362,
            longitude: 81.2999,
            bhk: 2,
            sqft: 1100,
            furnishing: 'FULLY_FURNISHED' as const,
            price: 4000000,
            priceNegotiable: true,
            ownerId: owner.id,
        };

        const p1 = await prisma.property.upsert({
            where: { id: 'indralok-room-312' },
            update: {},
            create: {
                id: 'indralok-room-312',
                ...commonData,
                floors: 3,
                title: '2BHK Fully Furnished Apartment — Flat 312, Indralok Palace, Rewa',
                description: `Premium 2BHK fully furnished apartment on the 3rd floor of Indralok Palace Apartment Complex, Rewa.

✨ Key Highlights:
• 2 Bedrooms | 2 Bathrooms
• Fully Furnished with premium wooden work & stylish interiors
• Elegant fall ceiling throughout
• Private balcony
• Dedicated garage parking
• 24/7 lift access
• Ready to move in

🏠 Building Amenities:
• Lift / Elevator
• Garage parking space
• Gated society with security

📍 Location: Indralok Palace Apartment Complex, Rewa, Madhya Pradesh
🔑 Flat No: 312 (3rd Floor)
💰 Price: ₹40 Lakhs (Negotiable)

📞 For site visits & details: 6302429095`,
            }
        });

        const p2 = await prisma.property.upsert({
            where: { id: 'indralok-room-412' },
            update: {},
            create: {
                id: 'indralok-room-412',
                ...commonData,
                floors: 4,
                title: '2BHK Fully Furnished Apartment — Flat 412, Indralok Palace, Rewa',
                description: `Premium 2BHK fully furnished apartment on the 4th floor of Indralok Palace Apartment Complex, Rewa.

✨ Key Highlights:
• 2 Bedrooms | 2 Bathrooms
• Fully Furnished with premium wooden work & stylish interiors
• Elegant fall ceiling throughout
• Private balcony with elevated open views
• Dedicated garage parking
• 24/7 lift access
• Ready to move in

🏠 Building Amenities:
• Lift / Elevator
• Garage parking space
• Gated society with security

📍 Location: Indralok Palace Apartment Complex, Rewa, Madhya Pradesh
🔑 Flat No: 412 (4th Floor)
💰 Price: ₹40 Lakhs (Negotiable)

📞 For site visits & details: 6302429095`,
            }
        });

        return res.status(200).json({
            success: true,
            message: '✅ Both Indralok Palace apartments created successfully!',
            data: { room312: p1.id, room412: p2.id }
        });

    } catch (err: any) {
        console.error('Seed error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;

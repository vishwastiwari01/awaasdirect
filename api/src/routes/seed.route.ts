import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { supabaseStorage, STORAGE_BUCKET } from '../config/storage';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const router = Router();

// One-time seed route — protected by a secret header
router.post('/indralok', async (req: Request, res: Response) => {
    const secret = req.headers['x-seed-secret'];
    if (secret !== 'awaasdirect-seed-2026') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    try {
        // ── 1. Find or create owner user ──────────────────────────
        let users = await prisma.$queryRawUnsafe<any[]>(
            `SELECT id, email FROM users WHERE email = 'vishwast656@gmail.com' LIMIT 1`
        );

        if (!users || users.length === 0) {
            console.log('User not found — creating ADMIN owner...');
            const newUserId = crypto.randomBytes(12).toString('hex');
            // phone/phoneHash use email hash as placeholder to satisfy NOT NULL constraint
            const phonePlaceholder = crypto.createHash('sha256').update('vishwast656@gmail.com').digest('hex').slice(0, 20);
            await prisma.$queryRawUnsafe(`
                INSERT INTO users (id, email, name, phone, "phoneHash", role, "isActive", "aadhaarVerified", "createdAt", "updatedAt")
                VALUES ('${newUserId}', 'vishwast656@gmail.com', 'Vishwas Tiwari', '${phonePlaceholder}', '${phonePlaceholder}', 'ADMIN', true, false, NOW(), NOW())
                ON CONFLICT (email) DO NOTHING
            `);
            users = await prisma.$queryRawUnsafe<any[]>(
                `SELECT id, email FROM users WHERE email = 'vishwast656@gmail.com' LIMIT 1`
            );
        }

        if (!users || users.length === 0) {
            return res.status(500).json({ success: false, message: 'Could not find or create owner user.' });
        }

        const ownerId = users[0].id;
        console.log('✅ Owner:', ownerId);

        const now = new Date().toISOString();

        // ── 2. Insert both properties ──────────────────────────────
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

        console.log('✅ Properties inserted');

        // ── 3. Upload photos to Supabase Storage ───────────────────
        // Find image files relative to the running process (deployed root)
        const rootDir = path.join(process.cwd(), '..');
        const room412Path = path.join(rootDir, 'room412.jpeg');
        const room312Dir = path.join(rootDir, 'room312');

        const uploadedPhotos: { propertyId: string; url: string; key: string; isCover: boolean }[] = [];

        // Upload room 412 photo
        if (fs.existsSync(room412Path)) {
            const buffer = fs.readFileSync(room412Path);
            const key = `properties/indralok-room-412/room412.jpeg`;
            const { error } = await supabaseStorage.from(BUCKET).upload(key, buffer, {
                contentType: 'image/jpeg',
                upsert: true,
            });
            if (!error) {
                const { data: urlData } = supabaseStorage.from(BUCKET).getPublicUrl(key);
                uploadedPhotos.push({ propertyId: 'indralok-room-412', url: urlData.publicUrl, key, isCover: true });
                console.log('✅ Uploaded room412.jpeg');
            } else {
                console.error('❌ room412 upload error:', error.message);
            }
        } else {
            console.warn('⚠️ room412.jpeg not found at', room412Path);
        }

        // Upload room 312 photos
        if (fs.existsSync(room312Dir)) {
            const files = fs.readdirSync(room312Dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
            for (let i = 0; i < files.length; i++) {
                const filePath = path.join(room312Dir, files[i]);
                const buffer = fs.readFileSync(filePath);
                const safeFilename = `photo_${i + 1}.jpeg`;
                const key = `properties/indralok-room-312/${safeFilename}`;
                const { error } = await supabaseStorage.from(BUCKET).upload(key, buffer, {
                    contentType: 'image/jpeg',
                    upsert: true,
                });
                if (!error) {
                    const { data: urlData } = supabaseStorage.from(BUCKET).getPublicUrl(key);
                    uploadedPhotos.push({ propertyId: 'indralok-room-312', url: urlData.publicUrl, key, isCover: i === 0 });
                    console.log(`✅ Uploaded room312 photo ${i + 1}`);
                } else {
                    console.error(`❌ room312 photo ${i + 1} upload error:`, error.message);
                }
            }
        } else {
            console.warn('⚠️ room312 folder not found at', room312Dir);
        }

        // ── 4. Insert photo records into DB ────────────────────────
        for (let i = 0; i < uploadedPhotos.length; i++) {
            const p = uploadedPhotos[i];
            const photoId = crypto.randomBytes(8).toString('hex');
            await prisma.$queryRawUnsafe(`
                INSERT INTO property_photos (id, url, "s3Key", "isCover", "sortOrder", "propertyId", "createdAt", "updatedAt")
                VALUES ('${photoId}', '${p.url}', '${p.key}', ${p.isCover}, ${i}, '${p.propertyId}', NOW(), NOW())
                ON CONFLICT ("s3Key") DO NOTHING
            `);
        }

        console.log(`✅ ${uploadedPhotos.length} photos inserted`);

        return res.status(200).json({
            success: true,
            message: `✅ Both apartments created with ${uploadedPhotos.length} photos uploaded!`,
            data: {
                room312: 'indralok-room-312',
                room412: 'indralok-room-412',
                photosUploaded: uploadedPhotos.length,
                photos: uploadedPhotos.map(p => p.url),
            }
        });

    } catch (err: any) {
        console.error('Seed error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;

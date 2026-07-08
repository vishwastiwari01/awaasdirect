import { Router, Request, Response } from 'express';
import prisma from '../config/database';
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

        // ── 3. Upload photos to Supabase Storage via REST API (no WebSocket) ──
        const SUPABASE_URL = process.env.SUPABASE_URL!;
        const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const BUCKET = process.env.SUPABASE_BUCKET_NAME || 'awaasdirect-assets';

        const uploadErrors: string[] = [];
        const uploadPhoto = async (buffer: Buffer, key: string): Promise<string | null> => {
            const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`;
            const res = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'apikey': SERVICE_KEY,
                    'Authorization': `Bearer ${SERVICE_KEY}`,
                    'Content-Type': 'image/jpeg',
                    'x-upsert': 'true',
                },
                body: new Uint8Array(buffer),
            });
            if (!res.ok) {
                const text = await res.text();
                const errMessage = `❌ Upload failed for ${key}: ${res.status} ${res.statusText} - ${text}`;
                console.error(errMessage);
                uploadErrors.push(errMessage);
                return null;
            }
            return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${key}`;
        };

        // __dirname = api/dist/routes/, go up 3 levels to get to api/ root
        const rootDir = path.join(__dirname, '..', '..', '..');
        const room412Path = path.join(rootDir, 'api', 'room412.jpeg');
        const room312Dir  = path.join(rootDir, 'api', 'room312');
        
        const uploadedPhotos: { propertyId: string; url: string; key: string; isCover: boolean }[] = [];

        // Upload room 412
        if (fs.existsSync(room412Path)) {
            const buffer = fs.readFileSync(room412Path);
            const key = `properties/indralok-room-412/room412.jpeg`;
            const url = await uploadPhoto(buffer, key);
            if (url) {
                uploadedPhotos.push({ propertyId: 'indralok-room-412', url, key, isCover: true });
            }
        }

        // Upload room 312 photos
        if (fs.existsSync(room312Dir)) {
            const files = fs.readdirSync(room312Dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
            for (let i = 0; i < files.length; i++) {
                const filePath = path.join(room312Dir, files[i]);
                const buffer = fs.readFileSync(filePath);
                const key = `properties/indralok-room-312/photo_${i + 1}.jpeg`;
                const url = await uploadPhoto(buffer, key);
                if (url) {
                    uploadedPhotos.push({ propertyId: 'indralok-room-312', url, key, isCover: i === 0 });
                }
            }
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
            message: `Both apartments created with ${uploadedPhotos.length} photos uploaded!`,
            data: {
                room312: 'indralok-room-312',
                room412: 'indralok-room-412',
                photosUploaded: uploadedPhotos.length,
                photos: uploadedPhotos.map(p => p.url),
                debug: {
                    uploadErrors,
                    rootDir,
                    room412Exists: fs.existsSync(room412Path),
                    room312Exists: fs.existsSync(room312Dir),
                    cwd: process.cwd(),
                    dirname: __dirname,
                    serviceKeyPrefix: SERVICE_KEY ? SERVICE_KEY.substring(0, 10) : 'missing',
                }
            }
        });

    } catch (err: any) {
        console.error('Seed error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;

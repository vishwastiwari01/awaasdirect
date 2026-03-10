import { PrismaClient, Role, PropertyType, TransactionType, FurnishingStatus, PropertyStatus, VerificationStatus, VirtualTourStatus, FloorPlanStatus } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// ─── helpers ────────────────────────────────────────────────
const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

// Never store plain passwords; bcrypt hash of known seeds for dev only
// "Owner123!" → this hash (generated offline with bcrypt rounds=10)
const OWNER_PW_HASH = '$2b$10$7QpBN3uENe1z.LzJxlSEYOp8c1bZkAn7bGDPqYmvvVo3Bz6UkFOpi';
const BUYER_PW_HASH  = '$2b$10$I9rN5z1a2OpbYqXyD4MKEeaY7.Hb3Q8kJoM5/TIpLx5SDBn0qfDSq';
const ADMIN_PW_HASH  = '$2b$10$Y3gLmR9T6kFdAlzNxH7W2u8cQPrE0eJsKpf.VTZnBiCAqXw1oMbDO';

// ─── main ────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting seed...');

  // ── 1. Admin ──────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { phone: sha256('9000000000') },
    update: {},
    create: {
      name: 'Aarav Admin',
      email: 'admin@awaasdirect.in',
      phone: sha256('9000000000'),
      phoneHash: sha256('9000000000'),
      passwordHash: ADMIN_PW_HASH,
      role: Role.ADMIN,
      aadhaarVerified: true,
      aadhaarHash: sha256('AADHAAR-ADMIN-001'),
      isActive: true,
    },
  });
  console.log('✔ Admin created:', admin.email);

  // ── 2. Owners (5) ─────────────────────────────────────────
  const ownersData = [
    { name: 'Suresh Reddy',       email: 'suresh.reddy@gmail.com',    phone: '9876543210', aadhaar: 'AADH-SURESH-1' },
    { name: 'Priya Sharma',       email: 'priya.sharma@gmail.com',    phone: '9823456789', aadhaar: 'AADH-PRIYA-2'  },
    { name: 'Mohammed Iqbal',     email: 'miqbal.hyderabad@gmail.com',phone: '9765432109', aadhaar: 'AADH-IQBAL-3'  },
    { name: 'Sunita Kulkarni',    email: 'sunita.kulkarni@yahoo.in',  phone: '9654321098', aadhaar: 'AADH-SUNITA-4' },
    { name: 'Rajesh Nair',        email: 'rajesh.nair.blr@gmail.com', phone: '9543210987', aadhaar: 'AADH-RAJESH-5' },
  ];

  const owners = await Promise.all(
    ownersData.map((o) =>
      prisma.user.upsert({
        where: { phone: sha256(o.phone) },
        update: {},
        create: {
          name: o.name,
          email: o.email,
          phone: sha256(o.phone),
          phoneHash: sha256(o.phone),
          passwordHash: OWNER_PW_HASH,
          role: Role.OWNER,
          aadhaarVerified: true,
          aadhaarHash: sha256(o.aadhaar),
          isActive: true,
        },
      })
    )
  );
  console.log('✔ Owners created:', owners.length);

  // ── 3. Buyers (3) ─────────────────────────────────────────
  const buyersData = [
    { name: 'Anita Patel',   email: 'anita.patel@gmail.com',  phone: '9111111111' },
    { name: 'Karthik Menon', email: 'karthik.menon@gmail.com',phone: '9222222222' },
    { name: 'Divya Singh',   email: 'divya.singh22@gmail.com', phone: '9333333333' },
  ];

  const buyers = await Promise.all(
    buyersData.map((b) =>
      prisma.user.upsert({
        where: { phone: sha256(b.phone) },
        update: {},
        create: {
          name: b.name,
          email: b.email,
          phone: sha256(b.phone),
          phoneHash: sha256(b.phone),
          passwordHash: BUYER_PW_HASH,
          role: Role.BUYER,
          aadhaarVerified: true,
          aadhaarHash: sha256(`AADHAAR-BUYER-${b.phone}`),
          isActive: true,
        },
      })
    )
  );
  console.log('✔ Buyers created:', buyers.length);

  // ── 4. Properties (10) ────────────────────────────────────
  const propertiesData = [
    // ── BANGALORE (4) ──────────────────────────────────────
    {
      title: '3 BHK Premium Apartment in Whitefield',
      description: 'Spacious 3 BHK apartment in a gated community with clubhouse, swimming pool, and 24/7 security. Close to ITPL and Whitefield metro station.',
      type: PropertyType.APARTMENT,
      transactionType: TransactionType.SALE,
      city: 'Bangalore',
      locality: 'Whitefield',
      address: 'Prestige Shantiniketan, ITPL Road, Whitefield, Bangalore 560066',
      latitude: 12.9698,
      longitude: 77.7500,
      bhk: 3,
      sqft: 1850,
      floors: 10,
      facing: 'East',
      furnishing: FurnishingStatus.SEMI_FURNISHED,
      price: 12500000,
      priceNegotiable: true,
      ownerId: owners[0].id,
      reraNumber: 'PRM/KA/RERA/1251/308/PR/171017/001235',
      reraState: 'Karnataka',
    },
    {
      title: '2 BHK Flat for Rent — Indiranagar',
      description: 'Beautifully furnished 2 BHK flat in the heart of Indiranagar. Walking distance to 100 Feet Road restaurants and shops. Well-maintained complex.',
      type: PropertyType.APARTMENT,
      transactionType: TransactionType.RENT,
      city: 'Bangalore',
      locality: 'Indiranagar',
      address: 'CMH Road, Indiranagar, Bangalore 560038',
      latitude: 12.9784,
      longitude: 77.6408,
      bhk: 2,
      sqft: 1100,
      floors: 4,
      facing: 'North',
      furnishing: FurnishingStatus.FULLY_FURNISHED,
      price: 38000,
      deposit: 152000,
      priceNegotiable: false,
      ownerId: owners[1].id,
      reraNumber: null,
      reraState: null,
    },
    {
      title: 'Independent Villa with Garden — Sarjapur Road',
      description: 'New 4 BHK independent villa with a private garden, modular kitchen, and 2-car parking. Premium construction, Vastu-compliant layout.',
      type: PropertyType.VILLA,
      transactionType: TransactionType.SALE,
      city: 'Bangalore',
      locality: 'Sarjapur Road',
      address: 'Kaikondrahalli, Sarjapur Road, Bangalore 560035',
      latitude: 12.9063,
      longitude: 77.6914,
      bhk: 4,
      sqft: 3200,
      floors: 2,
      facing: 'North-East',
      furnishing: FurnishingStatus.UNFURNISHED,
      price: 28000000,
      priceNegotiable: true,
      ownerId: owners[4].id,
      reraNumber: 'PRM/KA/RERA/1251/446/PR/200229/003801',
      reraState: 'Karnataka',
    },
    {
      title: 'Residential Plot for Sale — Electronic City Phase 2',
      description: 'East-facing 40×60 ft BMRDA approved plot in a gated layout. All amenities — water, electricity, drainage available. Ideal for self-construction.',
      type: PropertyType.PLOT,
      transactionType: TransactionType.SALE,
      city: 'Bangalore',
      locality: 'Electronic City',
      address: 'Phase 2, Electronic City, Bangalore 560100',
      latitude: 12.8399,
      longitude: 77.6770,
      bhk: null,
      sqft: 2400,
      plotLength: 60,
      plotWidth: 40,
      facing: 'East',
      furnishing: FurnishingStatus.UNFURNISHED,
      price: 7500000,
      priceNegotiable: true,
      ownerId: owners[0].id,
      reraNumber: null,
      reraState: null,
    },

    // ── HYDERABAD (3) ──────────────────────────────────────
    {
      title: '3 BHK Flat in Gachibowli — IT Hub',
      description: 'Spacious 3 BHK flat in a premium high-rise overlooking Durgam Cheruvu lake. 5-minute drive to Raheja Mindspace and DLF Cyber City. Gym, pool, kids area.',
      type: PropertyType.APARTMENT,
      transactionType: TransactionType.SALE,
      city: 'Hyderabad',
      locality: 'Gachibowli',
      address: 'My Home Jewel, Gachibowli, Hyderabad 500032',
      latitude: 17.4400,
      longitude: 78.3489,
      bhk: 3,
      sqft: 1980,
      floors: 14,
      facing: 'West',
      furnishing: FurnishingStatus.SEMI_FURNISHED,
      price: 13200000,
      priceNegotiable: false,
      ownerId: owners[2].id,
      reraNumber: 'P02400005498',
      reraState: 'Telangana',
    },
    {
      title: '2 BHK for Rent Near Hitech City Metro',
      description: 'Move-in ready 2 BHK apartment on 7th floor with stunning city view. Fully furnished — all appliances, beds, sofa, and Wi-Fi setup.',
      type: PropertyType.APARTMENT,
      transactionType: TransactionType.RENT,
      city: 'Hyderabad',
      locality: 'Madhapur',
      address: 'Adarsh Nagar, Madhapur, Hyderabad 500081',
      latitude: 17.4486,
      longitude: 78.3908,
      bhk: 2,
      sqft: 1050,
      floors: 7,
      facing: 'South',
      furnishing: FurnishingStatus.FULLY_FURNISHED,
      price: 32000,
      deposit: 96000,
      maintenanceCharge: 3000,
      priceNegotiable: true,
      ownerId: owners[3].id,
      reraNumber: null,
      reraState: null,
    },
    {
      title: 'RERA-Approved 40×60 Plot — Kompally',
      description: 'HMDA approved residential plot in a fast-developing locality. Layout with wide roads, drainage, and tree plantation. Bank loan available.',
      type: PropertyType.PLOT,
      transactionType: TransactionType.SALE,
      city: 'Hyderabad',
      locality: 'Kompally',
      address: 'Sunshine Enclave, Kompally, Hyderabad 500014',
      latitude: 17.5473,
      longitude: 78.4816,
      bhk: null,
      sqft: 2400,
      plotLength: 60,
      plotWidth: 40,
      facing: 'North',
      furnishing: FurnishingStatus.UNFURNISHED,
      price: 5600000,
      priceNegotiable: true,
      ownerId: owners[2].id,
      reraNumber: 'P02400011234',
      reraState: 'Telangana',
    },

    // ── MUMBAI (3) ─────────────────────────────────────────
    {
      title: '2 BHK Sea-View Apartment — Worli',
      description: 'Rare 2 BHK with partial Arabian Sea view on the 22nd floor of a premium high-rise. Modular kitchen, imported marble flooring, 1 covered parking.',
      type: PropertyType.APARTMENT,
      transactionType: TransactionType.SALE,
      city: 'Mumbai',
      locality: 'Worli',
      address: 'Prabhadevi, Worli, Mumbai 400030',
      latitude: 19.0176,
      longitude: 72.8139,
      bhk: 2,
      sqft: 1250,
      floors: 22,
      facing: 'West',
      furnishing: FurnishingStatus.SEMI_FURNISHED,
      price: 45000000,
      priceNegotiable: false,
      ownerId: owners[1].id,
      reraNumber: 'P51800028719',
      reraState: 'Maharashtra',
    },
    {
      title: '1 BHK for Rent — Andheri West',
      description: 'Compact and well-maintained 1 BHK flat in a society with 24-hr water supply. 10-minute walk to Andheri metro station. Good for singles or young couples.',
      type: PropertyType.APARTMENT,
      transactionType: TransactionType.RENT,
      city: 'Mumbai',
      locality: 'Andheri West',
      address: 'Near Lokhandwala Market, Andheri West, Mumbai 400053',
      latitude: 19.1361,
      longitude: 72.8296,
      bhk: 1,
      sqft: 580,
      floors: 3,
      facing: 'East',
      furnishing: FurnishingStatus.SEMI_FURNISHED,
      price: 30000,
      deposit: 90000,
      maintenanceCharge: 2500,
      priceNegotiable: true,
      ownerId: owners[3].id,
      reraNumber: null,
      reraState: null,
    },
    {
      title: '4 BHK Duplex — Powai',
      description: 'Stunning 4 BHK duplex with lake-facing balcony. Double-height living room, private terrace, and premium fittings throughout. Hiranandani Gardens gated township.',
      type: PropertyType.APARTMENT,
      transactionType: TransactionType.SALE,
      city: 'Mumbai',
      locality: 'Powai',
      address: 'Hiranandani Gardens, Powai, Mumbai 400076',
      latitude: 19.1197,
      longitude: 72.9073,
      bhk: 4,
      sqft: 2800,
      floors: 15,
      facing: 'North-East',
      furnishing: FurnishingStatus.FULLY_FURNISHED,
      price: 62000000,
      priceNegotiable: true,
      ownerId: owners[4].id,
      reraNumber: 'P51900037421',
      reraState: 'Maharashtra',
    },
  ];

  // ── Insert properties + photos + verifications ─────────
  const createdProperties: { id: string; reraNumber: string | null; reraState: string | null; title: string }[] = [];

  for (const pd of propertiesData) {
    const { reraNumber, reraState, ownerId, ...propertyFields } = pd;

    const property = await prisma.property.create({
      data: {
        ...propertyFields,
        ownerId,
        // Seed: add 3 placeholder photo records per property (S3 keys would be real in production)
        photos: {
          create: [
            { url: `https://awaasdirect-assets.s3.ap-south-1.amazonaws.com/seed/${propertyFields.city.toLowerCase()}_prop_1.jpg`, s3Key: `seed/${propertyFields.city.toLowerCase()}_prop_1.jpg`, isCover: true, sortOrder: 0 },
            { url: `https://awaasdirect-assets.s3.ap-south-1.amazonaws.com/seed/${propertyFields.city.toLowerCase()}_prop_2.jpg`, s3Key: `seed/${propertyFields.city.toLowerCase()}_prop_2.jpg`, sortOrder: 1 },
            { url: `https://awaasdirect-assets.s3.ap-south-1.amazonaws.com/seed/${propertyFields.city.toLowerCase()}_prop_3.jpg`, s3Key: `seed/${propertyFields.city.toLowerCase()}_prop_3.jpg`, sortOrder: 2 },
          ],
        },
      },
    });

    // Create PropertyVerification if RERA is present
    if (reraNumber) {
      await prisma.propertyVerification.create({
        data: {
          propertyId: property.id,
          reraNumber,
          reraState,
          reraStatus: VerificationStatus.VERIFIED,
          reraVerifiedAt: new Date(),
          aadhaarLinked: true,
          aadhaarLinkedAt: new Date(),
        },
      });
    }

    createdProperties.push({ id: property.id, reraNumber, reraState, title: propertyFields.title });
  }
  console.log('✔ Properties created:', createdProperties.length);

  // ── 5. Virtual Tour for first property ─────────────────
  await prisma.virtualTour.create({
    data: {
      propertyId: createdProperties[0].id,
      status: VirtualTourStatus.READY,
      embedUrl: 'https://kuula.co/share/collection/7Fcxh?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1',
      triggeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
    },
  });
  console.log('✔ Virtual tour seeded');

  // ── 6. Saved Properties ─────────────────────────────────
  await prisma.savedProperty.createMany({
    data: [
      { userId: buyers[0].id, propertyId: createdProperties[0].id },  // Anita saved Whitefield 3BHK
      { userId: buyers[0].id, propertyId: createdProperties[4].id },  // Anita saved Gachibowli 3BHK
      { userId: buyers[1].id, propertyId: createdProperties[7].id },  // Karthik saved Worli
      { userId: buyers[2].id, propertyId: createdProperties[2].id },  // Divya saved Sarjapur villa
    ],
    skipDuplicates: true,
  });
  console.log('✔ Saved properties seeded');

  // ── 7. Conversations + Messages ─────────────────────────
  const conv = await prisma.conversation.create({
    data: {
      buyerId: buyers[0].id,
      propertyId: createdProperties[0].id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv.id,
        senderId: buyers[0].id,
        content: 'Hello Suresh ji! I am interested in your Whitefield apartment. Is it still available?',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        conversationId: conv.id,
        senderId: owners[0].id,
        content: 'Yes, it is available. When would you like to schedule a visit?',
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      },
      {
        conversationId: conv.id,
        senderId: buyers[0].id,
        content: 'This Saturday at 11 AM would work for me. Can we meet there?',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  });
  console.log('✔ Conversations and messages seeded');

  // ── 8. AI Floor Plan Request ────────────────────────────
  // On the Electronic City plot listing
  const plotProperty = createdProperties.find((p) => p.title.includes('Electronic City'));
  if (plotProperty) {
    await prisma.aIPlanRequest.create({
      data: {
        requesterId: buyers[1].id,
        propertyId: plotProperty.id,
        status: FloorPlanStatus.COMPLETED,
        plotLength: 60,
        plotWidth: 40,
        floors: 2,
        stylePrefs: 'vastu-compliant',
        roomPrefs: {
          bedrooms: 3,
          bathrooms: 3,
          kitchen: 1,
          hall: 1,
          pooja: 1,
          parking: 2,
        },
        layoutJson: {
          ground: [
            { room: 'Living Room', dimensions: '18x14ft', position: 'front-centre' },
            { room: 'Kitchen', dimensions: '12x10ft', position: 'rear-left' },
            { room: 'Dining', dimensions: '10x10ft', position: 'centre' },
            { room: 'Master Bedroom', dimensions: '14x12ft', position: 'rear-right' },
            { room: 'Pooja Room', dimensions: '6x5ft', position: 'front-right' },
          ],
          first: [
            { room: 'Bedroom 2', dimensions: '12x11ft', position: 'front-left' },
            { room: 'Bedroom 3', dimensions: '12x11ft', position: 'front-right' },
            { room: 'Terrace', dimensions: '14x10ft', position: 'rear' },
          ],
        },
        floorPlanUrl: 'https://awaasdirect-assets.s3.ap-south-1.amazonaws.com/seed/floor-plan-electronic-city.png',
        s3Key: 'seed/floor-plan-electronic-city.png',
        generationMs: 12430,
      },
    });
  }
  console.log('✔ AI floor plan request seeded');

  // ── 9. Reports ──────────────────────────────────────────
  const suspectProperty = createdProperties[1]; // Indiranagar rent listing — just as example
  await prisma.report.create({
    data: {
      reporterId: buyers[2].id,
      targetPropertyId: suspectProperty.id,
      reason: 'SUSPECTED_FRAUD',
      notes: 'The price seems too low. Could be a scam listing. Owner not responding to queries.',
    },
  });
  console.log('✔ Report seeded');

  console.log('');
  console.log('🎉 Seed complete!');
  console.log('─────────────────────────────────────────');
  console.log('Admin email  : admin@awaasdirect.in');
  console.log('Admin phone  : 9000000000 (hashed in DB)');
  console.log('─────────────────────────────────────────');
  console.log('Properties seeded:');
  createdProperties.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title} ${p.reraNumber ? '[RERA ✓]' : ''}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

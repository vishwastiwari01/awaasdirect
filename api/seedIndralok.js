require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Find the owner user
  const owner = await prisma.user.findUnique({
    where: { email: 'vishwast656@gmail.com' }
  });

  if (!owner) {
    console.error('❌ User vishwast656@gmail.com not found in DB. Please log in to the website first.');
    return;
  }

  console.log('✅ Found owner:', owner.id, owner.name);

  const commonData = {
    type: 'APARTMENT',
    transactionType: 'SALE',
    status: 'ACTIVE',
    state: 'Telangana',
    city: 'Hyderabad',
    locality: 'Indralok Palace Apartment Complex',
    pincode: '500072',
    address: 'Indralok Palace Apartment Complex, Hyderabad, Telangana',
    latitude: 17.4840,
    longitude: 78.3951,
    bhk: 2,
    sqft: 1100,
    furnishing: 'FULLY_FURNISHED',
    price: 4000000, // 40 lakhs in INR
    priceNegotiable: true,
    ownerId: owner.id,
  };

  // ── Property 1: Room 312 (3rd Floor) ──────────────────────────
  const p1 = await prisma.property.upsert({
    where: {
      // Use a unique combo — we'll match on title + ownerId
      id: 'indralok-room-312',
    },
    update: {},
    create: {
      id: 'indralok-room-312',
      ...commonData,
      title: '2BHK Fully Furnished Apartment — Room 312, Indralok Palace',
      description: `Spacious 2BHK fully furnished apartment on the 3rd floor of the prestigious Indralok Palace Apartment Complex, Hyderabad.

✨ Key Highlights:
• 2 Bedrooms | 2 Bathrooms
• Fully Furnished with premium wooden work and stylish interiors
• Beautiful fall ceiling throughout
• Private balcony with open views
• Dedicated garage parking included
• 24/7 lift access

🏠 Amenities:
• Lift / Elevator in building
• Garage parking space
• Gated community with security

📍 Location: Indralok Palace Apartment Complex, Hyderabad, Telangana
🔑 Flat No: 312 (3rd Floor)
💰 Price: ₹40 Lakhs (Negotiable)

For site visits and more details, call: 6302429095`,
      floors: 3,
    }
  });
  console.log('✅ Created / updated Property 1 (Room 312):', p1.id);

  // ── Property 2: Room 412 (4th Floor) ──────────────────────────
  const p2 = await prisma.property.upsert({
    where: {
      id: 'indralok-room-412',
    },
    update: {},
    create: {
      id: 'indralok-room-412',
      ...commonData,
      title: '2BHK Fully Furnished Apartment — Room 412, Indralok Palace',
      description: `Spacious 2BHK fully furnished apartment on the 4th floor of the prestigious Indralok Palace Apartment Complex, Hyderabad.

✨ Key Highlights:
• 2 Bedrooms | 2 Bathrooms
• Fully Furnished with premium wooden work and stylish interiors
• Beautiful fall ceiling throughout
• Private balcony with open views on higher floor for better ventilation
• Dedicated garage parking included
• 24/7 lift access

🏠 Amenities:
• Lift / Elevator in building
• Garage parking space
• Gated community with security

📍 Location: Indralok Palace Apartment Complex, Hyderabad, Telangana
🔑 Flat No: 412 (4th Floor)
💰 Price: ₹40 Lakhs (Negotiable)

For site visits and more details, call: 6302429095`,
      floors: 4,
    }
  });
  console.log('✅ Created / updated Property 2 (Room 412):', p2.id);

  console.log('\n🎉 Both Indralok Palace apartments are now live on the website!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
  })
  .finally(() => prisma.$disconnect());

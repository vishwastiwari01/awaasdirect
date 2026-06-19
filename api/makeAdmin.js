const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.dfwdqcyltrrdfjgwzcbf:yenoh4321%40hon6244@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
    }
  }
});

async function main() {
  const result = await prisma.user.updateMany({
    where: { email: 'vishwast656@gmail.com' },
    data: { role: 'ADMIN' },
  });
  console.log('Updated users:', result.count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

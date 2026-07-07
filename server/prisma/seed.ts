import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME;

  if (!username || !password || !fullName) {
    console.warn('Skipping admin seed: Missing ADMIN_USERNAME, ADMIN_PASSWORD, or ADMIN_FULL_NAME in environment.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { username },
    update: {}, // Do not update existing admin (so we don't accidentally overwrite manual password changes)
    create: {
      username,
      passwordHash,
      fullName,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(`Admin user '${admin.username}' ensured successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

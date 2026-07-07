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

  const existingAdmin = await prisma.user.findUnique({ where: { username } });

  if (existingAdmin) {
    console.log(`Admin user '${username}' already exists.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      passwordHash,
      fullName,
      role: 'ADMIN',
    },
  });

  console.log(`Admin user '${username}' created successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

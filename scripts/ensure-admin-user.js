const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.E2E_ADMIN_EMAIL || "admin@satt.org";
  const password = process.env.E2E_ADMIN_PASSWORD || "admin";
  const name = process.env.E2E_ADMIN_NAME || "Admin";

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "admin",
    },
  });
}

main()
  .catch((error) => {
    console.error("Failed to ensure admin user:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
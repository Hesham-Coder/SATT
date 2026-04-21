const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || process.env.E2E_ADMIN_EMAIL || "admin@satt.org";
  const password = process.env.ADMIN_PASSWORD || process.env.E2E_ADMIN_PASSWORD || "admin";
  const name = process.env.ADMIN_NAME || process.env.E2E_ADMIN_NAME || "Admin";

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    // Synchronize password and name if they changed
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        name,
        role: "admin",
      },
    });
    console.log(`Admin user ${email} synchronized.`);
    return;
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "admin",
    },
  });
  console.log(`Admin user ${email} created.`);
}

main()
  .catch((error) => {
    console.error("Failed to ensure admin user:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
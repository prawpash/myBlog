import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("loremPassword", 10);

  await prisma.user.create({
    data: {
      email: "example@example.com",
      name: "Lorem Ipsum",
      password: hashedPassword,
      username: "lorem",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

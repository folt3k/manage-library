import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users: any = await prisma.user.findRaw();

  for (const user of users) {
    await prisma.user.update({ where: { id: user._id.$oid }, data: { pesel: user.pesel.toString() } });
  }
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

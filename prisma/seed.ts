import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "janina@gmail.com",
      password: "$2b$10$BcKlU4fMEVnpUWOmSbTUdO6.0O5sAsOWupGqWMubxnZI5w8yL4arW",
      firstName: "Janina",
      lastName: "Kowalska",
      pesel: "78122012899",
      phoneNumber: 123123213,
      role: "LIBRARIAN",
      createdAt: new Date(1663680691898),
      updatedAt: new Date(1663680691898),
      isActive: true,
      disabled: false,
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

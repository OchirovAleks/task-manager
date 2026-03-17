require("dotenv").config({ path: ".env.test", quiet: true });

process.env.NODE_ENV = "test";

if (process.env.NODE_ENV !== "test") {
  throw new Error("Tests must run with NODE_ENV=test");
}

require("dotenv").config({ path: ".env.test" });
const { prisma } = require("../src/prisma");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Did you create .env.test?");
}

process.env.NODE_ENV = "test";

beforeEach(async () => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Task", "Project" RESTART IDENTITY CASCADE;'
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});
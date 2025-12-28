import { prisma } from "./lib/prisma";
async function main() {
  try {
    await prisma.$connect();
    console.log("database is connected");
  } catch (error) {
    console.error(error);
  }
}
main();

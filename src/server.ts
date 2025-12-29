import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.PORT || 6005;
async function main() {
  try {
    await prisma.$connect();
    console.log("database is connected");
    app.listen(PORT, () => {
      console.log(`server is running http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();

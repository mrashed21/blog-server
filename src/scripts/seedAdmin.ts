import { prisma } from "@/lib/prisma";
import { UserRole } from "@/middleware/authMiddleWare";

async function SeedAdmin() {
  try {
    const adminData = {
      name: "Super Admin",
      email: "superadmin@admin.info",
      role: UserRole.admin,
      password: "superadmin123",
    };

    const exsitingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (exsitingUser) {
      throw new Error("User already exist on Database");
    }
    // admin post
    const signupAdmin = await fetch(
      "http://localhost:6005/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
  } catch (error) {
    console.error(error);
  }
}

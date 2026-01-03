import { prisma } from "@/lib/prisma";
import { UserRole } from "@/middleware/authMiddleWare";

async function SeedAdmin() {
  try {
    const adminData = {
      name: "Super Admin",
      email: "superadmin@admin.org",
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

    // update email verify status
    if (signupAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
}

SeedAdmin();

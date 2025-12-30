// import { PrismaClient } from "@generated/prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_ORIGIN!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "active",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verifyURL = `${process.env.APP_ORIGIN}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Blog App" <blog@app.com>',
          // to: user.email,
          to: "islamrohi99@gmail.com",
          subject: "Blog App: verify your email address",
          // text: "Hello world?",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .header {
      background-color: #1c74c0;
      padding: 20px;
      text-align: center;
      color: #ffffff;
    }
    .content {
      padding: 30px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin: 24px 0;
      padding: 14px 24px;
      background-color: #1c74c0;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      padding: 20px;
      font-size: 13px;
      color: #777777;
      background-color: #f5f7fb;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Verify Your Email</h2>
    </div>

    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>

      <p>
        Thank you for signing up for <strong>Blog App</strong>.
        To complete your registration, please verify your email address by clicking the button below.
      </p>

      <p style="text-align: center;">
        <a href="${verifyURL}" class="button">Verify Email Address</a>
      </p>

      <p>
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="word-break: break-all;">
        <a href="${verifyURL}">${verifyURL}</a>
      </p>

      <p>
        This verification link will expire for security reasons.
        If you did not create an account, you can safely ignore this email.
      </p>

      <p>
        Regards,<br />
        <strong>Blog App Team</strong>
      </p>
    </div>

    <div class="footer">
      <p>
        © ${new Date().getFullYear()} Blog App. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`,
        });
      } catch (error) {
        throw new Error("Something went wrong");
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
});

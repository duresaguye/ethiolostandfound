import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {  
        enabled: true,
        ssl: {
            rejectUnauthorized: false,
          },
          session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
        }
    },
});
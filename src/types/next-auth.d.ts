import NextAuth from "next-auth/next";

declare module "next-auth" {
    interface User {
        lastName: string;
    }
    interface Session {
        user: User & {
            lastName: string;
        }
        token: {
            lastName: string;
        }
    }
}
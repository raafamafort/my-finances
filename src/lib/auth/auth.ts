import { db } from "@lib/db/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages : {
        signIn: '/sign-in',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                if(!credentials?.email || !credentials?.password) return null;

                const existingUser = await db.user.findUnique({
                    where: { email: credentials?.email }
                });
                if (!existingUser) return null;

                const passwordMatch = await compare(credentials?.password, existingUser.password);
                if(!passwordMatch) return null;

                return {
                    id: `${existingUser.id}`,
                    name: existingUser.name,
                    lastName: existingUser.lastName,
                    email: existingUser.email
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user){
                return {
                    ...token,
                    email: user.email,
                    name: user.name,
                    lastName: user.lastName
                }
            }
            return token;
        },
        async session({session, user, token}) {
            return {
                ...session,
                user: {
                    ...session.user,
                    email: token.email,
                    name: token.name,
                    lastName: token.lastName
                }
            }
        }
    }
}
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions, getServerSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { db } from "~/server/db/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: { ...session.user, id: user.id },
    }),
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
    // Swap or add providers here. See https://next-auth.js.org/providers
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);

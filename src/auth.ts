import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || "fallback_secret_for_hackathon_only_do_not_use_in_prod",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For the hackathon MVP, we allow any login attempt to succeed
        // as long as they provided an email.
        if (credentials?.email) {
          return {
            id: "1",
            name: (credentials.email as string).split('@')[0],
            email: credentials.email as string,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + credentials.email
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized() {
      return true; // We are allowing anyone to view the pages for now, just checking if logged in.
    },
  },
})

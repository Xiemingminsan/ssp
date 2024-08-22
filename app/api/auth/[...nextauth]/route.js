import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "../../../../models/user";
import dbConnect from "../../../../dbConnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Connect to the database
        await dbConnect();

        // Find the user in the database
        const user = await User.findOne({ username: credentials.username });

        if (!user) {
          throw new Error("User not found");
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordhash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Return the user object (excluding sensitive fields)
        return {
          id: user._id,
          name: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to the token for later use in session
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the user id and role to the session object
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
};

// Pass authOptions to NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "../../../../models/user";
import Management from "../../../../models/management";
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

        // First, try to find the user in the User model
        let user = await User.findOne({ username: credentials.username });

        // If not found, try to find the user in the Management model using email
        let management = null;
        if (!user) {
          management = await Management.findOne({
            email: credentials.username,
          });
        }

        // If neither user nor management is found, throw an error
        if (!user && !management) {
          throw new Error("M or U   not found");
        }

        // Determine which model to use and validate the password
        const isPasswordValid = user
          ? await bcrypt.compare(credentials.password, user.passwordhash)
          : await bcrypt.compare(credentials.password, management.password);

        console.log;
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Return the user object (for NextAuth) with management or user details
        return {
          id: user ? user._id : management._id,
          name: user ? user.username : management.name,
          email: user ? user.email : management.email,
          role: user ? user.role : management.role,
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

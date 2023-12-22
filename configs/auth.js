import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers//google";
import Credentials from "next-auth/providers/credentials";
import { getRecords } from "./service";
import bcrypt from "bcryptjs";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "email", type: "email", required: true },
        password: { label: "password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const users = await getRecords();

        const currentUser = users.find(
          (user) => user.fields.email === credentials.email
        );
        if (
          currentUser &&
          (await bcrypt.compare(
            credentials.password,
            currentUser.fields.password
          ))
        ) {
          const {
            fields: { password, ...fieldsWithoutPassword },
          } = currentUser;

          return fieldsWithoutPassword;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(user, account, profile) {
      const users = await getRecords(); // Отримайте всіх користувачів з бази даних

      const existingUser = users.find(
        (u) => u.fields.email === user.user.email
      );

      if (!existingUser) {
        // Якщо користувача немає в базі даних, перенаправте його на сторінку реєстрації
        console.log(user.user.email);
        return "/";
      }

      // Якщо користувач існує, дозволяємо вхід
      return true;
    },
  },
};

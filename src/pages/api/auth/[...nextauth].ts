// import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CognitoProvider from "next-auth/providers/cognito";
// import { serialize } from "cookie";

interface ICustomSession extends Session {
  accessToken: string;
  refreshToken: string;
}

const nextAuthOptions = (res: NextApiResponse) => {
  return {
    providers: [
      CognitoProvider({
        clientId: process.env.COGNITO_CLIENT_ID as string,
        clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
        issuer: process.env.COGNITO_ISSUER,
      }),
    ],
    callbacks: {
      async jwt({ token, user, account }) {
        console.log(`Inside NextAuth jwt callback.`);
        if (user) {
          token.accessToken = account?.access_token;
          token.refreshToken = account?.refresh_token;
          token.idToken = account?.id_token;
        }
        // if (account?.id_token) {
        //   console.log(`Setting id_token as Cookie from NextAuth jwt callback.`);
        //   res.setHeader(
        //     "Set-Cookie",
        //     serialize("ID_TOKEN_COOKIE_KEY", account?.id_token || "", {
        //       path: "/",
        //     }),
        //   );
        //   const decoded = jwt.decode(account.id_token);
        //   if (decoded && typeof decoded === "object") {
        //     if ("cognito:groups" in decoded) {
        //       const userRole = decoded["cognito:groups"][0];
        //       token.userRole = userRole;
        //     }
        //   }
        // }
        return token;
      },

      async session({
        session,
        token,
      }: {
        session: Session;
        token: JWT;
      }): Promise<ICustomSession> {
        console.log(`Inside NextAuth session callback.`);
        if (token && session.user) {
          console.log(
            `Attaching tokens to the session object in NextAuth session callback.`,
          );
          session.accessToken = token.accessToken as string;
          session.refreshToken = token.refreshToken as string;
          session.idToken = token.idToken as string;
        }
        return session as ICustomSession;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  } as NextAuthOptions;
};

const Handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("Calling NextAuth API Handler");
    return NextAuth(req, res, nextAuthOptions(res));
  } catch (error) {
    console.log("NextAuth API Handler ERROR : ", error as Error);
  }
};

export default Handler;

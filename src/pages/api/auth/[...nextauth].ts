// import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CognitoProvider from "next-auth/providers/cognito";
// import { serialize } from "cookie";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AdapterUser } from "next-auth/adapters";

interface ICustomSession extends Session {
  accessToken: string;
  refreshToken: string;
}

function calculateSecretHash(username: string) {
  return crypto
    .createHmac("sha256", process.env.COGNITO_CLIENT_SECRET!)
    .update(username + process.env.COGNITO_CLIENT_ID!)
    .digest("base64");
}

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "cognito-credentials",
      name: "Cognito",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.COGNITO_CLIENT_ID!,
            AuthParameters: {
              USERNAME: credentials?.email as string,
              PASSWORD: credentials?.password as string,
              SECRET_HASH: calculateSecretHash(credentials?.email as string), // Remove if no secret
            },
          });

          const response = await cognitoClient.send(command);

          if (response.AuthenticationResult) {
            return {
              id: credentials?.email as string,
              email: credentials?.email,
              accessToken: response.AuthenticationResult.AccessToken,
              idToken: response.AuthenticationResult.IdToken,
              refreshToken: response.AuthenticationResult.RefreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error("Cognito Error:", error);
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as AdapterUser).accessToken;
        token.idToken = user.idToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
};
// const nextAuthOptions = (res: NextApiResponse) => {
//   return {
//     providers: [
//       CognitoProvider({
//         clientId: process.env.COGNITO_CLIENT_ID as string,
//         clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
//         issuer: process.env.COGNITO_ISSUER,
//       }),
//     ],
//     callbacks: {
//       async jwt({ token, user, account }) {
//         console.log(`Inside NextAuth jwt callback.`);
//         if (user) {
//           token.accessToken = account?.access_token;
//           token.refreshToken = account?.refresh_token;
//           token.idToken = account?.id_token;
//         }
//         // if (account?.id_token) {
//         //   console.log(`Setting id_token as Cookie from NextAuth jwt callback.`);
//         //   res.setHeader(
//         //     "Set-Cookie",
//         //     serialize("ID_TOKEN_COOKIE_KEY", account?.id_token || "", {
//         //       path: "/",
//         //     }),
//         //   );
//         //   const decoded = jwt.decode(account.id_token);
//         //   if (decoded && typeof decoded === "object") {
//         //     if ("cognito:groups" in decoded) {
//         //       const userRole = decoded["cognito:groups"][0];
//         //       token.userRole = userRole;
//         //     }
//         //   }
//         // }
//         return token;
//       },

//       async session({
//         session,
//         token,
//       }: {
//         session: Session;
//         token: JWT;
//       }): Promise<ICustomSession> {
//         console.log(`Inside NextAuth session callback.`);
//         if (token && session.user) {
//           console.log(
//             `Attaching tokens to the session object in NextAuth session callback.`,
//           );
//           session.accessToken = token.accessToken as string;
//           session.refreshToken = token.refreshToken as string;
//           session.idToken = token.idToken as string;
//         }
//         return session as ICustomSession;
//       },
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//   } as NextAuthOptions;
// };

const Handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("Calling NextAuth API Handler");
    return NextAuth(req, res, nextAuthOptions);
  } catch (error) {
    console.log("NextAuth API Handler ERROR : ", error as Error);
  }
};

export default Handler;

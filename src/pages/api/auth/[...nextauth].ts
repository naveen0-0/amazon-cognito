// import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, {
  NextAuthOptions,
  // Session
} from "next-auth";
// import { JWT } from "next-auth/jwt";
// import CognitoProvider from "next-auth/providers/cognito";
// import { serialize } from "cookie";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
// import { AdapterUser } from "next-auth/adapters";

// interface ICustomSession extends Session {
//   accessToken: string;
//   refreshToken: string;
// }

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
        token.accessToken = user.accessToken;
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

const Handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("Calling NextAuth API Handler");
    return NextAuth(req, res, nextAuthOptions);
  } catch (error) {
    console.log("NextAuth API Handler ERROR : ", error as Error);
  }
};

export default Handler;

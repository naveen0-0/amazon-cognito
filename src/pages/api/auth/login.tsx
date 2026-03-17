import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

function calculateSecretHash(username: string) {
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET!;
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: calculateSecretHash(email),
      },
    });

    const response = await client.send(command);
    const authResult = response.AuthenticationResult;

    if (authResult) {
      // Set the ID Token in an HTTP-only cookie
      res.setHeader("Set-Cookie", [
        serialize("id_token", authResult.IdToken!, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600, // 1 hour
        }),
      ]);

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Something went wrong" });
  }
}

import {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { serialize, parse } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = parse(req.headers.cookie || "");
  const accessToken = cookies.access_token;

  // 1. Tell Amazon Cognito to revoke the session globally
  if (accessToken) {
    try {
      const command = new GlobalSignOutCommand({
        AccessToken: accessToken,
      });
      await client.send(command);
    } catch (error) {
      console.error("Cognito Global Signout failed:", error);
      // We continue anyway to clear local cookies
    }
  }

  // 2. Clear Local Cookies (Local Session)
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    expires: new Date(0),
  };

  res.setHeader("Set-Cookie", [
    serialize("id_token", "", cookieOptions),
    serialize("access_token", "", cookieOptions),
  ]);

  return res.status(200).json({ message: "Logged out locally and globally" });
}

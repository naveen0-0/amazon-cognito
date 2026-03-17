import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 1. Extract the cookie from the request headers
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.id_token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    /** * 2. Verify the Token
     * In a production app, you should verify the signature using the
     * Cognito JWKS (public keys). For now, we decode it to check expiry.
     */
    const decoded = jwt.decode(token) as any;

    // Check if token is expired
    if (!decoded || Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: "Token expired" });
    }

    // 3. Return user info (email, groups, etc.)
    return res.status(200).json({
      user: {
        email: decoded.email,
        sub: decoded.sub,
        roles: decoded["cognito:groups"] || [],
      },
    });
  } catch (error) {
    console.log(35, "error", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}

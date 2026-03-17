import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.id_token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.decode(token) as any;

    if (!decoded || Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: "Token expired" });
    }

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

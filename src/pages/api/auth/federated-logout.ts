// import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function federatedLogout(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const cognitoDomain = process.env.COGNITO_API_URL;
    const clientId = process.env.COGNITO_CLIENT_ID;
    const logoutUri = "http://localhost:3000"; // EXACTLY as in AWS Console

    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;

    return res.redirect(logoutUrl);
  } catch (error) {
    throw error;
  }
}

import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();

  const handleLogout = async () => {
    // 1. Clear the local NextAuth session
    await signOut({ redirect: false });

    // 2. Constants (Double check these match your .env and AWS Console)
    const cognitoDomain =
      "https://us-east-18cihl070h.auth.us-east-1.amazoncognito.com";
    const clientId = "2lucfvfs1pb37ekqb3fsq4run6";
    const logoutUri = "http://localhost:3000"; // EXACTLY as in AWS Console

    // 3. Construct the URL with proper encoding
    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;

    // 4. Hard redirect to Cognito's logout page
    // window.location.href = logoutUrl;
    window.location.href = "/api/auth/federated-logout";
  };

  return (
    <div className="h-screen">
      <p className="text-[72px]">Home Page</p>
      <button
        className="bg-blue-400 text-slate-900 font-bold p-4 cursor-pointer"
        onClick={handleLogout}
      >
        Log out
      </button>

      <p>{JSON.stringify(data, null, 2)}</p>
    </div>
  );
}

import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
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

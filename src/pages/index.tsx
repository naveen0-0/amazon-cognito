// import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  // const { data } = useSession();

  // const handleLogout = async () => {
  //   await signOut({ redirect: false });
  //   window.location.href = "/api/auth/federated-logout";
  // };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        // Redirect to login after cookies are cleared
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
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

      {/* <p>{JSON.stringify(data, null, 2)}</p> */}
    </div>
  );
}

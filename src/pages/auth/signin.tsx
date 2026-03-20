import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("cognito-credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/"); // Successful login
    }
  };

  const handleForgotPass = () => {
    console.log("Password Forgot");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Sign In</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition cursor-pointer">
          Login
        </button>
      </form>

      <button onClick={handleForgotPass}>Forgot Password?</button>
    </div>
  );
}

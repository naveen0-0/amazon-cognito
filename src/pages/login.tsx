import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginBodySchema, TLoginBodyInput } from "@/schemas/loginSchema";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginBodyInput>({
    resolver: zodResolver(loginBodySchema),
  });

  const onLogin = async (data: TLoginBodyInput) => {
    console.log(data);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/");
    } else {
      const result = await res.json();
      setError(result.message);
    }
    setLoading(false);

    // try {
    // const { isSignedIn, nextStep } = await signIn({
    //   username: data.email,
    //   password: data.password,
    // });

    //   // Amplify tells you exactly what to do next based on Cognito's state
    //   switch (nextStep.signInStep) {
    //     case "CONFIRM_SIGN_UP":
    //       router.push("/verify-email");
    //       break;
    //     case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
    //       router.push("/force-password-change");
    //       break;
    //     case "DONE":
    //       router.push("/");
    //       break;
    //     default:
    //       if (isSignedIn) router.push("/");
    //   }
    // } catch {
    //   setError("An error occurred during sign in.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onLogin)}
        className="p-8 border rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border rounded"
            type="email"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">
              {errors.email.message as string}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            {...register("password", { required: "Password is required" })}
            className="w-full p-2 border rounded"
            type="password"
          />
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message as string}
            </span>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

const BaseLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");

        if (res.ok) {
          const data = await res.json();
          console.log("Logged in as:", data.user.email);
          setIsLoading(false);
        } else {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        console.log(error);
        if (router.pathname !== "/login") {
          router.push("/login");
        } else {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [router.pathname]);

  if (isLoading) return "Loading...";

  return <div>{children}</div>;
};

export default BaseLayout;

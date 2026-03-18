import { signIn, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";

const BaseLayout = ({ children }: { children: ReactNode }) => {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const isAuthPage = router.pathname.startsWith("/auth");

    if (!data && status === "unauthenticated" && !isAuthPage) {
      signIn();
    }
  }, [data, status, router.pathname]);

  const isAuthPage = router.pathname.startsWith("/auth");
  const loadingState =
    status === "loading" || (status === "unauthenticated" && !isAuthPage);

  if (loadingState) return <p>Loading...</p>;

  return <div>{children}</div>;
};

export default BaseLayout;

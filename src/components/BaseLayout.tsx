import { signIn, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
// import Cookies from "js-cookie";
import useIsWindow from "@/hooks/usIsWindow";

const BaseLayout = ({ children }: { children: ReactNode }) => {
  const { isWindow } = useIsWindow();
  const { data, status } = useSession();

  console.log(data);

  useEffect(() => {
    if (!data && status === "unauthenticated") {
      signIn("cognito", undefined, { prompt: "login" });
    }
  }, [data, status, isWindow]);

  const loadingState = status === "loading" || status === "unauthenticated";

  if (loadingState) return "loading...";

  if (!isWindow) return null;

  return <div>{children}</div>;
};

export default BaseLayout;

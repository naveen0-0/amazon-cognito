import { useState, useEffect } from "react";

const useIsWindow = () => {
  const [isWindow, setIsWindow] = useState(false);

  useEffect(() => {
    if (window && typeof window !== "undefined") {
      setIsWindow(true);
    }
  }, []);

  return { isWindow } as const;
};

export default useIsWindow;

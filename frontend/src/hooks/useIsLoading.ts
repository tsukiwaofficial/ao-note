import { useState } from "react";

export const useIsLoading = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return {
    isLoading,
    setIsLoading,
  };
};

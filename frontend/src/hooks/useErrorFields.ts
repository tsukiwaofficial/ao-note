import { useState } from "react";

export const useErrorFields = () => {
  const [errorField, setErrorField] = useState<string>("");
  const [errorFields, setErrorFields] = useState<string[]>([]);

  return {
    errorField,
    errorFields,
    setErrorField,
    setErrorFields,
  };
};

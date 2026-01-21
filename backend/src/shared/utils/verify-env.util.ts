import dotenv from "dotenv";
dotenv.config();

export const verifyEnv = (key: string): string => {
  const value = process.env[key];
  if (!value)
    throw new Error(`Environment variable named "${key}" is missing or empty.`);

  return value;
};

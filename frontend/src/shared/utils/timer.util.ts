export const timer = (seconds: number) => {
  const timer = seconds * 1000;

  return new Promise((resolve) => setTimeout(resolve, timer));
};

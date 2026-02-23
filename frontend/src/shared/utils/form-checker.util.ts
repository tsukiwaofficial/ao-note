export const formChecker = <T extends object>(data: T): string[] => {
  const dataKeys = Object.keys(data);

  const emptyKeys = dataKeys.filter((key) => {
    const value = data[key as keyof T];
    return value === "" || value === null || value === undefined;
  });

  return emptyKeys;
};

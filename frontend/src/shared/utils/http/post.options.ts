export const postOptions = <T>(payload: T) => {
  return {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export const postOptions = <T>(payload: T): RequestInit => {
  return {
    method: "POST",
    body: JSON.stringify(payload),
  };
};

export const putOptions = <T>(payload: T): RequestInit => {
  return {
    method: "PUT",
    body: JSON.stringify(payload),
  };
};

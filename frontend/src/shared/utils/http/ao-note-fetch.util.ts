export const aoNoteFetch = (url: string, options: RequestInit = {}) => {
  return fetch(import.meta.env.VITE_BACKEND_URL + url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

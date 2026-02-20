import type { UserAuth } from "./user.types";

export const createGuestToken = () => {
  if (!localStorage.getItem("guestToken")) {
    const payload = {
      id: `guest_${Math.random().toString(36)}`,
      role: "guest",
      createdAt: Date.now(),
    };

    const jsonStr = JSON.stringify(payload);
    const base64Token = btoa(jsonStr);

    const result = `guest.${base64Token}`;

    localStorage.setItem("guestToken", result);
  }
};

export const decodeGuestToken = (token: string): UserAuth => {
  const parts = token.split(".");
  const role = parts[0];

  return { role: role, token: token };
};

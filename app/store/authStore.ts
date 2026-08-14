import { create } from "zustand";
import type { AuthState, User } from "../../src/types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user:
    typeof window !== "undefined"
      ? (JSON.parse(localStorage.getItem("userData") || "null") as User | null)
      : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false,

  setAuth: (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

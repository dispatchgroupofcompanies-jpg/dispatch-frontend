import { API_BASE_URL } from "../config/api";
import type { User } from "../types/auth";

export async function getSession(): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result.user || null;
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Could not sign out. Please try again.");
  localStorage.removeItem("token"); // Remove any pre-migration token.
  localStorage.removeItem("userData");
}

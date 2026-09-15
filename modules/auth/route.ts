import { API_BASE_URL } from "../../src/config/api";

const API_URL = API_BASE_URL;

export const signin = async (data: {
  email: string;
  password: string;
  deviceId?: string;
  userAgent?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        status: result.status,
        message: result.message || "Login failed",
        error: result,
      };
    }

    return {
      success: true,
      ...result,
    };
  } catch (error: unknown) {
    console.error("Login error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Network error";
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
};

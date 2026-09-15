import { API_BASE_URL } from "../../config/api";

const API_URL = API_BASE_URL;

// 🔥 RESET ADMIN PASSWORD
export const resetAdminPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/admin/reset-password`, {
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
        message: result.message || "Password reset failed",
        error: result,
      };
    }

    return {
      success: true,
      ...result,
    };
  } catch (error: unknown) {
    console.error("Reset password error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Network error";
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
};

// 🔥 GET ADMIN PROFILE
export const getAdminProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch profile",
        error: result,
      };
    }

    return {
      success: true,
      ...result,
    };
  } catch (error: unknown) {
    console.error("Get profile error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Network error";
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
};

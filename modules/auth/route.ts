const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const signin = async (data: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
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

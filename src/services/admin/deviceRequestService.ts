const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface DeviceRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  deviceId: string;
  userAgent?: string;
  ip?: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  lastSeenAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  recentPending: number;
}

export interface DeviceRequestsResponse {
  success: boolean;
  deviceRequests: DeviceRequest[];
  total: number;
  page: number;
  totalPages: number;
}

// Get all device requests with optional status filter
export const getAllDeviceRequests = async (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  status: string = "",
): Promise<DeviceRequestsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status,
    });

    const response = await fetch(`${API_URL}/admin/device-requests?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        deviceRequests: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching device requests:", error);
    return {
      success: false,
      deviceRequests: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };
  }
};

// Get all pending device requests
export const getPendingDeviceRequests = async (
  page: number = 1,
  limit: number = 20,
  search: string = "",
): Promise<DeviceRequestsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });

    const response = await fetch(
      `${API_URL}/admin/device-requests/pending?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        deviceRequests: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching pending device requests:", error);
    return {
      success: false,
      deviceRequests: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };
  }
};

// Get user device history
export const getUserDeviceHistory = async (
  userId: string,
): Promise<{ success: boolean; deviceRequests: DeviceRequest[] }> => {
  try {
    const response = await fetch(
      `${API_URL}/admin/device-requests/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user device history:", error);
    return {
      success: false,
      deviceRequests: [],
    };
  }
};

// Approve a device request
export const approveDeviceRequest = async (
  id: string,
): Promise<{
  success: boolean;
  message: string;
  deviceRequest?: DeviceRequest;
}> => {
  try {
    const response = await fetch(
      `${API_URL}/admin/device-requests/${id}/approve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error approving device request:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to approve device request",
    };
  }
};

// Reject a device request
export const rejectDeviceRequest = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${API_URL}/admin/device-requests/${id}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error rejecting device request:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to reject device request",
    };
  }
};

// Revoke an approved device request
export const revokeDeviceRequest = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${API_URL}/admin/device-requests/${id}/revoke`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error revoking device request:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to revoke device request",
    };
  }
};

// Get device request statistics
export const getDeviceRequestStats = async (): Promise<{
  success: boolean;
  stats: DeviceRequestStats;
}> => {
  try {
    const response = await fetch(`${API_URL}/admin/device-requests/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        stats: {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          recentPending: 0,
        },
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching device request stats:", error);
    return {
      success: false,
      stats: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        recentPending: 0,
      },
    };
  }
};

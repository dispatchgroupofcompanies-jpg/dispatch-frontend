import axios from "axios";
import type { LoadBoardRecord } from "../../app/user/loadboard/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Get all load board records
export const getAllLoadBoardRecords = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/user/loadboard`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching load board records:", error);
    throw error;
  }
};

// Create new load board record
export const createLoadBoardRecord = async (
  recordData: Partial<LoadBoardRecord>,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/loadboard`,
      recordData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error creating load board record:", error);
    throw error;
  }
};

// Update load board record
export const updateLoadBoardRecord = async (
  id: string,
  recordData: Partial<LoadBoardRecord>,
) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/loadboard/${id}`,
      recordData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error updating load board record:", error);
    throw error;
  }
};

// Delete load board record
export const deleteLoadBoardRecord = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}/user/loadboard/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting load board record:", error);
    throw error;
  }
};

// Search load board records
export const searchLoadBoardRecords = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/loadboard/search`, {
      ...getAuthHeaders(),
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching load board records:", error);
    throw error;
  }
};

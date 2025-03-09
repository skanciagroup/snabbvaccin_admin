import { Bus, BusForm } from "@/types/database";
      import { errorToast } from "@/utils/toastUtils";

const API_URL = "/api/bus";

export const busService = {
  fetchBuses: async (): Promise<Bus[]> => {
    const response = await fetch(`${API_URL}/list`);
    if (!response.ok) {
      throw new Error("Failed to fetch buses");
    }
    return response.json();
  },

  createBus: async (busData: BusForm) => {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(busData),
    });
    if (response.status === 409) {
      errorToast("A bus with the same ID already exists."); // Toast for conflict
      throw new Error("Conflict: A bus with the same ID already exists.");
    }
    if (!response.ok) {
      throw new Error("Failed to create bus");
    }
    return response.json();
  },

  editBus: async (busId: number, busData: Bus) => {
    const response = await fetch(`${API_URL}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...busData }),
    });
    if (response.status === 409) {
      errorToast("A bus with the same ID already exists."); // Toast for conflict
      throw new Error("Conflict: A bus with the same ID already exists.");
    }
    if (!response.ok) {
      throw new Error("Failed to update bus");
    }
    return response.json();
  },

  deleteBus: async (busId: number) => {
    const response = await fetch(`${API_URL}/delete`, {
      method: "DELETE",
      body: JSON.stringify({ id: busId }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete bus");
    }
    return response.json();
  },
};

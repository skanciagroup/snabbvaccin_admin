import { Location, LocationForm } from "@/types/database"; // Adjust the import based on your types
import { errorToast } from "@/utils/toastUtils";

const API_URL = "/api/location"; // Adjust the API URL as needed

export const locationService = {
  fetchLocations: async (): Promise<Location[]> => {
    const response = await fetch(`${API_URL}/list`);
    if (!response.ok) {
      const errorData = await response.json(); // Log the error response
      throw new Error(`Failed to fetch locations: ${errorData.message}`);
    }
    return response.json();
  },

  createLocation: async (locationData: LocationForm) => {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(locationData),
    });
    if (response.status === 409) {
      errorToast("A location with the same name already exists."); // Toast for conflict
      throw new Error(
        "Conflict: A location with the same name already exists.",
      );
    }
    if (!response.ok) {
      throw new Error("Failed to create location");
    }
    return response.json();
  },

  editLocation: async (locationId: number, locationData: Location) => {
    console.log('test',locationId, locationData);
    const response = await fetch(`${API_URL}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: locationId,
        name: locationData.name,
        address: locationData.address,
        mvid: locationData.mvid,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json(); // Log the error response
      throw new Error(`Failed to update location: ${errorData.message}`);
    }
    return response.json();
  },

  deleteLocation: async (locationId: number) => {
    const response = await fetch(`${API_URL}/delete`, {
      method: "DELETE",
      body: JSON.stringify({ id: locationId }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete location");
    }
    return response.json();
  },
};

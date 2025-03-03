import { Organisation } from "@/types/database";
import { errorToast } from "@/utils/toastUtils";

const API_URL = "/api/organisation";

export const organisationService = {
  fetchOrganisations: async (): Promise<Organisation[]> => {
    const response = await fetch(`${API_URL}/list`);
    if (!response.ok) {
      throw new Error("Failed to fetch organisations");
    }
    return response.json();
  },

  createOrganisation: async (organisationData: Omit<Organisation, "id">) => {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organisationData),
    });
    if (response.status === 409) {
      errorToast("An organisation with the same name already exists."); // Toast for conflict
      throw new Error("Conflict: An organisation with the same name already exists.");
    }
    if (!response.ok) {
      throw new Error("Failed to create organisation");
    }
    return response.json();
  },

  editOrganisation: async (
    organisationId: number,
    organisationData: Organisation,
  ) => {
    const response = await fetch(`${API_URL}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...organisationData }),
    }); 
    if (response.status === 409) {
      errorToast("An organisation with the same name already exists."); // Toast for conflict
      throw new Error("Conflict: An organisation with the same name already exists.");
    }
    if (!response.ok) {
      throw new Error("Failed to update organisation");
    }
    return response.json();
  },

  deleteOrganisation: async (organisationId: number) => {
    const response = await fetch(`${API_URL}/delete`, {
      method: "DELETE",
      body: JSON.stringify({ id: organisationId }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete organisation");
    }
    return response.json();
  },
};

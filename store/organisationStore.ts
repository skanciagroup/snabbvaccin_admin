import { create } from "zustand";

interface Organisation {
  id: number;
  name: string;
}

interface OrganisationStore {
  organisations: Organisation[];
  loading: boolean;
  setOrganisations: (organisations: Organisation[]) => void;
  fetchOrganisations: () => Promise<void>;
}

const useOrganisationStore = create<OrganisationStore>((set) => ({
  organisations: [],
  loading: false,
  setOrganisations: (organisations) => set({ organisations }),
  fetchOrganisations: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/organisation/list");
      const data = await response.json();
      set({ organisations: data });
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useOrganisationStore;

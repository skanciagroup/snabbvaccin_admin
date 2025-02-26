import { create } from "zustand";
import { Bus } from "@/types/database";

interface BusStore {
  buses: Bus[];
  loading: boolean;
  setBuses: (buses: Bus[]) => void;
  fetchBuses: () => Promise<void>;
}

const useBusStore = create<BusStore>((set) => ({
  buses: [],
  loading: false,
  setBuses: (buses) => set({ buses }),
  fetchBuses: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/bus/list");
      const data = await response.json();
      set({ buses: data });
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useBusStore;

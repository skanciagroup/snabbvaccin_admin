import {create} from "zustand";
import { locationService } from "@/services/locationService";
import { Location } from "@/types/database";

interface LocationStore {
  locations: Location[];
  setLocations: (locations: Location[]) => void;
  fetchLocations: () => Promise<void>;
  createLocation: (locationData: Omit<Location, "id">) => Promise<void>;
  editLocation: (locationId: number, locationData: Location) => Promise<void>;
  deleteLocation: (locationId: number) => Promise<void>;
}

const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  setLocations: (locations) => set({ locations }),

  fetchLocations: async () => {
    try {
      const fetchedLocations = await locationService.fetchLocations();
      set({ locations: fetchedLocations });
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  },

  createLocation: async (locationData) => {
    try {
      const newLocation = await locationService.createLocation(locationData);
      set((state) => ({
        locations: [...state.locations, newLocation],
      }));
    } catch (error) {
      console.error("Error creating location:", error);
    }
  },

  editLocation: async (locationId, locationData) => {
    try {
      await locationService.editLocation(locationId, locationData);
      set((state) => ({
        locations: state.locations.map((location) =>
          location.id === locationId
            ? { ...location, ...locationData }
            : location,
        ),
      }));
    } catch (error) {
      console.error("Error editing location:", error);
    }
  },

  deleteLocation: async (locationId) => {
    try {
      await locationService.deleteLocation(locationId);
      set((state) => ({
        locations: state.locations.filter(
          (location) => location.id !== locationId,
        ),
      }));
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  },
}));

export default useLocationStore;

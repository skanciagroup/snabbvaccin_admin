import { create } from "zustand";

interface DisabledState {
  disabledSwitch: boolean; // Represents the disabled state
  setDisabledSwitch: (disabledSwitch: boolean) => void; // Function to update the disabled state
}

// Create the disabled store
const useDisabledStore = create<DisabledState>((set) => ({
  disabledSwitch: false, // Initial state
  setDisabledSwitch: (disabledSwitch) => set({ disabledSwitch }), // Update the state
}));

export default useDisabledStore;

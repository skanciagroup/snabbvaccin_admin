import { create } from "zustand";

interface SidebarStore {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const getInitialSidebarState = () => {
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("sidebarState");
    return savedState ? JSON.parse(savedState) : false; // Default to false if not found
  }
  return false; // Fallback for server-side rendering
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: getInitialSidebarState(),
  toggleSidebar: () =>
    set((state) => {
      const newState = !state.isOpen;
      localStorage.setItem("sidebarState", JSON.stringify(newState)); // Save to localStorage
      return { isOpen: newState };
    }),
  setSidebarOpen: (open) => {
    localStorage.setItem("sidebarState", JSON.stringify(open)); // Save to localStorage
    set({ isOpen: open });
  },
}));

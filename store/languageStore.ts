import { create } from "zustand";

interface LanguageStore {
  language: string;
  setLanguage: (language: string) => void;
}

// Function to get the initial language state from local storage
const getInitialLanguageState = () => {
  if (typeof window !== "undefined") {
    const savedLanguage = localStorage.getItem("language");
    console.log("Initial language state:", savedLanguage); // Debug log
    return savedLanguage || "en"; // Default to 'en' if not found
  }
  return "en"; // Fallback for server-side rendering
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: getInitialLanguageState(), // Use the function to set the initial state
  setLanguage: (language) => {
    console.log("Setting language to:", language); // Debug log
    set({ language });
    localStorage.setItem("language", language); // Save the selected language to local storage
  },
}));

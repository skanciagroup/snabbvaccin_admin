import { create } from "zustand";
import { ProfileUser } from "@/types/database"; 
interface UserStore {
  users: ProfileUser[];
  loading: boolean;
  setUsers: (users: ProfileUser[]) => void;
  fetchUsers: () => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  setUsers: (users) => set({ users }),
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/user/list");
      const data = await response.json();
      set({ users: data });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUserStore;

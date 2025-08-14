import { create } from "zustand";

type User = { id: number; email: string; name: string } | null;

type AuthState = {
  token: string | null;
  user: User;
  setToken: (t: string | null) => void;
  setUser: (u: User) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem("jwt"),
  user: null,
  setToken: (t) => {
    if (t) localStorage.setItem("jwt", t);
    else localStorage.removeItem("jwt");
    set({ token: t });
  },
  setUser: (u) => set({ user: u }),
  logout: () => {
    localStorage.removeItem("jwt");
    set({ token: null, user: null });
  },
}));
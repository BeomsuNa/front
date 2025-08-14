// src/store/auth.ts
import { create } from "zustand";
import { api } from "@/api/clientHook";
import { useMutation } from "@tanstack/react-query";

// POST

export function useSendMagicLink() {
  return useMutation({
    mutationFn: async (email: string) =>
      (await api.post("/auth/magic-link", { email })).data, // 항상 같은 응답
  });
}

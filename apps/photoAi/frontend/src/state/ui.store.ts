import { create } from 'zustand'

type UIState = {
  loginModalOpen: boolean
  openLogin: () => void
  closeLogin: () => void
}

export const useUI = create<UIState>()((set) => ({
  loginModalOpen: false,
  openLogin: () => set({ loginModalOpen: true }),
  closeLogin: () => set({ loginModalOpen: false }),
}))
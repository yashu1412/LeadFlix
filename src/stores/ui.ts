import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  leadDrawerOpen: boolean
  setLeadDrawerOpen: (open: boolean) => void
  selectedLeadId: string | null
  setSelectedLeadId: (id: string | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  leadDrawerOpen: false,
  setLeadDrawerOpen: (open) => set({ leadDrawerOpen: open }),
  selectedLeadId: null,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
}))
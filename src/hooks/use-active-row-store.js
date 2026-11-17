import { create } from "zustand";

// Table-er active (highlighted) row id. Row click e set hoy, same row e abar click korle clear hoy.
export const useActiveRowStore = create((set) => ({
  activeRowId: null,
  setActiveRowId: (id) => set({ activeRowId: id }),
  toggleActiveRow: (id) =>
    set((state) => ({ activeRowId: state.activeRowId === id ? null : id })),
  clearActiveRow: () => set({ activeRowId: null }),
}));
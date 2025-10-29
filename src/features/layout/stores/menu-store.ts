import { create } from "zustand";
import { persist } from "zustand/middleware";

import { MenuItem } from "../types/menu.types";
import { userMenuSidebar } from "../lib/mutations";

interface MenuState {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
  fetchMenuItems: () => Promise<void>;
  clearError: () => void;
}

// Cache válido por 10 minutos
const CACHE_DURATION = 10 * 60 * 1000;

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      menuItems: [],
      isLoading: false,
      error: null,
      lastFetch: null,

      fetchMenuItems: async () => {
        const { lastFetch, menuItems } = get();
        const now = Date.now();

        // Si tenemos datos en caché y no han expirado, no hacer fetch
        if (
          lastFetch &&
          menuItems.length > 0 &&
          now - lastFetch < CACHE_DURATION
        ) {
          return;
        }

        // Solo mostrar loading si no tenemos datos en caché
        const hasCache = menuItems.length > 0;
        set({ isLoading: !hasCache, error: null });

        try {
          const { views } = await userMenuSidebar();

          if (views) {
            set({
              menuItems: views,
              isLoading: false,
              error: null,
              lastFetch: now,
            });
          } else {
            set({
              isLoading: false,
              error: "Error al cargar el menú",
            });
          }
        } catch (err) {
          console.error("Error fetching menu:", err);
          set({
            isLoading: false,
            error: "Error al cargar el menú",
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "menu-store",
      partialize: (state) => ({
        menuItems: state.menuItems,
        lastFetch: state.lastFetch,
      }),
    }
  )
);

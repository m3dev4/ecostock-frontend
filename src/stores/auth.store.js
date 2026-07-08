import { login, refreshToken } from "@/apis/auth.api";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      /*Actions */
      login: async (credentials) => {
        set({
          loading: true,
          error: null,
        });
        try {
          const response = await login(credentials);
          set({
            refreshToken: response.data.refresh,
            token: response.data.access,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.detail || "Login Failed",
          });
          return false;
        }
      },
      refreshAccessToken: async () => {
        set({
          loading: true,
          error: null,
        });
        try {
          const response = await refreshToken();
          set({
            token: response.data.access,
            loading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.detail || "Refresh Token Failed",
            isAuthenticated: false,
            token: null,
            refreshToken: null,
          });
          return false;
        }
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);


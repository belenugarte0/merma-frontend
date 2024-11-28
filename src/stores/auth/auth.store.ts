import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";

import { isAxiosError } from "axios";

import { logisticDb } from "../../api";
import { ILoginResponse, IUser } from "../../interface";
import { Alerts } from "../../components";

// GUARDA EL ESTADO1
interface AuthState {
  user: undefined | IUser;
  token: undefined | string;
  authStatus: "pending" | "auth" | "not-auth";
}

// GUARDA LAS FUNCIONES QUE MODIFICA EL ESTADO
interface Actions {
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  ForgotPassword: (
    email: string
  ) => Promise<{ [key: string]: string[] } | null>;
  ResetPassword: (
    token: string,
    password: string,
  ) => Promise<{ [key: string]: string[] } | null>;
  VerifyResetToken: (token: string) => Promise<boolean>;
}

const storeApi: StateCreator<AuthState & Actions> = (set, get) => ({
  user: undefined,
  token: undefined,
  authStatus: "pending",

  login: async (email: string, password: string) => {
    try {
      const { data } = await logisticDb.post<ILoginResponse>("/auth/login", {
        email,
        password,
      });

      // CAMBIAR ESTADO
      set(() => ({
        user: data.user,
        token: data.token,
        authStatus: "auth",
      }));

      // MOSTRAR MODAL CON USUARIO
      Alerts({ icon: "success", title: "BIENVENIDO, " + data.user.name });
    } catch (error) {
      // VALIDAR ERROR
      set(() => ({
        user: undefined,
        token: undefined,
        authStatus: "not-auth",
      }));
      if (isAxiosError(error)) {
        let errorMessage = "OCURRIO UN ERROR";
        if (error.response?.status === 403) {
          errorMessage = "EL USUARIO ESTÁ INACTIVO";
        } else if (error.response?.status === 401) {
          errorMessage = "Credenciales inválidas.";
        } else if (error.response?.data.error) {
          errorMessage = error.response.data.error;
        }

        Alerts({ icon: "error", title: errorMessage });
      }
    }
  },

  checkAuthStatus: async () => {
    const token = get().token;

    if (!token) {
      set(() => ({
        user: undefined,
        token: undefined,
        authStatus: "not-auth",
      }));
      return;
    }

    try {
      const { data } = await logisticDb.get<{ user: IUser }>(
        "/auth/checkToken",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      set(() => ({
        user: data.user,
        token: token,
        authStatus: "auth",
      }));
    } catch (error) {
      set(() => ({
        user: undefined,
        token: undefined,
        authStatus: "not-auth",
      }));
      return;
    }
  },

  logout: async () => {
    const token = get().token;

    try {
      await logisticDb.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      set(() => ({
        user: undefined,
        token: undefined,
        authStatus: "not-auth",
      }));
    } catch (error) {
      if (isAxiosError(error)) {
        // MOSTRAR TOAST CON ERROR
        Alerts({ icon: "warning", title: "OCURRIO UN ERROR" });
      }
    }
  },
  ForgotPassword: async (email) => {
    try {
      const { data } = await logisticDb.post<{ message: string }>(
        "/auth/forgot-password",
        { email }
      );

      Alerts({ icon: "success", title: data.message });

      return null;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 429) {
          Alerts({
            icon: "error",
            title:
              error.response?.data.message});
          return null;
        }
        if (error.response?.status === 422) {
          return error.response?.data.errors || {};
        }

        Alerts({
          icon: "error",
          title: "Ocurrió un error al recuperar contraseña",
        });

        return null;
      }
    }
  },

  ResetPassword: async (token, password) => {
    try {
      const { data } = await logisticDb.post<{ message: string }>(
        "/auth/reset-password",
        {
          token,
          password,
        }
      );

      Alerts({ icon: "success", title: data.message });

      return null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        return error.response?.data.errors || {};
      } else if (isAxiosError(error) && error.response?.status === 400) {
        Alerts({
          icon: "warning",
          title: "Token expirado o inválido",
        });
        return null;
      }
      if (isAxiosError(error)) {
        Alerts({
          icon: "warning",
          title: "Ocurrió un error al recuperar contraseña",
        });
        return null;
      }
    }
  },
  VerifyResetToken: async (token: string) => {
    try {
      const { data } = await logisticDb.get<{ message: string }>(
        `/auth/verifyResetToken/${token}`
      );

      if (data.message === "true") {
        Alerts({ icon: "success", title: "TOKEN VALIDO" });
        return true;
      } else {
        Alerts({
          icon: "warning",
          title: "El token no es válido o ha expirado.",
        });
        return false;
      }
    } catch (error) {
      Alerts({ icon: "error", title: "El token no es válido o ha expirado." });
      return false;
    }
  },
});

export const useAuthStore = create<AuthState & Actions>()(
  persist(storeApi, {
    name: "auth-store",
  })
);

import { StateCreator, create } from "zustand";
import {
  IUsersResponse,
  ISimpleUser,
  IUpdateUserResponse,
} from "../../interface";
import { logisticDb } from "../../api";
import { isAxiosError } from "axios";
import { Alerts } from "../../components";

interface UserState {
  users: ISimpleUser[];
}

interface Actions {
  getUsers: (token: string) => Promise<void>;
  deleteUser: (id: string | number, token: string) => Promise<void>;
  createUser: (
    name: string,
    lastname: string,
    document: string,
    email: string,
    phone: string,
    role: string,
    token: string
  ) => Promise<{ [key: string]: string[] } | null>;
  updateUser: (
    id: string | number,
    name: string,
    lastname: string,
    document: string,
    email: string,
    phone: string,
    role: string,
    token: string
  ) => Promise<{ [key: string]: string[] } | null>;
}

const storeApi: StateCreator<UserState & Actions> = (set, get) => ({
  users: [],
  
  getUsers: async (token) => {
    const { data } = await logisticDb.get<IUsersResponse>("/users", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    set(() => ({
      users: data.users,
    }));
  },

  createUser: async (name, lastname, document, email, phone, role, token) => {
    const getUsers = get().getUsers;
    try {
      const { data } = await logisticDb.post<{ message: string }>(
        "/users",
        {
          name,
          lastname,
          document,
          email,
          phone,
          role,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      Alerts({ icon: "success", title: data.message });

      await getUsers(token);
      return null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        return error.response?.data.errors || {};
      }
      if (isAxiosError(error)) {
        Alerts({
          icon: "warning",
          title: "Ocurrió un error al crear el usuario",
        });

        return null;
      }
    }
  },
  updateUser: async (
    id,
    name,
    lastname,
    document,
    email,
    phone,
    role,
    token
  ) => {
    const getUsers = get().getUsers;
    try {
      const { data } = await logisticDb.put<IUpdateUserResponse>(
        `/users/${id}`,
        {
          name,
          lastname,
          document,
          email,
          phone,
          role,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      Alerts({ icon: "success", title: data.message });

      await getUsers(token);
      return null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        return error.response?.data.errors || {};
      }

      Alerts({
        icon: "warning",
        title: "Ocurrió un error al actualizar el usuario",
      });

      return null;
    }
  },
  deleteUser: async (id, token) => {
    try {
      const { data } = await logisticDb.delete(`/users/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      Alerts({ icon: "success", title: data.message });

      await get().getUsers(token);
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        Alerts({
          icon: "warning",
          title: "Ocurrió un error al eliminar el usuario",
        });
      }
    }
  },
});

export const useUserStore = create<UserState & Actions>()(storeApi);

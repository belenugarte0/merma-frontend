import { StateCreator, create } from "zustand";
import { logisticDb } from "../../api";
import { isAxiosError } from "axios";
import { ISimpleRole } from "../../interface/roles/simple-role";
import { IRolesResponse } from "../../interface/roles/roles-response";
import { IUpdateRolResponse } from "../../interface/roles/update-role-response";
import Swal from "sweetalert2";
import { Alerts } from "../../components";

interface RoleState {
  roles: ISimpleRole[];
}

interface Actions {
  getRoles: (token: string) => Promise<void>;
  deleteRole: (id: string | number, token: string) => Promise<void>;
  createRole: (
    name: string,
    permissions: string[],
    token: string
  ) => Promise<{ [key: string]: string[] } | null>;
  updateRole: (
    id: string | number,
    name: string,
    permissions: string[],
    token: string
  ) => Promise<{ [key: string]: string[] } | null>;
}

const storeApi: StateCreator<RoleState & Actions> = (set, get) => ({
  roles: [],

  getRoles: async (token) => {
    const { data } = await logisticDb.get<IRolesResponse>("/roles", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    set(() => ({
      roles: data.roles,
    }));
  },

  updateRole: async (id, name, permissions, token) => {
    const getRoles = get().getRoles;

    try {
      const { data } = await logisticDb.put<IUpdateRolResponse>(
        `/roles/${id}`,
        {
          name,
          permissions,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      Alerts({ icon: 'success', title: data.message });

      await getRoles(token);
      return null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        return error.response?.data.errors || {};
      }
      if (isAxiosError(error)) {
        
        Alerts({ icon: 'warning', title: "Ocurrió un error al actualizar el rol" });   

        return null;
      }
    }
  },
  createRole: async (name, permissions, token) => {
    const getRoles = get().getRoles;

    try {
      const { data } = await logisticDb.post<{ message: string }>(
        "/roles",
        {
          name,
          permissions,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      Alerts({ icon: 'success', title: data.message });

      await getRoles(token);
      return null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        return error.response?.data.errors || {};
      }
      if (isAxiosError(error)) {

        Alerts({ icon: 'warning', title: "Ocurrió un error al crear el rol" });     
        
        return null;
      }
    }
  },
  deleteRole: async (id, token) => {
    try {
      const { data } = await logisticDb.delete(`/roles/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      Alerts({ icon: 'success', title: data.message });


      await get().getRoles(token);
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        Alerts({ icon: 'warning', title: "Ocurrió un error al eliminar el rol" });   
      }
    }
  },
});

export const useRoleStore = create<RoleState & Actions>()(storeApi);

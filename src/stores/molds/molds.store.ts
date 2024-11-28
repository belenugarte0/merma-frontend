import { StateCreator, create } from "zustand";
import {
  IMoldsResponse,
  ISimpleMold,
  IUpdateMoldResponse,
} from "../../interface";
import { logisticDb } from "../../api";
import { isAxiosError } from "axios";
import { Alerts } from "../../components";

interface MoldState {
  molds: ISimpleMold[];
}

interface Actions {
  getMolds: (token: string) => Promise<void>;
  deleteMold: (id: string | number, token: string) => Promise<void>;
  createMold: (
    code_mold: string,
    name_mold: string,
    width: number,
    height: number,
    token: string
  ) => Promise<{ [key: string]: string[] } | null>;
  updateMold: (
    id: string | number,
    code_mold: string,
    name_mold: string,
    width: number,
    height: number,
    token: string
  ) => Promise<{ [key: string]: string[] } | null>;
}

const storeApi: StateCreator<MoldState & Actions> = (set, get) => ({
  molds: [],
  getMolds: async (token) => {
    const { data } = await logisticDb.get<IMoldsResponse>("/molds", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    set(() => ({
      molds: data.molds,
    }));
  },

  createMold: async ( code_mold, name_mold, width, height, token) => {
    const getMolds = get().getMolds;
    try {
      const { data } = await logisticDb.post<{ message: string }>(
        "/molds",
        {
          code_mold,
          name_mold,
          width,
          height    
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      Alerts({ icon: "success", title: data.message });

      await getMolds(token);
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
  updateMold: async (
    id,
    code_mold,
    name_mold,
    width,
    height,    
    token
  ) => {
    const getMolds = get().getMolds;
    try {
      const { data } = await logisticDb.put<IUpdateMoldResponse>(
        `/molds/${id}`,
        {
          code_mold,
          name_mold,
          width,
          height
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      Alerts({ icon: "success", title: data.message });

      await getMolds(token);
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
  deleteMold: async (id, token) => {
    try {
      const { data } = await logisticDb.delete(`/molds/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      Alerts({ icon: "success", title: data.message });

      await get().getMolds(token);
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        Alerts({
          icon: "warning",
          title: "Ocurrió un error al eliminar el conductor",
        });
      }
    }
  },
});

export const useMoldStore = create<MoldState & Actions>()(storeApi);

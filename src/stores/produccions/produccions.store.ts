import { StateCreator, create } from "zustand";
import {
  ISimpleBoard,
} from "../../interface";
import { logisticDb } from "../../api";
import { isAxiosError } from "axios";
import { Alerts } from "../../components";

interface ProduccionsState {
  produccion: ISimpleBoard[];
}

interface Actions {
  createProduccion: (
    cod_order: string,
    merma: string,
    espacio_usado: string,
    imagen: string,
    token: string
  ) => Promise<{ [key: string]: string[] } | null>;

}

const storeApi: StateCreator<ProduccionsState & Actions> = (set, get) => ({
  produccion: [],

  createProduccion: async (cod_order, merma, espacio_usado, imagen, token) => {
    try {
      const { data } = await logisticDb.post<{ message: string }>(
        "/produccions",
        {
          cod_order, merma, espacio_usado, imagen
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      Alerts({ icon: "success", title: data.message });

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

});

export const useProduccionsStore = create<ProduccionsState & Actions>()(storeApi);

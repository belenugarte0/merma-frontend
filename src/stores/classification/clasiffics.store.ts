import { StateCreator, create } from "zustand";
import {
  ISimpleClassific,
  IClassificsResponse
} from "../../interface";
import { apiPapelera } from "../../api";
import { apiModelo } from "../../api";
import { isAxiosError } from "axios";
import { Alerts } from "../../components";
import { ISimpleClassificModel } from "../../interface/classification/simple-classific";

interface ClassificState {
  orders: ISimpleClassific[];
  placabase: ISimpleClassificModel[];
}

interface Actions {
  getTipoa: (quality: string) => Promise<void>;
  modelRandomForest: (
    orders: { order_cod: string; width: string; length: string }[]
  ) => Promise<{placabase: ISimpleClassificModel[] | null}>;
  updateOrderStatus: (orderCodes: string[]) => Promise<void>;

}

const storeApi: StateCreator<ClassificState & Actions> = (set, get) => ({
  placabase: [],
  orders: [],

  getTipoa: async (quality) => {
    const { data } = await apiPapelera.get<IClassificsResponse>(
      `/datapapelera/getTipoa/${quality}`
    );

    set(() => ({
      orders: data.orders,
    }));
  },
  

  modelRandomForest: async (orders) => {
    try {
      const { data } = await apiModelo.post<{ placabase: ISimpleClassificModel[]; }>(
        "/predict",
        { orders }
      );

      Alerts({ icon: "success", title: "SE GENERO EL DISEÑO EXITOSAMENTE!"});
      set({ placabase: data.placabase });
      
      console.log(data.placabase);
      return {
        placabase: data.placabase,
        
      };

    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        return error.response?.data.errors || {};
      }
      if (isAxiosError(error)) {
        Alerts({
          icon: "warning",
          title: "Ocurrió un error al Generar el Modelo",
        });

        return null;
      }
    }
  },
  updateOrderStatus: async (orderCodes) => {
    try {
      const { data } = await apiPapelera.put("/datapapelera/updatePlaca", {
        orderCodes: orderCodes,
      });
      return data;
    } catch (error) {
      console.error("Error updating orders:", error);
      return null;
    }
  },


});

export const useClassificStore = create<ClassificState & Actions>()(storeApi);

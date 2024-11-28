import { StateCreator, create } from "zustand";
import {
  ISimpleOrder,
  IOrdersResponse,
  IUpdateOrderResponse,
} from "../../interface";
import { apiPapelera } from "../../api";
import { isAxiosError } from "axios";
import { Alerts } from "../../components";

interface OrderState {
  orders: ISimpleOrder[];
}

interface Actions {
  getTipoa: (quality:string) => Promise<void>;
  getOrders: (status:string) => Promise<void>;
  updateToStatus: (
    id: string | number,status:string,listStatus: string
  ) => Promise<{ [key: string]: string[] } | null>;
  updateOrderToStatus: (
    id: string | number
  ) => Promise<{ [key: string]: string[] } | null>;
}

const storeApi: StateCreator<OrderState & Actions> = (set, get) => ({
  orders: [],
  getOrders: async (status) => {
    const { data } = await apiPapelera.get<IOrdersResponse>(
      `/datapapelera/getAll/${status}`
    );

    set(() => ({
      orders: data.orders,
    }));    
  },

  getTipoa: async (quality) => {
    const { data } = await apiPapelera.get<IOrdersResponse>(
      `/datapapelera/getTipoa/${quality}`
    );

    set(() => ({
      orders: data.orders,
    }));    
  },
  
  updateToStatus: async (id,status,listStatus: string) => {
    const getOrders = get().getOrders;
    try {
      const { data } = await apiPapelera.put<IUpdateOrderResponse>(
        `/datapapelera/updateToStatus/${id}/${status}`
      );
      
      Alerts({ icon: 'success', title: data.message });    
      
      await getOrders(listStatus);
      
      return null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        return error.response?.data.errors || {};
      }
      Alerts({ icon: 'warning', title: "Ocurrió un error al actualizar la Orden" });   
      return null;
    }
  },
  updateOrderToStatus: async (id) => {
    try {
      const { data } = await apiPapelera.put<IUpdateOrderResponse>(
        `/datapapelera/updateOrderToStatus/${id}`
      );
      
      Alerts({ icon: 'success', title: data.message });    

      return null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        return error.response?.data.errors || {};
      }
      Alerts({ icon: 'warning', title: "Ocurrió un error al actualizar la Orden" });   
      return null;
    }
  },
});

export const useOrderStore = create<OrderState & Actions>()(storeApi);

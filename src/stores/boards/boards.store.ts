import { StateCreator, create } from "zustand";
import {
  IBoardsResponse,
  ISimpleBoard,
  IUpdateBoardResponse,
} from "../../interface";
import { logisticDb } from "../../api";
import { isAxiosError } from "axios";
import { Alerts } from "../../components";

interface BoardState {
  boards: ISimpleBoard[];
}

interface Actions {
  getBoards: (token: string) => Promise<void>;
  deleteBoard: (id: string | number, token: string) => Promise<void>;
  createBoard: (
    code_board: string,
    location: string,
    width: number,
    height: number,
    token: string
  ) => Promise<{ [key: string]: string[] } | null>;
  updateBoard: (
    id: string | number,
    code_board: string,
    location: string,
    width: number,
    height: number,
    token: string
  ) => Promise<{ [key: string]: string[] } | null>;
}

const storeApi: StateCreator<BoardState & Actions> = (set, get) => ({
  boards: [],
  getBoards: async (token) => {
    const { data } = await logisticDb.get<IBoardsResponse>("/boards", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    set(() => ({
      boards: data.boards,
    }));
  },

  createBoard: async ( code_board, location, width, height, token) => {
    const getBoards = get().getBoards;
    try {
      const { data } = await logisticDb.post<{ message: string }>(
        "/boards",
        {
          code_board,
          location,
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

      await getBoards(token);
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
  updateBoard: async (
    id,
    code_board,
    location,
    width,
    height,    
    token
  ) => {
    const getBoards = get().getBoards;
    try {
      const { data } = await logisticDb.put<IUpdateBoardResponse>(
        `/boards/${id}`,
        {
          code_board,
          location,
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

      await getBoards(token);
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
  deleteBoard: async (id, token) => {
    try {
      const { data } = await logisticDb.delete(`/boards/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      Alerts({ icon: "success", title: data.message });

      await get().getBoards(token);
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

export const useBoardStore = create<BoardState & Actions>()(storeApi);

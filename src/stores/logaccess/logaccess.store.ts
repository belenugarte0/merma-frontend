import { StateCreator, create } from "zustand";
import { ISimpleLogAccess, ILogAccessResponse } from "../../interface";
import { logisticDb } from "../../api";

interface LogAccessState {
  logaccess: ISimpleLogAccess[];
}

interface Actions {
  getLogAccess: (token: string) => Promise<void>;
}

const storeApi: StateCreator<LogAccessState & Actions> = (set, get) => ({
  logaccess: [],
  getLogAccess: async (token) => {
    const { data } = await logisticDb.get<ILogAccessResponse>("/logs", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    set(() => ({
      logaccess: data.logs,
    }));
  },
});

export const useLogAccessStore = create<LogAccessState & Actions>()(storeApi);

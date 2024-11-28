import { StateCreator, create } from "zustand";
import { logisticDb } from "../../api";
import { ISimpleReports } from "../../interface/reports/simple-reports";
import { IReportsResponse } from "../../interface/reports/reports-response";
import { ISimpleDashboard } from "../../interface/dashboard/simple-dashboard";
import { IDashboardResponse } from "../../interface/dashboard/dashboard-response";


interface ReportsState {
    produccions: ISimpleReports[];
    dashboard: ISimpleDashboard[];

}

interface Actions {
  reportMerma: (
    token: string,
    startDate?: Date | null,
    endDate?: Date | null
  ) => Promise<void>;
  getDashboard: (token: string) => Promise<void>;

}

const storeApi: StateCreator<ReportsState & Actions> = (set, get) => ({
    produccions: [],
    dashboard: [],


  reportMerma: async (
    token,
    startDate?: Date | null,
    endDate?: Date | null
  ) => {
    const { data } = await logisticDb.get<IReportsResponse>(
      "/produccions",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
        params: {
          start_date: startDate
            ? startDate.toISOString().split("T")[0]
            : undefined,
          end_date: endDate ? endDate.toISOString().split("T")[0] : undefined,
        },
      }
    );

    set(() => ({
      produccions: data.produccions,
    }));
    console.log(data.produccions);
  },

  getDashboard: async (token) => {
    const { data } = await logisticDb.get<IDashboardResponse>("/dashboard", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    set(() => ({
      dashboard: data.dashboard,
    }));
    console.log(data.dashboard);
  },
});

export const useReportsStore = create<ReportsState & Actions>()(storeApi);

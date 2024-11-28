import { StateCreator, create } from "zustand";
import {
  ISimpleProfile,
  IProfilesResponse,
  IUpdateProfileResponse,
} from "../../interface";
import { logisticDb } from "../../api";
import { isAxiosError } from "axios";
import { Alerts } from "../../components";

interface ProfileState {
  profiles: ISimpleProfile[];
}

interface Actions {
  getProfiles: (token: string) => Promise<void>;
  updateProfile: (
    id: string | number,
    name: string,
    lastname: string,
    email: string,
    password: string,
    password_confirmation: string,
    image: string,
    token: string
  ) => Promise<{ [key: string]: string[] } | null>;
}

const storeApi: StateCreator<ProfileState & Actions> = (set, get) => ({
  profiles: [],
  getProfiles: async (token) => {
    const { data } = await logisticDb.get<IProfilesResponse>("/auth/profile", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    set(() => ({
      profiles: data.profiles,
    }));
  },

  updateProfile: async (
    id,
    name,
    lastname,
    email,
    password,
    password_confirmation,
    image,
    token
  ) => {
    const getProfiles = get().getProfiles;
    try {
      const { data } = await logisticDb.put<IUpdateProfileResponse>(
        `/auth/update/${id}`,
        {
          name,
          lastname,
          email,
          password,
          password_confirmation,
          image,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      Alerts({ icon: "success", title: data.message });

      await getProfiles(token);
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
});

export const useProfileStore = create<ProfileState & Actions>()(storeApi);

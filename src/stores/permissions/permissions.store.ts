import { StateCreator, create } from "zustand";
import { logisticDb } from "../../api";
import { ISimplePermission } from "../../interface/permissions/simple-permission";
import { IPermissionsResponse } from "../../interface/permissions/permissions-response";


interface PermissionState {
    permissions: ISimplePermission[]
}


interface Actions {
    
    getPermissions: ( token: string ) => Promise<void>;

}


const storeApi: StateCreator<PermissionState & Actions> = (set, get) => ({

    permissions: [],    
   
    getPermissions: async (token) => {
        
        const { data } = await logisticDb.get<IPermissionsResponse>('/permissions',{
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        set( () => ({
            permissions: data.permissions
        }))
    }
})



export const usePermissionStore = create<PermissionState & Actions>()(
    storeApi,
)
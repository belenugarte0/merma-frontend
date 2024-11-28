import { ISimpleClassific } from "../../interface";
import { useAuthStore } from "../../stores";
import { ViewClassificModal } from "./ViewClassificModal";

interface Props {
  orders: ISimpleClassific;
  activeTab: string; // Añadir el estado actual del tab como prop
}

export const ActionsClassificCTable = ({ orders }: Props) => {
  const userPermissions = useAuthStore(
    (state) => state.user?.permissions || []
  );

  return (
    <>
     {/* VER ORDEN */}
         {userPermissions.includes("ver-ordenesd") && <ViewClassificModal orders={orders} />}
    </>
  );
};

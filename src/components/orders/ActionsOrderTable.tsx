import { ISimpleOrder } from "../../interface";
import { useAuthStore, useOrderStore } from "../../stores";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";
import { ViewOrderModal } from "./ViewOrderModal";

interface Props {
  order: ISimpleOrder;
  activeTab: string; // Añadir el estado actual del tab como prop
}

export const ActionsOrderTable = ({ order, activeTab }: Props) => {
  const updateToStatus = useOrderStore((state) => state.updateToStatus);
  const userPermissions = useAuthStore(
    (state) => state.user?.permissions || []
  );

  const handleUpdateToStatus = async (status: string, listStatus: string) => {
    const result = await Swal.fire({
      title: "Confirmar Cambio",
      text: "¿Está seguro de cambiar el estado de esta orden?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Cambiar!",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      await updateToStatus(order.id, status, listStatus);
    }
  };

  const handleRevertirToStatus = async (revertirStatus: string) => {
    const result = await Swal.fire({
      title: "Confirmar Reversión",
      text: "¿Está seguro de revertir el estado de esta orden?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Revertir!",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      await updateToStatus(order.id, revertirStatus, activeTab);
    }
  };

  const getRevertStatus = () => {
    if (activeTab === "Recibido") {
      return order.status === "Recibido" ? "Produccion" : "Produccion";
    }
    if (activeTab === "Produccion") {
      return order.status === "Produccion" ? "Almacen" : "Almacen";
    }
    if (activeTab === "Almacen") {
      return order.status === "Almacen" ? "Recibido" : "Recibido";
    }
    return order.status;
  };

  return (
    <>
      {/* VER ORDEN */}
      {userPermissions.includes("ver-orders") && <ViewOrderModal order={order} />}
      
      {/* CAMBIAR ESTADO Recibido */}
      {order.status === "Recibido" &&
        userPermissions.includes("ver-recibido") && (
          <Button
            className="btnOrder danger"
            isIconOnly
            color="danger"
            aria-label="Cambiar a Producción"
            variant="bordered"
            onClick={() => handleUpdateToStatus("Produccion", "Recibido")}
          >
            <i className="fa-solid fa-boxes"></i>
          </Button>
        )}
      
      {/* CAMBIAR ESTADO Almacen */}
      {order.status === "Almacen" &&
        userPermissions.includes("ver-almacen") && (
          <Button
            className="btnOrder secondary"
            isIconOnly
            color="secondary"
            aria-label="Cambiar a Recibido"
            variant="bordered"
            onClick={() => handleUpdateToStatus("Recibido", "Almacen")}
          >
            <i className="fa-solid fa-rotate-left"></i>
          </Button>
        )}

      {/* CAMBIAR ESTADO REVERTIR */}
      {order.status === "Produccion" &&
        userPermissions.includes("revertir-orden") && (
          <Button
            className="btnOrder warning"
            isIconOnly
            color="warning"
            aria-label="Revertir Estado"
            variant="bordered"
            onClick={() => handleRevertirToStatus(getRevertStatus())}
          >
            <i className="fa-solid fa-warehouse"></i>
          </Button>
        )}
    </>
  );
};

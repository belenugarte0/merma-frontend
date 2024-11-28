import { ISimpleMold } from "../../interface";
import { useAuthStore, useMoldStore } from "../../stores";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";
import { EditMoldModal } from "./EditMoldModal";
import { ViewMoldModal } from "./ViewMoldModal";

interface Props {
  mold: ISimpleMold;
}

export const ActionsMoldTable = ({ mold }: Props) => {
  const token = useAuthStore((state) => state.token);
  const deleteMold = useMoldStore((state) => state.deleteMold);
  const userPermissions = useAuthStore(
    (state) => state.user?.permissions || []
  );

  const handleDeleteMold = async () => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar?",
      text: "¡El registro no se eliminará de forma permanente, solo cambiará el estado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar!",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      await deleteMold(mold.id, token!);
    }
  };

  const handleRestaurarMold = async () => { // Cambié el nombre para restaurar
    const result = await Swal.fire({
      title: "¿Está seguro de restaurar?",
      text: "¡El registro se restaurará de forma permanente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Restaurar!",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      await deleteMold(mold.id, token!);
    }
  };

  return (
    <>
      {/* VER EL BOARD */}
      {userPermissions.includes("ver-molds") && <ViewMoldModal mold={mold} />}

      {/* EDITAR EL BOARD */}
      {userPermissions.includes("editar-molds") && (
        <EditMoldModal mold={mold} />
      )}

      {/* ELIMINAR EL BOARD */}
      {mold.status === 1 && userPermissions.includes("eliminar-molds") && (
        <Button
          className="btn danger"
          isIconOnly
          color="danger"
          aria-label="Eliminar"
          variant="bordered"
          onClick={handleDeleteMold}
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </Button>
      )}

      {/* RESTAURAR EL BOARD */}
      {mold.status === 0 && userPermissions.includes("restaurar-molds") && (
        <Button
          className="btn warning"
          isIconOnly
          color="warning"
          aria-label="Restaurar"
          variant="bordered"
          onClick={handleRestaurarMold}
        >
          <i className="fas fa-check-circle"></i>
        </Button>
      )}
    </>
  );
};

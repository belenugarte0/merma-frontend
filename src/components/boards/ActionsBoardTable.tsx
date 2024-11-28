import { ISimpleBoard } from "../../interface";
import { useAuthStore, useBoardStore } from "../../stores";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";
import { EditBoardModal } from "./EditBoardModal";
import { ViewBoardModal } from "./ViewBoardModal";

interface Props {
  board: ISimpleBoard;
}

export const ActionsBoardTable = ({ board }: Props) => {
  const token = useAuthStore((state) => state.token);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);
  const userPermissions = useAuthStore(
    (state) => state.user?.permissions || []
  );

  const handleDeleteBoard = async () => {
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
      await deleteBoard(board.id, token!);
    }
  };

  const handleRestaurarBoard = async () => { // Cambié el nombre para restaurar
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
      await deleteBoard(board.id, token!);
    }
  };

  return (
    <>
      {/* VER EL BOARD */}
      {userPermissions.includes("ver-boards") && <ViewBoardModal board={board} />}

      {/* EDITAR EL BOARD */}
      {userPermissions.includes("editar-boards") && (
        <EditBoardModal board={board} />
      )}

      {/* ELIMINAR EL BOARD */}
      {board.status === 1 && userPermissions.includes("eliminar-boards") && (
        <Button
          className="btn danger"
          isIconOnly
          color="danger"
          aria-label="Eliminar"
          variant="bordered"
          onClick={handleDeleteBoard}
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </Button>
      )}

      {/* RESTAURAR EL BOARD */}
      {board.status === 0 && userPermissions.includes("restaurar-boards") && (
        <Button
          className="btn warning"
          isIconOnly
          color="warning"
          aria-label="Restaurar"
          variant="bordered"
          onClick={handleRestaurarBoard}
        >
          <i className="fas fa-check-circle"></i>
        </Button>
      )}
    </>
  );
};

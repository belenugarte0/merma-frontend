import { ISimpleUser } from "../../interface";
import { useAuthStore, useUserStore } from "../../stores";
import { EditUserModal } from "./EditUserModal";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";

interface Props {
  user: ISimpleUser;
}

export const ActionsUserTable = ({ user }: Props) => {
  const token = useAuthStore((state) => state.token);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const userPermissions = useAuthStore(
    (state) => state.user?.permissions || []
  );

  const handleDeleteUser = async () => {
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
      await deleteUser(user.id, token!);
    }
  };

  const handleRestaurarUser = async () => {
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
      await deleteUser(user.id, token!);
    }
  };

  return (
    <>
      {/* EDITA EL USUARIO */}
      {user.status === 1 && userPermissions.includes("editar-usuario") && (
        <EditUserModal user={user} />
      )}

      {/* ELIMINA EL USUARIO */}
      {user.status === 1 && userPermissions.includes("eliminar-usuario") && (
        <Button
          className="btn danger"
          isIconOnly
          color="danger"
          aria-label="Eliminar"
          variant="bordered"
          onClick={handleDeleteUser}
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </Button>
      )}

      {/* RESTAURAR EL USUARIO */}
      {user.status === 0 && userPermissions.includes("restaurar-usuario") && (
        <Button
          className="btn warning"
          isIconOnly
          color="warning"
          aria-label="Restaurar"
          variant="bordered"
          onClick={handleRestaurarUser}
        >
          <i className="fas fa-check-circle"></i>
        </Button>
      )}
    </>
  );
};

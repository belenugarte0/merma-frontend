import { useAuthStore, useRoleStore } from "../../stores";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";
import { EditRoleModal } from "./EditRoleModal";
import { ISimpleRole } from "../../interface/roles/simple-role";

interface Props {
  role: ISimpleRole;
}

export const ActionsRoleTable = ({ role }: Props) => {
  const token = useAuthStore((state) => state.token);
  const deleteRole = useRoleStore((state) => state.deleteRole);
  const rolePermissions = useAuthStore(
    (state) => state.user?.permissions || []
  );

  const handleDeleteRole = async () => {
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
      await deleteRole(role.id, token!);
    }
  };

  const handleRestaurarRole = async () => {
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
      await deleteRole(role.id, token!);
    }
  };

  return (
    <>
      {/* EDITA EL USUARIO */}
      {role.status === 1 && rolePermissions.includes("editar-role") && (
        <EditRoleModal role={role} />
      )}

      {/* ELIMINA EL USUARIO */}
      {role.status === 1 && rolePermissions.includes("eliminar-role") && (
        <Button
          className="btn danger"
          isIconOnly
          color="danger"
          aria-label="Eliminar"
          variant="bordered"
          onClick={handleDeleteRole}
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </Button>
      )}

      {/* RESTAURAR EL USUARIO */}
      {role.status === 0 && rolePermissions.includes("restaurar-role") && (
        <Button
          className="btn warning"
          isIconOnly
          color="warning"
          aria-label="Restaurar"
          variant="bordered"
          onClick={handleRestaurarRole}
        >
          <i className="fas fa-check-circle"></i>
        </Button>
      )}
    </>
  );
};

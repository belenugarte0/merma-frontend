import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useAuthStore, useRoleStore } from "../../stores";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { BreadcrumbItem, Breadcrumbs, Chip } from "@nextui-org/react";
import { ActionsRoleTable, NewRoleForm } from "../../components";
import { ISimpleRole } from "../../interface/roles/simple-role";

export const RolesPage = () => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const token = useAuthStore((state) => state.token);
  const roles = useRoleStore((state) => state.roles);
  const getRoles = useRoleStore((state) => state.getRoles);

  const handleFetchRoles = async () => {
    setIsLoadingTable(true);
    if (roles.length === 0) {
      await getRoles(token!);
    }
    setIsLoadingTable(false);
  };

  useEffect(() => {
    handleFetchRoles();
  }, []);

  const columns = useMemo<MRT_ColumnDef<ISimpleRole>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nombres",
      },
      {
        accessorKey: "permissions",
        header: "Permisos",
        size: 250,
        Cell: ({ cell }) => {
          const permissions = cell.getValue() as { name: string }[];
          const visiblePermissions = permissions.slice(0, 4);
          return (
            <div>
              {visiblePermissions.slice(0, 3).map((permission, index) => (
                <Chip
                  className="mb-2 mr-1"
                  key={permission.name}
                  color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'success'}
                >
                  {permission.name}
                </Chip>
              ))}
              {permissions.length > 3 && (
                <Chip color="warning">
                  +{permissions.length - 3} más
                </Chip>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Estado",
        size: 10,
        enableSorting: false,
        Cell: ({ cell }) =>
          cell.row.original.status === 1 ? (
            <span className="badgeSuccess text-white shadow">Activo</span>
          ) : (
            <span className="badgeDanger text-white shadow">Inactivo</span>
          ),
        filterVariant: "select",
        filterSelectOptions: [
          { label: "Activo", value: "1" }, // Usar strings para valores de filtro
          { label: "Inactivo", value: "0" },
        ],
      },
      {
        accessorKey: "actions",
        header: "Acciones",
        size: 10,
        enableColumnFilter: false, // Evitar el filtrado por esta columna
        enableSorting: false, // Evitar ordenar por esta columna
        enableColumnActions: false,
        Cell: ({ cell }) => {
          const role = cell.row.original;
          return (
            <>
              <ActionsRoleTable role={role} />
            </>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: roles,
    muiPaginationProps: {
      showRowsPerPage: false,
    },

    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
      density: "compact",
    },

    state: {
      isLoading: isLoadingTable,
    },

    localization: MRT_Localization_ES,
    renderTopToolbarCustomActions: () => (
      <div className="gap-4 ">
        <h1 className="text-xl font-bold">Listar Roles y Permisos</h1>
      </div>
    ),
    muiTablePaperProps: {
      elevation: 3,
      sx: {
        borderRadius: "15px",
        padding: "20px 25px 5px 25px",
        marginTop: "15px",
      },
    },
    /*
    Mostrar por fila los Roles
    */
    renderDetailPanel: ({ row }) => {
      return (
        <div className="bg-gray-100 p-3 rounded-xl shadow-xl">
          <h3 className="text-lg font-semibold mb-1">Permisos:</h3>
          <div>
  {row.original.permissions.map((permission) => (
    <Chip
      className="mb-2 mr-1"
      key={permission.name}
    >
      {permission.name}
    </Chip>
  ))}
</div>

        </div>
      );
    },
  });

  return (
    <div className="pt-6 pb-2.5 px-8 pt-7">
      <div className="flex justify-between items-center">
        <Breadcrumbs size="lg">
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Roles</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex">
          <NewRoleForm />
        </div>
      </div>
      <div className="md:grid">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useAuthStore, useUserStore } from "../../stores";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { ActionsUserTable, NewUserForm } from "../../components";

export const UsersPage = () => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const token = useAuthStore((state) => state.token);
  const users = useUserStore((state) => state.users);
  const getUsers = useUserStore((state) => state.getUsers);

  const handleFetchUsers = async () => {
    setIsLoadingTable(true);
    if (users.length === 0) {
      await getUsers(token!);
    }
    setIsLoadingTable(false);
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nombres",
        size: 200,
        Cell: ({ cell }) =>
          `${cell.row.original.name} ${cell.row.original.lastname}`,
      },
      {
        accessorKey: "document",
        header: "Cédula Identidad",
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "role",
        header: "Rol",
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
          const user = cell.row.original;
          return (
            <>
              <ActionsUserTable user={user} />
            </>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: users,
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
        <h1 className="text-xl font-bold">Listar Usuarios</h1>
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
  });

  return (
    <div className="pt-6 pb-2.5 px-8 pt-7">
      <div className="flex justify-between items-center">
        <Breadcrumbs size="lg">
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Usuarios</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex">
          <NewUserForm />
        </div>
      </div>
      <div className="md:grid">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

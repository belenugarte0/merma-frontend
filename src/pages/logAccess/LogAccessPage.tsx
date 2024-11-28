import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useAuthStore, useLogAccessStore } from "../../stores";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { formatTime } from "../../lib";

export const LogAccessPage = () => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const token = useAuthStore((state) => state.token);
  const logaccess = useLogAccessStore((state) => state.logaccess);
  const getLogAccess = useLogAccessStore((state) => state.getLogAccess);

  const handleFetchUsers = async () => {
    setIsLoadingTable(true);
    if (logaccess.length === 0) {
      await getLogAccess(token!);
    }
    setIsLoadingTable(false);
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "created_at",
        header: "Fecha y Hora",
        size: 170,
        Cell: ({ cell }) => formatTime(cell.getValue<string>()),
      },
      {
        accessorKey: "id_user",
        header: "Usuario",
        size: 5,
      },
      {
        accessorKey: "evento",
        header: "Evento",
        size: 10,

        enableSorting: false,
        Cell: ({ cell }) =>
          cell.row.original.evento == "Inicio de sesión" ? (
            <span className="badgeSuccess">Inicio de sesión</span>
          ) : (
            <span className="badgeDanger">Cierre de sesión</span>
          ),
        filterVariant: "select",
        filterSelectOptions: [
          { label: "Inicio de sesión", value: "Inicio de sesión" },
          { label: "Cierre de sesión", value: "Cierre de sesión" },
        ],
      },

      {
        accessorKey: "ip",
        header: "IP",
        size: 100,
      },
      {
        accessorKey: "detalle",
        header: "Detalle",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: logaccess,
    muiPaginationProps: {
      showRowsPerPage: false,
    },

    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: {
      pagination: {
        pageSize: 10,
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
        <h1 className="text-xl font-bold">Listar Log de Acceso</h1>
      </div>
    ),
    muiTablePaperProps: {
      elevation: 3,
      sx: {
        borderRadius: "15px",
        padding: "25px 25px 0px 25px",
        marginTop: "15px",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        paddingTop: "10px", // Padding en la parte superior
        paddingBottom: "10px", // Padding en la parte inferior
      },
    },
  });

  return (
    <div className="pt-6 pb-2.5 px-5 pt-8">
      <div className="flex justify-between items-center">
        <Breadcrumbs size="lg">
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Log de Acceso</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="md:grid">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

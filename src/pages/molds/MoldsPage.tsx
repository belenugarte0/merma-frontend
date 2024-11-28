import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useAuthStore, useMoldStore } from "../../stores";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { ActionsMoldTable, NewMoldForm } from "../../components";

export const MoldsPage = () => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const token = useAuthStore((state) => state.token);
  const molds = useMoldStore((state) => state.molds);
  const getMolds = useMoldStore((state) => state.getMolds);

  const handleFetchMolds = async () => {
    setIsLoadingTable(true);
    if (molds.length === 0) {
      await getMolds(token!);
    }
    setIsLoadingTable(false);
  };

  useEffect(() => {
    handleFetchMolds();
  }, []);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "code_mold",
        header: "Codigo Molde",
      },
      {
        accessorKey: "name_mold",
        header: "Nombre del Molde",
      },
      {
        accessorKey: "width",
        header: "Ancho",
        size: 200,
      },
      {
        accessorKey: "height",
        header: "Alto",
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
          const mold = cell.row.original;
          return (
            <>
              <ActionsMoldTable mold={mold} />
            </>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: molds,
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
        <h1 className="text-xl font-bold">Listar Moldes</h1>
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
          <BreadcrumbItem>Moldes</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex">
          <NewMoldForm />
        </div>
      </div>
      <div className="md:grid">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useOrderStore } from "../../stores";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { BreadcrumbItem, Breadcrumbs, Tab, Tabs } from "@nextui-org/react";
import { ActionsOrderTable } from "../../components";

export const OrdersPage = () => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [activeTab, setActiveTab] = useState("Recibido");

  const orders = useOrderStore((state) => state.orders);
  const getOrders = useOrderStore((state) => state.getOrders);

  const handleFetchOrders = async (status: any) => {
    setIsLoadingTable(true);
    await getOrders(status);
    setIsLoadingTable(false);
  };

  useEffect(() => {
    handleFetchOrders(activeTab);
  }, [activeTab]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "order_cod",
        header: "Codigo",
        size: 1,
      },
      {
        accessorKey: "client",
        header: "Cliente",
        size: 250,
      },

      {
        accessorKey: "product",
        header: "Producto",
        size: 280,
      },
      {
        accessorKey: "tamaño",
        header: "Dimensiones",
        size: 150,
        Cell: ({ cell }) =>
          `${cell.row.original.width} cm x ${cell.row.original.height} cm`,
      },
      {
        accessorKey: "box_type",
        header: "Tipo Caja",
        size: 15,
      },
      {
        accessorKey: "quality",
        header: "Tipo Onda",
        size: 10,
      },
      {
        accessorKey: "quantity",
        header: "Cantidad",
        size: 10,
      },
      {
        accessorKey: "delivery_date",
        header: "Fecha Entrega",
        size: 1,
      },
      {
        accessorKey: "status",
        header: "Estado",
        size: 10,
      },
      {
        accessorKey: "actions",
        header: "Acciones",
        size: 10,
        enableColumnFilter: false, // Evitar el filtrado por esta columna
        enableSorting: false, // Evitar ordenar por esta columna
        enableColumnActions: false,
        Cell: ({ cell }) => {
          const order = cell.row.original;
          return <ActionsOrderTable order={order} activeTab={activeTab} />;
        },
      },
    ],
    [activeTab]
  );

  const table = useMaterialReactTable({
    columns,
    data: orders,
    muiPaginationProps: {
      showRowsPerPage: false,
    },
    enableColumnPinning: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: {
      pagination: {
        pageSize: 6,
        pageIndex: 0,
      },
      columnPinning: {
        right: ["actions"],
      },
      density: "compact",
    },

    state: {
      isLoading: isLoadingTable,
    },

    localization: MRT_Localization_ES,
    renderTopToolbarCustomActions: () => (
      <div className="gap-4 ">
        <h1 className="text-xl font-bold">Listar Ordenes en {activeTab}</h1>
      </div>
    ),
    muiTablePaperProps: {
      elevation: 3,
      sx: {
        borderRadius: "15px",
        padding: "20px 20px 5px 20px",
        marginTop: "15px",
      },
    },
  });

  return (
    <div className="pt-6 pb-2.5 px-5 pt-5">
      <div className="flex items-center justify-between">
        <Breadcrumbs size="lg">
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Ordenes</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex flex-grow justify-center">
          <div className="w-full max-w-xl">
            <Tabs
              aria-label="Options"
              color="default"
              variant="bordered"
              radius = "lg"
              selectedKey={activeTab}
              onSelectionChange={(key) => {
                if (key) {
                  setActiveTab(String(key));
                }
              }}
            >
              <Tab
                key="Recibido"
                title={
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-inbox"></i>
                    <span>Recibido</span>
                  </div>
                }
              />
              <Tab
                key="Produccion"
                title={
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-boxes-stacked"></i>
                    <span>Producción</span>
                  </div>
                }
              />
              <Tab
                key="Almacen"
                title={
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-warehouse"></i>
                    <span>Almacén</span>
                  </div>
                }
              />
              </Tabs>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col">{/* Otros contenidos */}</div>
      <div className="md:grid">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

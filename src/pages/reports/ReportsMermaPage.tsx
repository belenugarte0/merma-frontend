import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useAuthStore, useReportsStore } from "../../stores";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { BreadcrumbItem, Breadcrumbs, Button, Image, Input } from "@nextui-org/react";
import Swal from "sweetalert2";
import merma from "../../assets/images/merma.png";

export const ReportsMermaPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const token = useAuthStore((state) => state.token);
  const produccions = useReportsStore((state) => state.produccions);
  const reportMerma = useReportsStore((state) => state.reportMerma
  );

  // totalMerma
  const totalMerma = useMemo(() => {
    return produccions.reduce((sum, produccion) => {
      const mermaValue = parseFloat(produccion.merma) || 0;
      return sum + mermaValue;
    }, 0);  // El resultado será un número
  }, [produccions]);

  // totalEspacioUsado
  // Sumar todo el espacio usado de todas las órdenes
  const totalEspacioUsado = useMemo(() => {
    return produccions.reduce((sum, produccion) => {
      const espacioUsado = parseFloat(produccion.espacio_usado) || 0; // Asegurarse de que el valor sea numérico
      return sum + espacioUsado;
    }, 0);  // El resultado será un número
  }, [produccions]);


  //Ahorro  total
  const BASE_WIDTH = 900;
  const BASE_LENGTH = 1000;
  const espacioTotalPorProduccion = BASE_WIDTH * BASE_LENGTH;  // 900 * 1000 = 900000
  const totalEspacioDisponible = espacioTotalPorProduccion * produccions.length;
  const ahorroTotal = totalEspacioDisponible - totalMerma;
  const porcentajeAhorro = ((ahorroTotal / totalEspacioDisponible) * 100).toFixed(2);
  console.log("Ahorro Total: ", ahorroTotal, " | Porcentaje de Ahorro: ", porcentajeAhorro, "%");


  const handleFetchData = async () => {
    setIsLoading(true);
    await reportMerma(token!, startDate, endDate);
    setIsLoading(false);
  };

  const handleGenerateHistory = () => {
    const newErrors: { [key: string]: string[] } = {};

    if (!startDate || isNaN(startDate.getTime())) {
      newErrors.startDate = [
        "La fecha de inicio es requerida y debe ser válida.",
      ];
    }
    if (!endDate || isNaN(endDate.getTime())) {
      newErrors.endDate = ["La fecha de fin es requerida y debe ser válida."];
    }
    if (startDate && endDate && startDate > endDate) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        iconColor: "white",
        customClass: {
          popup: "colored-toast",
        },
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });

      (async () => {
        await Toast.fire({
          icon: "warning",
          title: "FECHA INICIO DEBE SER ANTERIOR O IGUAL A LA FECHA FIN",
        });
      })();

      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handleFetchData();
  };


  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "imagen",
        header: "Imagen",
        size: 1,
        Cell: ({ cell }) => {
          const imagen = cell.getValue<string>() || merma;
          return (
            <Image
              src={imagen}
              alt="Imagen de Merma"
              style={{
                width: "50px",
                height: "45px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                boxShadow: "4px 5px 8px #aeaeae",
                border: "1px solid #dedede",
              }}
            />
          );
        },
      },
      {
        accessorKey: "cod_produccion",
        header: "Cod Produccion",
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <span>{value || "Sin datos"}</span>;
        },
      },
      {
        accessorKey: "cod_order",
        header: "Cod Orden",
        size: 1,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <span>{value || "Sin datos"}</span>;
        },
      },
      {
        accessorKey: "merma",
        header: "Merma",
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <span>{value || "Sin datos"}</span>;
        },
      },

      {
        accessorKey: "espacio_usado",
        header: "Espacio Usado",
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <span>{value || "Sin datos"}</span>;
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
          { label: "Activo", value: "1" },
          { label: "Inactivo", value: "0" },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: produccions,
    muiPaginationProps: {
      showRowsPerPage: false,
    },
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: {
      pagination: {
        pageSize: 4,
        pageIndex: 0,
      },
      density: "compact",
    },
    state: {
      isLoading: isLoading,
    },
    localization: MRT_Localization_ES,
    renderTopToolbarCustomActions: () => (
      <div className="gap-4 flex items-center">
        <h1 className="text-xl font-bold">Reporte de Merma</h1>

        <span
          className="font-semibold text-sm bg-white px-2 py-0.5 rounded-full shadow-lg text-gray-700 transform hover:scale-105 transition-transform duration-200 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-700 hover:text-white"
          style={{
            boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3), -2px -2px 8px rgba(255, 255, 255, 0.5)",
            borderRadius: "20px",
          }}
        >
          Merma Generada: {totalMerma}
        </span>
        {/* Espacio Usado */}
        <span
          className="font-semibold text-sm bg-white px-2 py-0.5 rounded-full shadow-lg text-gray-700 transform hover:scale-105 transition-transform duration-200 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-700 hover:text-white"
          style={{
            boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3), -2px -2px 8px rgba(255, 255, 255, 0.5)",
            borderRadius: "20px",
          }}
        >
          Espacio Usado: {totalEspacioUsado}
        </span>
        {/* Ahorro Total */}
        <span
          className="font-semibold text-sm bg-white px-2 py-0.5 rounded-full shadow-lg text-gray-700 transform hover:scale-105 transition-transform duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:text-white"
          style={{
            boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3), -2px -2px 8px rgba(255, 255, 255, 0.5)",
            borderRadius: "20px",
          }}        >
          Ahorro Total: {porcentajeAhorro}%
        </span>


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

  const getErrorMessage = (field: string) => {
    return errors[field] ? errors[field][0] : "";
  };

  const isFieldInvalid = (field: string) => {
    return !!errors[field];
  };

  return (
    <div className="pt-6 pb-2.5 px-8 pt-7">
      <div className="flex justify-between items-center">
        <Breadcrumbs size="lg">
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Reporte Merma</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
        <Input
          name="startDate"
          label="Fecha de Inicio"
          variant="underlined"
          type="date"
          className="max-w-72"
          defaultValue={formattedToday}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          isInvalid={isFieldInvalid("startDate")}
          errorMessage={getErrorMessage("startDate")}
        />
        <Input
          name="endDate"
          label="Fecha de Fin"
          variant="underlined"
          type="date"
          className="max-w-72"
          defaultValue={formattedToday}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          isInvalid={isFieldInvalid("endDate")}
          errorMessage={getErrorMessage("endDate")}
        />
        <Button
          className="btn success"
          isIconOnly
          color="success"
          aria-label="Generate History"
          variant="bordered"
          isLoading={isLoading}
          isDisabled={isLoading}
          onClick={handleGenerateHistory}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </Button>
      </div>

      <div className="md:grid">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};
import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useAuthStore, useClassificStore, useOrderStore, useProduccionsStore } from "../../stores";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { BreadcrumbItem, Breadcrumbs, Button, Tab, Tabs } from "@nextui-org/react";
import { ActionsClassificCTable } from "../../components";
import gifAnimation from "../../assets/images/animation.gif";


//FIREBASE
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDb } from "../../components/utils/FirebaseImageStorage";

export const ClassificsPaget = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("a");
  const token = useAuthStore((state) => state.token);

  const orders = useClassificStore((state) => state.orders);
  const placabase = useClassificStore((state) => state.placabase); // Obtener placabase
  const getTipoa = useClassificStore((state) => state.getTipoa);
  const modelRandomForest = useClassificStore((state) => state.modelRandomForest);
  const updateOrderStatus = useClassificStore((state) => state.updateOrderStatus); // Agregar esta línea

  //SAVE PRODUCCTION
  const createProduccion = useProduccionsStore((state) => state.createProduccion);
  const updateOrderToStatus = useOrderStore((state) => state.updateOrderToStatus);


  const [imageUrl, setImageUrl] = useState("");
  const [mermaValue, setMermaValue] = useState("");
  const [used_area, setUsed_area] = useState("");
  const [orders_ac, setorders_ac] = useState("");

  const handleFetchtClassifics = async (quality: string) => {
    setIsLoading(true);
    await getTipoa(quality);
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchtClassifics(activeTab);
  }, [activeTab]);

  const handleSubmit = async () => {
    setIsLoading(true);

    const ordersData = orders.map(order => ({
      order_cod: order.order_cod,
      width: order.width,
      length: order.length,
    }));

    const response = await modelRandomForest(ordersData);

    if (response?.placabase && response.placabase.length > 0) {
      const { image_url, merma, used_area, orders_ac } = response.placabase[0];

      const timestamp = new Date().getTime();
      setImageUrl(`${image_url}?t=${timestamp}`);
      setMermaValue(merma);
      setUsed_area(used_area);
      setorders_ac(orders_ac);
    }

    setIsLoading(false);
  };


  const handleImageUpload = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();

    const fileName = `IMG_${new Date().getTime()}.png`; 
    const storageRef = ref(imageDb, `merma/${fileName}`);

    await uploadBytes(storageRef, imageBlob);

    const uploadedImageUrl = await getDownloadURL(storageRef);
    return uploadedImageUrl;
  };

  const handleSubmitSave = async () => {
    setIsLoading(true);    

    let uploadedImageUrl = "";
    if (imageUrl) {
      uploadedImageUrl = await handleImageUpload(imageUrl);
    }

    await createProduccion(orders_ac, mermaValue, used_area, uploadedImageUrl,token!);
    await updateOrderToStatus(orders_ac);
    setImageUrl(""); 
    setMermaValue(""); 
    setUsed_area(""); 
    setorders_ac("");
    setIsLoading(false);
  };




  const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
    {
      accessorKey: "order_cod",
      header: "Código",
      size: 1,
    },
    {
      accessorKey: "quality",
      header: "Tipo de Onda",
      size: 1,
    },
    {
      accessorKey: "tamañoalto",
      header: "Dimensiones",
      size: 150,
      Cell: ({ cell }) => `${cell.row.original.width} cm x ${cell.row.original.height} cm`,
    },
    {
      accessorKey: "box_type",
      header: "Tipo Caja",
      size: 15,
    },
    {
      accessorKey: "status",
      header: "Estado",
      size: 10,
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      size: 1,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
      Cell: ({ cell }) => {
        const orders = cell.row.original;
        return <ActionsClassificCTable orders={orders} activeTab={activeTab} />;
      },
    },
  ], [activeTab]);

  // Configuración de la tabla
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
      isLoading: isLoading,
    },
    localization: MRT_Localization_ES,
    renderTopToolbarCustomActions: () => (
      <div className="gap-4">
        <h1 className="text-xl font-bold">Listar Órdenes en {activeTab}</h1>
      </div>
    ),
    muiTablePaperProps: {
      elevation: 3,
      sx: {
        borderRadius: "15px",
        padding: "20px 20px 5px 10px",
        marginTop: "2px", // Reducir margen superior
        minHeight: '300px', // Tamaño mínimo de la tabla
        maxHeight: '600px', // Tamaño máximo de la tabla
      },
    },
  });

  return (
    <div className="pt-6 pb-2.5 px-5 pt-5">
      <div className="flex items-center justify-between">

        <div className="flex flex-grow ">
          <div className="w-full max-w-xl">
            <Tabs
              aria-label="Options"
              color="default"
              variant="bordered"
              radius="lg"
              selectedKey={activeTab}
              onSelectionChange={(key) => {
                if (key) {
                  setActiveTab(String(key));
                }
              }}
            >
              <Tab
                key="a"
                title={
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-minus text-base"></i>
                    <span>Onda Tipo A</span>
                  </div>
                }
              />
              <Tab
                key="b"
                title={
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-equals text-base"></i>
                    <span>Onda Tipo B</span>
                  </div>
                }
              />
              <Tab
                key="c"
                title={
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-bars text-base"></i>
                    <span>Onda Tipo C</span>
                  </div>
                }
              />
            </Tabs>
          </div>
        </div>

        {imageUrl ? (
          <Button
            variant="shadow"
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={handleSubmitSave}
            style={{
              marginLeft: '10px',
              backgroundColor: '#28a745',
              color: '#ffffff',
              marginRight: '5px'
            }}
          >
            Guardar Diseño
          </Button>
        ) : null}

        <Button
          variant="shadow"
          isLoading={isLoading}
          isDisabled={isLoading}
          color="primary"
          onClick={handleSubmit}

        >
          Generar Diseño
        </Button>

      </div>

      {/* Contenedor principal que usa grid para colocar tabla y placa */}
      <div className="grid grid-cols-[420px_820px] gap-1 mt-1">
        <div className="col-span-1 h-[500px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <span className="mt-4">Cargando órdenes...</span>
            </div>
          ) : (
            <MaterialReactTable table={table} />
          )}
        </div>

        <div className="col-span-1 bg-white flex items-center justify-center h-[546px] rounded-lg shadow-lg">
          {imageUrl ? (
            <div>
              <img src={imageUrl} alt="Placa base" />
              <div className="flex space-x-4"> 
        <p>Merma: {mermaValue}</p>
        <p>Espacio Utilizado: {used_area}</p>
      </div>
            </div>
          ) : (
<img src={gifAnimation} alt="GIF animation" width="600" />
          )}
        </div>

      </div>
    </div>
  );
};

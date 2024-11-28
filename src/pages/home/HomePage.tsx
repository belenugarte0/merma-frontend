import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore, useReportsStore } from "../../stores";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts";
import { BarChartComponent } from "../../components/home/BarChartComponent";

export const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const token = useAuthStore((state) => state.token);

  const dashboard = useReportsStore((state) => state.dashboard);
  const getDashboard = useReportsStore((state) => state.getDashboard);

  const handleFetchUsers = async () => {
    setIsLoading(true);
    if (dashboard.length === 0) {
      await getDashboard(token!);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  const desktopOS = [
    { id: "00005", value: 2510 },
    { id: "00008", value: 1044 },
    { id: "00006", value: 3594 },
    { id: "00007", value: 6510 },
  ];

  return (
    <>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-4 pb-2 px-8">
        {/* Eficiencia de Placa */}
        <div className="bg-white rounded-2xl border-l-4 border-green-700 cardDashboard shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <div className="p-4">
            <div className="flex items-center">
              <div>
                <p className="mb-1 text-black">Eficiencia de Placa</p> 
                <h4 className="text-green-800 text-xl font-bold">
                92.57% 
                </h4>
                <Link className="text-sm text-blue-500 hover:text-blue-700" to="/admin/report_merma"> 
                  Detalle
                </Link>
              </div>
              <div className="ml-auto bg-gradient-to-r from-green-600 to-green-800 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                <i className="fas fa-chart-line text-lg"></i> 
              </div>
            </div>
          </div>
        </div>

        {/* Produccion Total */}
        <div className="bg-white rounded-2xl border-l-4 border-blue-500 cardDashboard shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <div className="p-4">
            <div className="flex items-center">
              <div>
                <p className="mb-1 text-stone-600">Producción Total / Órdenes</p>
                <h4 className="text-blue-600 text-xl font-bold">
                  11/154
                </h4>
                <Link className="text-sm text-blue-500 hover:text-blue-700" to="/admin/report_merma">
                  Detalle
                </Link>
              </div>
              <div className="ml-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                <i className="fas fa-box text-lg"></i> {/* Cambié el icono a "fa-box" */}
              </div>
            </div>
          </div>
        </div>



        {/* Tasa de Merma generada */}
        <div className="bg-white rounded-2xl border-l-4 border-purple-500 cardDashboard shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <div className="p-4">
            <div className="flex items-center">
              <div>
                <p className="mb-1 text-stone-600">Tasa Merma Generada</p>
                <h4 className="text-purple-600 text-xl font-bold">
                6.43%
                </h4>
                <Link className="text-sm text-purple-500 hover:text-purple-700" to="/admin/report_merma">
                  Detalle
                </Link>
              </div>
              <div className="ml-auto bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                <i className="fas fa-trash-alt text-lg"></i> {/* Icono de bote de basura */}
              </div>
            </div>
          </div>
        </div>




        {/* Ordenes en Espera */}
        <div className="bg-white rounded-2xl border-l-4 border-red-600 cardDashboard shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <div className="p-4">
            <div className="flex items-center">
              <div>
                <p className="mb-1 text-stone-600">Órdenes Pendientes</p>
                <h4 className="text-red-600 text-xl font-bold">
                1747
                </h4>
                <Link className="text-sm text-red-500 hover:text-red-700" to="/admin/orders">
                  Detalle
                </Link>
              </div>
              <div className="ml-auto bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                <i className="fas fa-bell text-lg"></i> {/* Icono de campana de alerta */}
              </div>
            </div>
          </div>
        </div>



      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 pt-2 px-8">
        <div className="col-span-1 xl:col-span-3 min-h-[10vh]">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-400 ease-in-out h-full flex flex-col transform hover:scale-104">
            <div className="flex justify-between items-center">
              <h6 className="font-semibold text-gray-800 text-lg">Comparativa Anual de Merma Generada y Material Utilizado</h6>
            </div>
            <div className="flex gap-4 my-4">
              <span className="flex items-center px-3 py-1 border rounded-lg text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                <i
                  className="fa-solid fa-circle mr-2"
                  style={{ color: "#ef4444" }}
                ></i>
                Merma
              </span>
              <span className="flex items-center px-3 py-1 border rounded-lg text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                <i
                  className="fa-solid fa-circle mr-2"
                  style={{ color: "#3b82f6" }} // Color verde para Ahorro
                ></i>
                Espacio Usado
              </span>
            </div>
            <BarChartComponent />
          </div>
        </div>



        {/* Order */}
        <div className="col-span-1 xl:col-span-2 min-h-[10vh]">
          <div className="bg-white rounded-2xl p-6 shadow-lg transition-transform duration-300 transform hover:scale-104 hover:shadow-2xl h-full flex flex-col">
            <div className="flex justify-between items-center">
              <h6 className="font-semibold text-gray-800">Órdenes con mayor merma generada</h6>
            </div>
            <div className="flex justify-center">
              <PieChart
                series={[
                  {
                    data: desktopOS,
                    innerRadius: 10,
                    paddingAngle: 2,
                    cornerRadius: 5,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                height={200}
              />
            </div>
            <ul className="mt-1 flex-grow">
              <li className="flex justify-between items-center py-1 border-b">
                00005{" "}
                <span className="bg-green-500 text-white rounded-full px-3 py-1">
                  2510
                </span>
              </li>
              <li className="flex justify-between items-center py-1 border-b">
                00003{" "}
                <span className="bg-red-500 text-white rounded-full px-3 py-1">
                  1044
                </span>
              </li>
              <li className="flex justify-between items-center py-1 border-b">
                00002{" "}
                <span className="bg-blue-500 text-white rounded-full px-3 py-1">
                  3594
                </span>
              </li>
              <li className="flex justify-between items-center py-1 border-b">
                00001{" "}
                <span className="bg-yellow-500 text-black rounded-full px-3 py-1">
                  6510
                </span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </>
  );
};

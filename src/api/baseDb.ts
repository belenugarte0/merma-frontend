import axios from "axios";

export const logisticDb = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});
export const apiPapelera = axios.create({
  baseURL: import.meta.env.VITE_API_LA_PAPELERA_PEDIDOS,
  headers: {
    Accept: "application/json",
  },
});
export const apiModelo = axios.create({
  baseURL: import.meta.env.VITE_API_MODELO,
  headers: {
    Accept: "application/json",
  },
});
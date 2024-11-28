export const formatDate = (fecha: string) => {
  const nuevaFecha = new Date(fecha);

  const dia = nuevaFecha.getDate();
  const mes = nuevaFecha.getMonth() + 1;
  const año = nuevaFecha.getFullYear();

  const fechaFormateada = `${dia < 10 ? "0" + dia : dia} - ${
    mes < 10 ? "0" + mes : mes
  } - ${año}`;

  return fechaFormateada;
};

export const formatTime = (fecha: string) => {
  const nuevaFecha = new Date(fecha);
  const dia = nuevaFecha.getDate();
  const mes = nuevaFecha.getMonth() + 1;
  const año = nuevaFecha.getFullYear();
  let horas = nuevaFecha.getHours();
  const minutos = nuevaFecha.getMinutes();
  const periodo = horas >= 12 ? "PM" : "AM";

  horas = horas % 12 || 12;

  const fechaFormateada = `${dia < 10 ? "0" + dia : dia}/${
    mes < 10 ? "0" + mes : mes
  }/${año}`;
  const horaFormateada = `${horas < 10 ? "0" + horas : horas}:${
    minutos < 10 ? "0" + minutos : minutos
  } ${periodo}`;
  return `${fechaFormateada} - ${horaFormateada}`;
};

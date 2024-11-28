import Swal from "sweetalert2";
interface Props {
  icon: "success" | "error" | "warning" | "info" | "question";
  title: string;
}
export const Alerts = ({ icon, title }: Props) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  (async () => {
    await Toast.fire({
      icon: icon,
      title: title,
    });
  })();
};


import { Toaster } from "sonner";
import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../stores";
import { CircularProgress } from "@nextui-org/react";

export const AuthLayout = () => {
  const authStatus = useAuthStore((state) => state.authStatus);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  if (authStatus === "pending") {
    checkAuthStatus();

    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Cargando...</p>
        <CircularProgress />
      </div>
    );
  }

  if (authStatus === "auth") {
    return <Navigate to="/admin/home" />;
  }

  return (
    <>
      <Toaster
        position="top-center"
        richColors
        closeButton
        style={{
          position: "absolute",
        }}
      />

     
        <Outlet />

    </>
  );
};

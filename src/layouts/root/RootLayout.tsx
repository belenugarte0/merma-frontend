import { Toaster } from "sonner";
import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../stores";
import { HeaderPage, SideMenu } from "../../components";
import { CircularProgress } from "@nextui-org/react";
import { Footer } from "../../components/ui/Footer";

export const RootLayout = () => {
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

  if (authStatus === "not-auth") {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Toaster
        position="top-right"
        richColors
        closeButton
        style={{ position: "absolute" }}
      />

      <div className="flex flex-grow">
        <SideMenu />
        <div className="flex flex-col w-full">
          <HeaderPage />
          <div className="flex-grow">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

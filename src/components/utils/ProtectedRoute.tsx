import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
    authStatus: state.authStatus,
  }));

  if (user && user.permissions.includes(requiredPermission)) {
    return <>{children}</>;
  }

  return <Navigate to="/unauthorized" replace />;
};

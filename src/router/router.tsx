import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { AuthLayout, RootLayout } from "../layouts";
import {
  UsersPage,
  LoginPage,
  RolesPage,
  HomePage,
  OrdersPage,
  LogAccessPage,
  ProfilesPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  BoardsPage,
  MoldsPage,
  ClassificsPaget,
} from "../pages";
import { ErrorView, ProtectedRoute, UnauthorizedPage } from "../components";
import { ReportsMermaPage } from "../pages/reports/ReportsMermaPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    errorElement: <ErrorView />,
    children: [
      // RUTA DEL LOGIN
      {
        path: "/",
        element: <AuthLayout />, // Layout de autenticación
        children: [
          {
            path: "/",
            element: <LoginPage />, // Componente de login
          },
        ],
      },
      // RUTAS DASHBOARD
      {
        path: "admin",
        element: <RootLayout />,
        children: [
          {
            path: "home",
            element: <HomePage />,
          },
          {
            path: "users",
            element: (
              <ProtectedRoute requiredPermission="ver-usuario">
                <UsersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "orders",
            element:(
            <ProtectedRoute requiredPermission="ver-orders">
             <OrdersPage />
            </ProtectedRoute>
            )
          },
          {
            path: "boards",
            element: (
              <ProtectedRoute requiredPermission="ver-boards">
                <BoardsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "molds",
            element: (
              <ProtectedRoute requiredPermission="ver-molds">
                <MoldsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "log_access",
            element: (
              <ProtectedRoute requiredPermission="ver-log_Acceso">
                <LogAccessPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "roles_permissions",
            element: (
              <ProtectedRoute requiredPermission="ver-role">
                <RolesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: <ProfilesPage />,
          },
          {
            path: "classific",
            element: <ClassificsPaget />,
          },
          {
            path: "clasific",
            element: <ClassificsPaget />,
          },
          {
            path: "report_merma",
            element: <ReportsMermaPage />,
          },
        ],
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "/forgot_password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset_password/:token", // Asegúrate de que el token esté en la ruta
        element: <ResetPasswordPage />,
      },
      // RUTAS AUTH
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);

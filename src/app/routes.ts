/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Use Angular Router with standalone components
 * - Implement AuthGuard service for protected routes
 * - Add canActivate guard to dashboard, notifiche, and pratica routes
 */

import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotifichePage } from "./pages/NotifichePage";
import { DettaglioPraticaPage } from "./pages/DettaglioPraticaPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
      {
        path: "dashboard",
        Component: DashboardPage,
      },
      {
        path: "notifiche",
        Component: NotifichePage,
      },
      {
        path: "pratica/:id",
        Component: DettaglioPraticaPage,
      },
    ],
  },
]);
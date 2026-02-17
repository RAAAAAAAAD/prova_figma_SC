/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Implement as standalone component
 * - Use router-outlet for child routes
 */

import { Outlet } from "react-router";
import { Toaster } from 'sonner';

export function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  );
}

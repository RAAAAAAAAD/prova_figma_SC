/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Implement as standalone component
 * - Use PraticheService to manage pratiche state with signals
 * - Use NotificationService for real-time updates
 * - Protect this route with AuthGuard
 */

import { Dashboard } from '../components/Dashboard';

export function DashboardPage() {
  return <Dashboard />;
}

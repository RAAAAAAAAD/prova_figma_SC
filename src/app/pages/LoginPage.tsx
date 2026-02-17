/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Implement as standalone component
 * - Use AuthService for authentication
 * - Navigate to /dashboard after successful login
 */

import { useNavigate } from "react-router";
import { Login } from "../components/Login";

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return <Login onLogin={handleLogin} />;
}

import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

// Guards the app shell: while the session is being restored we show a
// placeholder; once known, unauthenticated users are sent to /login with the
// attempted location so they return there after signing in.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider, LoginPage, ProtectedRoute, useAuth } from "@/features/auth";
import { appRoutes } from "./appRoutes";

function RoleRoute({ route }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If this route is restricted to admins only and user is not an admin, redirect to employee home
  if (route.adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  const Element = route.element;
  return <Element />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {appRoutes
              .filter((route) => route.element)
              .map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<RoleRoute route={route} />}
                />
              ))}

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

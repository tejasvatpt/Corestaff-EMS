import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider, LoginPage, ProtectedRoute } from "@/features/auth";
import { appRoutes } from "./appRoutes";

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
              .map((route) => {
                const Element = route.element;

                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<Element />}
                  />
                );
              })}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

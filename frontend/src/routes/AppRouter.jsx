import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { appRoutes } from "./appRoutes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
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
    </BrowserRouter>
  );
}
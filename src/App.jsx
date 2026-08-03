import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { MainLayout } from "./layout/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminPage } from "./pages/Admin";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Route>

          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="403" element={<ForbiddenPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

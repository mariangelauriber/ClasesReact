import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { NavbarLink } from "./NavbarLink";

export const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex flex-wrap items-center gap-1" aria-label="Navegación principal">
      {user && <NavbarLink destino="/">Mi permiso</NavbarLink>}
      {isAdmin && <NavbarLink destino="/admin">Gestión</NavbarLink>}

      {user ? (
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Cerrar sesión
        </button>
      ) : (
        <>
          <NavbarLink destino="/login">Entrar</NavbarLink>
          <NavbarLink destino="/register">Crear cuenta</NavbarLink>
        </>
      )}
    </nav>
  );
};

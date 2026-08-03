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
    <nav className="flex items-center gap-2">
      {user && <NavbarLink destino="/">Mi carné</NavbarLink>}
      {isAdmin && <NavbarLink destino="/admin">Admin</NavbarLink>}

      {user ? (
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cerrar sesión
        </button>
      ) : (
        <>
          <NavbarLink destino="/login">Login</NavbarLink>
          <NavbarLink destino="/register">Registro</NavbarLink>
        </>
      )}
    </nav>
  );
};

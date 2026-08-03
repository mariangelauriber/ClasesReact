import { Link } from "react-router-dom";

export function ForbiddenPage() {
  return (
    <section className="panel text-center">
      <h2 className="text-3xl font-bold text-slate-900">403</h2>

      <p className="mt-2 text-slate-500">
        No tienes permisos de administrador para acceder a esta página.
      </p>

      <Link to="/" className="button-primary mt-6 inline-flex">
        Volver al Dashboard
      </Link>
    </section>
  );
}

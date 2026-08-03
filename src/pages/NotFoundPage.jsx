import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="panel text-center">
      <h2 className="text-3xl font-bold text-slate-900">404</h2>

      <p className="mt-2 text-slate-500">La página que buscas no existe.</p>

      <Link to="/" className="button-primary mt-6 inline-flex">
        Volver al Dashboard
      </Link>
    </section>
  );
}

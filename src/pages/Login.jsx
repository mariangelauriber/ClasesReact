import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { traducirErrorFirebase } from "../lib/firebaseErrors";
import { Loading } from "../components/Loading";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from ?? "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(traducirErrorFirebase(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <section className="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Iniciar sesión</h2>
      <p className="mt-1 text-sm text-slate-500">
        Accede a tu carné por puntos con tu email y contraseña.
      </p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-cyan-500 py-2 px-4 text-white hover:bg-cyan-600"
        >
          Iniciar sesión
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="font-medium text-cyan-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </section>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCitizen } from "../services/authService";
import { traducirErrorFirebase } from "../lib/firebaseErrors";
import { isValidDni } from "../lib/validation";
import { Loading } from "../components/Loading";

const initialForm = { nombre: "", apellidos: "", dni: "", email: "", password: "" };

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!isValidDni(form.dni)) {
      setError("Introduce un DNI válido, con la letra correcta (ej. 12345678Z).");
      return;
    }

    setLoading(true);
    try {
      await registerCitizen(form.email.trim(), form.password, {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        dni: form.dni.trim(),
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(traducirErrorFirebase(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <section className="panel mx-auto max-w-md">
      <h2 className="text-xl font-bold text-slate-900">Crear cuenta de ciudadano</h2>
      <p className="mt-1 text-sm text-slate-500">
        Empezarás con 8 puntos en tu carné, como marca la normativa de la DGT.
      </p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              className="field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Apellidos
            </label>
            <input
              type="text"
              name="apellidos"
              required
              value={form.apellidos}
              onChange={handleChange}
              className="field"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            DNI
          </label>
          <input
            type="text"
            name="dni"
            required
            placeholder="12345678Z"
            value={form.dni}
            onChange={handleChange}
            className="field uppercase"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="field"
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
            value={form.password}
            onChange={handleChange}
            className="field"
          />
        </div>

        <button type="submit" className="button-primary w-full">
          Crear cuenta
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </section>
  );
}

import { useState } from "react";

const initialForm = { matricula: "", marca: "", modelo: "", anio: "" };

export function VehicleForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!form.matricula.trim() || !form.marca.trim() || !form.modelo.trim() || !form.anio) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(initialForm);
    } catch (err) {
      setError(err.message ?? "No se pudo guardar el vehículo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-4">
      <input
        type="text"
        name="matricula"
        placeholder="Matrícula"
        value={form.matricula}
        onChange={handleChange}
        className="rounded-md border border-gray-300 p-2 uppercase"
      />
      <input
        type="text"
        name="marca"
        placeholder="Marca"
        value={form.marca}
        onChange={handleChange}
        className="rounded-md border border-gray-300 p-2"
      />
      <input
        type="text"
        name="modelo"
        placeholder="Modelo"
        value={form.modelo}
        onChange={handleChange}
        className="rounded-md border border-gray-300 p-2"
      />
      <input
        type="number"
        name="anio"
        placeholder="Año"
        value={form.anio}
        onChange={handleChange}
        className="rounded-md border border-gray-300 p-2"
      />

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 sm:col-span-4"
      >
        {submitting ? "Guardando..." : "Añadir vehículo"}
      </button>

      {error && <p className="text-sm text-red-500 sm:col-span-4">{error}</p>}
    </form>
  );
}

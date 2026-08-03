import { useState } from "react";
import { isValidMatricula, isValidVehicleYear } from "../lib/validation";

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

    if (!isValidMatricula(form.matricula)) {
      setError("Introduce una matrícula española válida, por ejemplo 1234BCD.");
      return;
    }

    if (!isValidVehicleYear(form.anio)) {
      setError("Introduce un año de matriculación válido.");
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
        className="field uppercase"
        maxLength={7}
      />
      <input
        type="text"
        name="marca"
        placeholder="Marca"
        value={form.marca}
        onChange={handleChange}
        className="field"
      />
      <input
        type="text"
        name="modelo"
        placeholder="Modelo"
        value={form.modelo}
        onChange={handleChange}
        className="field"
      />
      <input
        type="number"
        name="anio"
        placeholder="Año"
        value={form.anio}
        onChange={handleChange}
        className="field"
        min="1900"
        max={new Date().getFullYear() + 1}
      />

      <button
        type="submit"
        disabled={submitting}
        className="button-secondary sm:col-span-4"
      >
        {submitting ? "Guardando..." : "Añadir vehículo"}
      </button>

      {error && <p className="text-sm text-red-500 sm:col-span-4">{error}</p>}
    </form>
  );
}

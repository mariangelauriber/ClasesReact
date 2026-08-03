import { useState } from "react";
import { INFRACTION_CATALOG } from "../data/infractionCatalog";

export function InfractionForm({ vehiculos, onSubmit }) {
  const [tipoId, setTipoId] = useState(INFRACTION_CATALOG[0].id);
  const [matricula, setMatricula] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const infraccion = INFRACTION_CATALOG.find((item) => item.id === tipoId);

    setSubmitting(true);
    try {
      await onSubmit({
        tipo: infraccion.id,
        descripcion: infraccion.descripcion,
        gravedad: infraccion.gravedad,
        puntosRestados: infraccion.puntos,
        importe: infraccion.importe,
        matricula: matricula || null,
      });
      setMatricula("");
    } catch (err) {
      setError(err.message ?? "No se pudo registrar la infracción.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Tipo de infracción
        </label>
        <select
          value={tipoId}
          onChange={(event) => setTipoId(event.target.value)}
          className="field"
        >
          {INFRACTION_CATALOG.map((item) => (
            <option key={item.id} value={item.id}>
              {item.descripcion} (-{item.puntos} pts, {item.importe} €)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Matrícula del vehículo
        </label>
        {vehiculos.length > 0 ? (
          <select
            value={matricula}
            onChange={(event) => setMatricula(event.target.value)}
            className="field"
          >
            <option value="">Sin especificar</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id} value={vehiculo.matricula}>
                {vehiculo.matricula}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={matricula}
            onChange={(event) => setMatricula(event.target.value)}
            placeholder="1234ABC"
            className="field uppercase"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {submitting ? "Registrando..." : "Poner multa"}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}

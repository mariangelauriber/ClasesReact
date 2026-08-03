import { Badge } from "./Badge";
import { ESTADO_LABELS, GRAVEDAD_LABELS } from "../lib/constants";

function formatFecha(fecha) {
  if (!fecha?.toDate) return "—";
  return fecha.toDate().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function toneForGravedad(gravedad) {
  if (gravedad === "muy_grave") return "red";
  if (gravedad === "grave") return "yellow";
  return "slate";
}

export function InfractionList({ infracciones, onMarkPaid }) {
  if (infracciones.length === 0) {
    return <p className="text-sm text-slate-500">No hay infracciones registradas.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {infracciones.map((infraccion) => (
        <li
          key={infraccion.id}
          className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium text-slate-900">{infraccion.descripcion}</p>
            <p className="text-sm text-slate-500">
              {formatFecha(infraccion.fecha)} · Matrícula {infraccion.matricula ?? "—"} · -
              {infraccion.puntosRestados} puntos · {infraccion.importe} €
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone={toneForGravedad(infraccion.gravedad)}>
              {GRAVEDAD_LABELS[infraccion.gravedad]}
            </Badge>
            <Badge tone={infraccion.estado === "pagada" ? "green" : "yellow"}>
              {ESTADO_LABELS[infraccion.estado]}
            </Badge>
            {onMarkPaid && infraccion.estado === "pendiente" && (
              <button
                onClick={() => onMarkPaid(infraccion.id)}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Marcar pagada
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

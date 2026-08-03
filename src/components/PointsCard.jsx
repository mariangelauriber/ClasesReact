import { Badge } from "./Badge";
import { PUNTOS_MAXIMOS } from "../lib/constants";

function toneForPoints(puntos) {
  if (puntos >= 8) return "green";
  if (puntos >= 4) return "yellow";
  return "red";
}

const BAR_COLORS = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
};

export function PointsCard({ puntos, permisoRetirado }) {
  const tone = toneForPoints(puntos);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium text-slate-500">Saldo de puntos</h3>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-4xl font-bold text-slate-900">{puntos}</span>
        <span className="pb-1 text-slate-400">/ {PUNTOS_MAXIMOS}</span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${BAR_COLORS[tone]}`}
          style={{ width: `${Math.min(100, (puntos / PUNTOS_MAXIMOS) * 100)}%` }}
        />
      </div>

      <div className="mt-4">
        {permisoRetirado ? (
          <Badge tone="red">Permiso retirado</Badge>
        ) : (
          <Badge tone={tone}>Permiso vigente</Badge>
        )}
      </div>
    </div>
  );
}

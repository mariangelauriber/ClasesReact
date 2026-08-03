export function VehicleList({ vehiculos, onDelete }) {
  if (vehiculos.length === 0) {
    return <p className="text-sm text-slate-500">No hay vehículos registrados.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {vehiculos.map((vehiculo) => (
        <li key={vehiculo.id} className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-slate-900">{vehiculo.matricula}</p>
            <p className="text-sm text-slate-500">
              {vehiculo.marca} {vehiculo.modelo} · {vehiculo.anio}
            </p>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(vehiculo.id)}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Eliminar
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

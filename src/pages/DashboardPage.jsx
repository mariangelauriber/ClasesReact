import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { addVehicle, subscribeToVehicles } from "../services/vehicleService";
import { subscribeToInfractionsByCitizen } from "../services/infractionService";
import { PointsCard } from "../components/PointsCard";
import { VehicleList } from "../components/VehicleList";
import { VehicleForm } from "../components/VehicleForm";
import { InfractionList } from "../components/InfractionList";
import { Loading } from "../components/Loading";

export function DashboardPage() {
  const { user, profile } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [infracciones, setInfracciones] = useState([]);
  const [vehiculosLoaded, setVehiculosLoaded] = useState(false);
  const [infraccionesLoaded, setInfraccionesLoaded] = useState(false);

  useEffect(() => {
    if (!user) return undefined;

    const unsubscribeVehiculos = subscribeToVehicles(user.uid, (data) => {
      setVehiculos(data);
      setVehiculosLoaded(true);
    });

    const unsubscribeInfracciones = subscribeToInfractionsByCitizen(user.uid, (data) => {
      setInfracciones(data);
      setInfraccionesLoaded(true);
    });

    return () => {
      unsubscribeVehiculos();
      unsubscribeInfracciones();
    };
  }, [user]);

  if (!profile || !vehiculosLoaded || !infraccionesLoaded) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Hola, {profile.nombre} {profile.apellidos}
        </h2>
        <p className="mt-1 text-sm text-slate-500">DNI {profile.dni}</p>
      </div>

      <PointsCard puntos={profile.puntos} permisoRetirado={profile.permisoRetirado} />

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Mis vehículos</h3>
        <div className="mt-4">
          <VehicleList vehiculos={vehiculos} />
        </div>
        <div className="mt-6 border-t pt-4">
          <VehicleForm onSubmit={(data) => addVehicle(user.uid, data)} />
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Mis infracciones</h3>
        <div className="mt-4">
          <InfractionList infracciones={infracciones} />
        </div>
      </section>
    </div>
  );
}

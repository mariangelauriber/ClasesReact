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
  const { user, profile, profileError } = useAuth();
  const [vehiculosState, setVehiculosState] = useState({ uid: null, data: [], loaded: false });
  const [infraccionesState, setInfraccionesState] = useState({
    uid: null,
    data: [],
    loaded: false,
  });
  const [errorState, setErrorState] = useState({ uid: null, message: null });

  useEffect(() => {
    if (!user) return undefined;

    const handleError = (error) => {
      console.error("Error cargando datos del ciudadano:", error);
      setErrorState({
        uid: user.uid,
        message: "No se pudieron cargar todos los datos. Comprueba Firestore y sus reglas.",
      });
    };

    const unsubscribeVehiculos = subscribeToVehicles(
      user.uid,
      (data) => setVehiculosState({ uid: user.uid, data, loaded: true }),
      handleError,
    );

    const unsubscribeInfracciones = subscribeToInfractionsByCitizen(
      user.uid,
      (data) => setInfraccionesState({ uid: user.uid, data, loaded: true }),
      handleError,
    );

    return () => {
      unsubscribeVehiculos();
      unsubscribeInfracciones();
    };
  }, [user]);

  const vehiculosMatch = Boolean(user) && vehiculosState.uid === user.uid;
  const infraccionesMatch = Boolean(user) && infraccionesState.uid === user.uid;
  const vehiculos = vehiculosMatch ? vehiculosState.data : [];
  const infracciones = infraccionesMatch ? infraccionesState.data : [];
  const vehiculosLoaded = vehiculosMatch && vehiculosState.loaded;
  const infraccionesLoaded = infraccionesMatch && infraccionesState.loaded;
  const dataError = Boolean(user) && errorState.uid === user.uid ? errorState.message : null;

  if (profileError || dataError) {
    return (
      <section className="panel border-red-200" role="alert">
        <h2 className="font-bold text-red-700">No podemos mostrar tus datos</h2>
        <p className="mt-2 text-sm text-slate-600">{profileError ?? dataError}</p>
      </section>
    );
  }

  if (!profile || !vehiculosLoaded || !infraccionesLoaded) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-ink px-5 py-6 text-white sm:px-7">
        <p className="text-sm font-medium text-cyan-100">Área personal</p>
        <h2 className="mt-1 text-2xl font-bold">
          Hola, {profile.nombre} {profile.apellidos}
        </h2>
        <p className="mt-1 text-sm text-slate-300">DNI {profile.dni}</p>
      </div>

      <PointsCard puntos={profile.puntos} permisoRetirado={profile.permisoRetirado} />

      <section className="panel">
        <h3 className="text-lg font-semibold text-slate-900">Mis vehículos</h3>
        <div className="mt-4">
          <VehicleList vehiculos={vehiculos} />
        </div>
        <div className="mt-6 border-t pt-4">
          <VehicleForm onSubmit={(data) => addVehicle(user.uid, data)} />
        </div>
      </section>

      <section className="panel">
        <h3 className="text-lg font-semibold text-slate-900">Mis infracciones</h3>
        <div className="mt-4">
          <InfractionList infracciones={infracciones} />
        </div>
      </section>
    </div>
  );
}

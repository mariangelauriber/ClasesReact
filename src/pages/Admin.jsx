import { useEffect, useState } from "react";
import {
  adjustPoints,
  searchCitizenByDni,
  searchCitizenByEmail,
  setLicenseRetired,
  subscribeToCitizenProfile,
} from "../services/citizenService";
import {
  addVehicle,
  deleteVehicle,
  subscribeToVehicles,
} from "../services/vehicleService";
import {
  createInfraction,
  markInfractionPaid,
  subscribeToInfractionsByCitizen,
} from "../services/infractionService";
import { traducirErrorFirebase } from "../lib/firebaseErrors";
import { useAuth } from "../hooks/useAuth";
import { AdminSearchForm } from "../components/AdminSearchForm";
import { InfractionForm } from "../components/InfractionForm";
import { InfractionList } from "../components/InfractionList";
import { VehicleList } from "../components/VehicleList";
import { VehicleForm } from "../components/VehicleForm";
import { PointsCard } from "../components/PointsCard";

export function AdminPage() {
  const { user } = useAuth();
  const [selectedUid, setSelectedUid] = useState(null);
  const [citizenState, setCitizenState] = useState({ uid: null, data: null });
  const [vehiculosState, setVehiculosState] = useState({ uid: null, data: [] });
  const [infraccionesState, setInfraccionesState] = useState({ uid: null, data: [] });
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!selectedUid) return undefined;

    const unsubscribeCitizen = subscribeToCitizenProfile(selectedUid, (data) => {
      setCitizenState({ uid: selectedUid, data });
    });
    const unsubscribeVehiculos = subscribeToVehicles(selectedUid, (data) => {
      setVehiculosState({ uid: selectedUid, data });
    });
    const unsubscribeInfracciones = subscribeToInfractionsByCitizen(selectedUid, (data) => {
      setInfraccionesState({ uid: selectedUid, data });
    });

    return () => {
      unsubscribeCitizen();
      unsubscribeVehiculos();
      unsubscribeInfracciones();
    };
  }, [selectedUid]);

  // Solo se muestran datos cuando pertenecen al ciudadano seleccionado
  // actualmente: evita destellos con datos del ciudadano buscado anteriormente.
  const citizen = selectedUid && citizenState.uid === selectedUid ? citizenState.data : null;
  const vehiculos =
    selectedUid && vehiculosState.uid === selectedUid ? vehiculosState.data : [];
  const infracciones =
    selectedUid && infraccionesState.uid === selectedUid ? infraccionesState.data : [];

  const handleSearch = async (modo, valor) => {
    setNotice(null);
    setSearchNotFound(false);

    const result =
      modo === "dni" ? await searchCitizenByDni(valor) : await searchCitizenByEmail(valor);

    if (!result) {
      setSelectedUid(null);
      setSearchNotFound(true);
      return;
    }

    setSelectedUid(result.id);
  };

  const handleCreateInfraction = async (data) => {
    await createInfraction({
      uidCiudadano: citizen.id,
      dni: citizen.dni,
      creadaPorUid: user.uid,
      ...data,
    });
    setNotice({ type: "success", message: "Infracción registrada correctamente." });
  };

  const handleAdjustPoints = async (delta) => {
    try {
      await adjustPoints(citizen.id, delta);
    } catch (err) {
      setNotice({ type: "error", message: traducirErrorFirebase(err) });
    }
  };

  const handleToggleLicense = async () => {
    try {
      await setLicenseRetired(citizen.id, !citizen.permisoRetirado);
    } catch (err) {
      setNotice({ type: "error", message: traducirErrorFirebase(err) });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Panel de administración</h2>
        <p className="mt-1 text-sm text-slate-500">
          Busca a un ciudadano por DNI o email para gestionar sus puntos, multas y
          vehículos.
        </p>
      </div>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <AdminSearchForm onSearch={handleSearch} />
        {searchNotFound && (
          <p className="mt-4 text-sm text-red-500">
            No se ha encontrado ningún ciudadano con esos datos.
          </p>
        )}
      </section>

      {notice && (
        <p
          className={`text-sm ${
            notice.type === "error" ? "text-red-500" : "text-emerald-600"
          }`}
        >
          {notice.message}
        </p>
      )}

      {citizen && (
        <>
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {citizen.nombre} {citizen.apellidos}
                </h3>
                <p className="text-sm text-slate-500">
                  DNI {citizen.dni} · {citizen.email}
                </p>
              </div>

              <button
                onClick={handleToggleLicense}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                  citizen.permisoRetirado
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {citizen.permisoRetirado ? "Devolver permiso" : "Retirar permiso"}
              </button>
            </div>

            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <PointsCard puntos={citizen.puntos} permisoRetirado={citizen.permisoRetirado} />

              <div className="rounded-xl border p-4">
                <h4 className="text-sm font-medium text-slate-500">
                  Ajuste manual de puntos
                </h4>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleAdjustPoints(-1)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
                  >
                    -1 punto
                  </button>
                  <button
                    onClick={() => handleAdjustPoints(1)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
                  >
                    +1 punto
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Poner una multa</h3>
            <div className="mt-4">
              <InfractionForm vehiculos={vehiculos} onSubmit={handleCreateInfraction} />
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Vehículos</h3>
            <div className="mt-4">
              <VehicleList
                vehiculos={vehiculos}
                onDelete={(vehicleId) => deleteVehicle(citizen.id, vehicleId)}
              />
            </div>
            <div className="mt-6 border-t pt-4">
              <VehicleForm onSubmit={(data) => addVehicle(citizen.id, data)} />
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Historial de infracciones
            </h3>
            <div className="mt-4">
              <InfractionList infracciones={infracciones} onMarkPaid={markInfractionPaid} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

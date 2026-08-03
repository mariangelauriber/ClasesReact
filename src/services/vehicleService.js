import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export function subscribeToVehicles(uid, onChange) {
  const ref = collection(db, "users", uid, "vehiculos");
  return onSnapshot(ref, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addVehicle(uid, { matricula, marca, modelo, anio }) {
  const ref = collection(db, "users", uid, "vehiculos");
  await addDoc(ref, {
    matricula: matricula.trim().toUpperCase(),
    marca: marca.trim(),
    modelo: modelo.trim(),
    anio: Number(anio),
    createdAt: serverTimestamp(),
  });
}

export async function deleteVehicle(uid, vehicleId) {
  await deleteDoc(doc(db, "users", uid, "vehiculos", vehicleId));
}

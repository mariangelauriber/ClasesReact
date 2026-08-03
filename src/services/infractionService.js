import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export async function createInfraction({
  uidCiudadano,
  dni,
  tipo,
  gravedad,
  descripcion,
  puntosRestados,
  importe,
  matricula,
  creadaPorUid,
}) {
  const userRef = doc(db, "users", uidCiudadano);
  const infraccionRef = doc(collection(db, "infracciones"));

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) throw new Error("El ciudadano no existe.");

    const currentPoints = userSnap.data().puntos ?? 0;
    const newPoints = Math.max(0, currentPoints - puntosRestados);

    transaction.update(userRef, {
      puntos: newPoints,
      permisoRetirado: newPoints === 0 ? true : userSnap.data().permisoRetirado,
    });

    transaction.set(infraccionRef, {
      uidCiudadano,
      dni,
      fecha: serverTimestamp(),
      tipo,
      gravedad,
      descripcion,
      puntosRestados,
      importe,
      estado: "pendiente",
      matricula: matricula ? matricula.trim().toUpperCase() : null,
      creadaPorUid,
    });
  });

  return infraccionRef.id;
}

export function subscribeToInfractionsByCitizen(uid, onChange) {
  const q = query(
    collection(db, "infracciones"),
    where("uidCiudadano", "==", uid),
    orderBy("fecha", "desc"),
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function markInfractionPaid(infractionId) {
  await updateDoc(doc(db, "infracciones", infractionId), { estado: "pagada" });
}

import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { PUNTOS_MAXIMOS } from "../lib/constants";

export function subscribeToCitizenProfile(uid, onChange) {
  const ref = doc(db, "users", uid);
  return onSnapshot(ref, (snap) => {
    onChange(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export async function searchCitizenByDni(dni) {
  const q = query(
    collection(db, "users"),
    where("dni", "==", dni.trim().toUpperCase()),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const found = snap.docs[0];
  return { id: found.id, ...found.data() };
}

export async function searchCitizenByEmail(email) {
  const q = query(
    collection(db, "users"),
    where("email", "==", email.trim().toLowerCase()),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const found = snap.docs[0];
  return { id: found.id, ...found.data() };
}

export async function adjustPoints(uid, delta) {
  const userRef = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(userRef);
    if (!snap.exists()) throw new Error("El ciudadano no existe.");

    const current = snap.data().puntos ?? 0;
    const next = Math.min(PUNTOS_MAXIMOS, Math.max(0, current + delta));

    transaction.update(userRef, {
      puntos: next,
      permisoRetirado: next === 0 ? true : snap.data().permisoRetirado,
    });
  });
}

export async function setLicenseRetired(uid, retirado) {
  await updateDoc(doc(db, "users", uid), { permisoRetirado: retirado });
}

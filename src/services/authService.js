import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { PUNTOS_INICIALES } from "../lib/constants";

export async function registerCitizen(email, password, { nombre, apellidos, dni }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", credential.user.uid), {
    uid: credential.user.uid,
    email: email.toLowerCase(),
    nombre,
    apellidos,
    dni: dni.toUpperCase(),
    role: "ciudadano",
    puntos: PUNTOS_INICIALES,
    permisoRetirado: false,
    createdAt: serverTimestamp(),
  });

  return credential.user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function subscribeToAuthState(onChange) {
  return onAuthStateChanged(auth, onChange);
}

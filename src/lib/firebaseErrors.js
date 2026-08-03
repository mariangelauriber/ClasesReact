const MESSAGES = {
  "auth/invalid-email": "El email no es válido.",
  "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
  "auth/user-not-found": "No existe ninguna cuenta con ese email.",
  "auth/wrong-password": "La contraseña es incorrecta.",
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese email.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests":
    "Demasiados intentos fallidos. Inténtalo más tarde.",
  "auth/missing-password": "Debes introducir una contraseña.",
  "permission-denied": "No tienes permisos para realizar esta acción.",
  "not-found": "No se ha encontrado el recurso solicitado.",
};

export function traducirErrorFirebase(error) {
  return (
    MESSAGES[error?.code] ?? "Ha ocurrido un error inesperado. Inténtalo de nuevo."
  );
}

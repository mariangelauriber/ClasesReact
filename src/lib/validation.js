const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const DNI_REGEX = /^(\d{8})([A-Z])$/i;
const MATRICULA_REGEX = /^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/i;

export function isValidDni(value) {
  const match = value.trim().toUpperCase().match(DNI_REGEX);
  if (!match) return false;
  return DNI_LETTERS[Number(match[1]) % 23] === match[2];
}

export function isValidMatricula(value) {
  return MATRICULA_REGEX.test(value.trim());
}

export function isValidVehicleYear(value) {
  const year = Number(value);
  return Number.isInteger(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
}

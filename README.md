# DGT · Carné por puntos

Aplicación web inspirada en la Dirección General de Tráfico (DGT) española. Los
**ciudadanos** inician sesión y consultan el saldo de puntos de su carné, sus
vehículos y su historial de infracciones. Los **administradores** (agentes)
buscan a un ciudadano, ponen multas, ajustan puntos y pueden retirar o
devolver el permiso de conducir.

## Stack

- React 19 + Vite + React Router 7
- Tailwind CSS 4
- Firebase Authentication (email/contraseña) + Cloud Firestore
- Despliegue en Vercel

## Modelo de datos (Firestore)

```
users/{uid}
  uid, email, nombre, apellidos, dni
  role: "ciudadano" | "admin"
  puntos: number (0-15)
  permisoRetirado: boolean
  createdAt

users/{uid}/vehiculos/{vehiculoId}
  matricula, marca, modelo, anio, createdAt

infracciones/{infraccionId}
  uidCiudadano, dni, fecha, tipo, gravedad ("leve"|"grave"|"muy_grave")
  descripcion, puntosRestados, importe
  estado: "pendiente" | "pagada"
  matricula, creadaPorUid
```

### Reglas de negocio

- Un ciudadano nuevo empieza con **8 puntos** (máximo 15).
- Cada infracción resta puntos según su gravedad y añade una multa (importe).
- Al llegar a **0 puntos**, el permiso queda retirado automáticamente.
- Solo un administrador puede poner multas, ajustar puntos manualmente y
  retirar/devolver el permiso. Estas operaciones se validan también en
  `firestore.rules`, no solo en el cliente.

## 1. Crear el proyecto de Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y
   pulsa **Añadir proyecto**. Ponle un nombre (p. ej. `dgt-puntos`) y crea el
   proyecto (puedes desactivar Google Analytics, no es necesario).
2. Dentro del proyecto, entra en **Compilación → Authentication**, pestaña
   **Sign-in method**, y habilita el proveedor **Email/contraseña**.
3. Entra en **Compilación → Firestore Database** y pulsa **Crear base de
   datos**. Elige **modo de producción** y la región más cercana.
4. Ve a **Configuración del proyecto** (icono de engranaje) → pestaña
   **General** → sección **Tus apps** → pulsa el icono `</>` (Web) para
   registrar una app web. No hace falta Firebase Hosting.
5. Copia el objeto `firebaseConfig` que te muestra: lo necesitas para el
   `.env`.

## 2. Configurar las variables de entorno

Copia `.env.example` a `.env` y rellena los valores con los que copiaste en el
paso anterior:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

`.env` ya está en `.gitignore`: nunca lo subas al repositorio.

## 3. Desplegar las reglas de seguridad de Firestore

El archivo [`firestore.rules`](firestore.rules) contiene los permisos: un
ciudadano solo lee sus propios datos, y solo un admin puede escribir puntos,
infracciones y permisos.

**Opción rápida (consola):** abre **Firestore Database → Reglas** en la
consola de Firebase, pega el contenido de `firestore.rules` y pulsa
**Publicar**.

**Opción con Firebase CLI** (si prefieres versionarlo desde tu máquina):

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # selecciona el proyecto creado, y "firestore.rules" al preguntarte por el archivo de reglas
firebase deploy --only firestore:rules
```

## 4. Ejecutar en local

```bash
npm install
npm run dev
```

1. Abre la app, entra en **Registro** y crea tu primera cuenta (empezará como
   `role: "ciudadano"` con 8 puntos).
2. Para probar el panel de administración necesitas un usuario con
   `role: "admin"`. Firestore no permite autoasignarse ese rol desde la app
   (a propósito, por seguridad), así que actívalo manualmente:
   - Ve a **Firestore Database → Datos** en la consola de Firebase.
   - Abre la colección `users` y busca el documento con tu `uid`.
   - Edita el campo `role` y cámbialo de `ciudadano` a `admin`.
   - Vuelve a la app y recarga: ya verás el enlace **Admin** en la barra de
     navegación.

## 5. Desplegar en Vercel

1. Sube el repositorio a GitHub (si no lo está ya).
2. En [vercel.com](https://vercel.com), pulsa **Add New → Project** e importa
   el repositorio. Vercel detecta Vite automáticamente
   (`npm run build`, carpeta `dist`).
3. En **Settings → Environment Variables**, añade las mismas seis variables
   `VITE_FIREBASE_*` que tienes en tu `.env` local.
4. Despliega. El archivo [`vercel.json`](vercel.json) ya incluye el rewrite
   necesario para que las rutas de React Router funcionen en producción
   (todas las rutas devuelven `index.html`).

## Scripts

```bash
npm run dev       # entorno de desarrollo
npm run build     # build de producción (dist/)
npm run preview   # previsualizar el build
npm run lint      # ESLint
```

## Estructura del proyecto

```
src/
  lib/            # firebase.js, constants.js, firebaseErrors.js, utils.js
  context/        # AuthContext (sesión + perfil + rol en tiempo real)
  hooks/          # useAuth
  services/       # authService, citizenService, vehicleService, infractionService
  components/     # UI reutilizable + ProtectedRoute / AdminRoute
  pages/          # Login, Register, DashboardPage (ciudadano), Admin, 403, 404
  data/           # catálogo de infracciones (tipo, gravedad, puntos, importe)
```

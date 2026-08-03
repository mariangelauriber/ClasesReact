import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-sm font-black text-white" aria-hidden="true">
              MT
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-ink">Mi Tráfico</h1>
              <p className="text-xs text-slate-500">Puntos, vehículos e infracciones</p>
            </div>
          </div>

          <Navbar />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

import { useState } from "react";

export function AdminSearchForm({ onSearch }) {
  const [modo, setModo] = useState("dni");
  const [valor, setValor] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!valor.trim()) return;

    setSearching(true);
    try {
      await onSearch(modo, valor.trim());
    } finally {
      setSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Buscar por</label>
        <select
          value={modo}
          onChange={(event) => setModo(event.target.value)}
          className="rounded-md border border-gray-300 p-2"
        >
          <option value="dni">DNI</option>
          <option value="email">Email</option>
        </select>
      </div>

      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {modo === "dni" ? "DNI del ciudadano" : "Email del ciudadano"}
        </label>
        <input
          type="text"
          value={valor}
          onChange={(event) => setValor(event.target.value)}
          placeholder={modo === "dni" ? "12345678Z" : "persona@email.com"}
          className="w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <button
        type="submit"
        disabled={searching}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {searching ? "Buscando..." : "Buscar"}
      </button>
    </form>
  );
}

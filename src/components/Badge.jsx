const TONES = {
  green: "bg-emerald-100 text-emerald-700",
  yellow: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  slate: "bg-slate-100 text-slate-700",
};

export function Badge({ tone = "slate", children }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

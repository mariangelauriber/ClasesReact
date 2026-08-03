export const Loading = () => {
  return (
    <div className="flex min-h-48 items-center justify-center" role="status">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        Cargando información…
      </div>
    </div>
  );
};

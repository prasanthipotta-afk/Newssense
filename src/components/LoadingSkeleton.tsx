export default function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="h-48 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 space-y-3">
            <div className="h-5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

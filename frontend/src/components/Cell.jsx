const statusClasses = {
  CORRECT: "border-emerald-500 bg-emerald-500/20 text-emerald-100",
  PRESENT: "border-amber-400 bg-amber-400/20 text-amber-100",
  ABSENT: "border-slate-700 bg-slate-800 text-slate-300",
};

export default function Cell({ value, status }) {
  const baseClasses =
    "flex h-12 w-12 items-center justify-center rounded border-2 text-2xl font-semibold sm:h-14 sm:w-14 sm:text-3xl";
  const filledClasses = value
    ? "border-slate-300 bg-slate-900 text-white"
    : "border-slate-700 bg-transparent text-slate-500";

  return (
    <div className={`${baseClasses} ${statusClasses[status] ?? filledClasses}`}>
      {value}
    </div>
  );
}

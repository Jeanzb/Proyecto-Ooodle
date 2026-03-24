const symbols = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "*"];

export default function Keyboard({
  onSymbol,
  onEnter,
  onBackspace,
  disabled,
}) {
  return (
    <div className="flex max-w-xl flex-wrap justify-center gap-2">
      {symbols.map((symbol) => (
        <button
          key={symbol}
          className="flex h-14 w-12 items-center justify-center rounded bg-slate-700 text-xl font-semibold text-slate-100 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
          disabled={disabled}
          onClick={() => onSymbol(symbol)}
          type="button"
        >
          {symbol}
        </button>
      ))}

      <button
        className="w-24 rounded bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
        disabled={disabled}
        onClick={onEnter}
        type="button"
      >
        Enter
      </button>

      <button
        className="w-24 rounded bg-slate-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
        disabled={disabled}
        onClick={onBackspace}
        type="button"
      >
        Borrar
      </button>
    </div>
  );
}

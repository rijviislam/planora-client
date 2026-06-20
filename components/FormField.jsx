export default function FormField({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        {...props}
        className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink ${
          error ? "border-coral" : "border-ink/15"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-coral">{error}</span>}
    </label>
  );
}

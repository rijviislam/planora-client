import Link from "next/link";

const categories = [
  { label: "Public · Free", visibility: "PUBLIC", feeType: "FREE", color: "moss" },
  { label: "Public · Paid", visibility: "PUBLIC", feeType: "PAID", color: "gold" },
  { label: "Private · Free", visibility: "PRIVATE", feeType: "FREE", color: "moss" },
  { label: "Private · Paid", visibility: "PRIVATE", feeType: "PAID", color: "gold" },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
      <p className="stamp text-xs text-coral">Pick your gate</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
        Find events by category
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.label}
            href={`/events?visibility=${c.visibility}&feeType=${c.feeType}`}
            className="group flex flex-col gap-4 rounded-ticket border border-ink/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_30px_-18px_rgba(27,31,59,0.35)]"
          >
            <span
              className={`h-2 w-10 rounded-full ${
                c.color === "moss" ? "bg-moss" : "bg-gold"
              }`}
            />
            <p className="font-display text-lg font-semibold text-ink">{c.label}</p>
            <span className="text-sm text-ink-soft group-hover:text-coral">
              Browse →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

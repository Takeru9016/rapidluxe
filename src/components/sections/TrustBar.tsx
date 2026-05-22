import { Luggage, Star, ShieldCheck, Headphones, LucideIcon } from "lucide-react";

interface Stat {
  icon: LucideIcon;
  number: string;
  label: string;
}

const stats: Stat[] = [
  { icon: Luggage, number: "10,000+", label: "Happy Travellers" },
  { icon: Star, number: "4.8★", label: "Average Rating" },
  { icon: ShieldCheck, number: "100%", label: "Money-Back Guarantee" },
  { icon: Headphones, number: "24/7", label: "Expert Support" },
];

export function TrustBar() {
  return (
    <section
      className="border-y py-8"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-navy-surface) 60%, transparent)",
        borderColor: "var(--color-navy-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex overflow-x-auto gap-8 pb-2 md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col md:flex-row items-center gap-3 shrink-0"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "color-mix(in srgb, var(--color-gold) 10%, transparent)" }}
                >
                  <Icon size={20} style={{ color: "var(--color-gold)" }} />
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span
                    className="font-mono text-xl font-bold"
                    style={{ color: "var(--color-gold)" }}
                  >
                    {stat.number}
                  </span>
                  <span
                    className="font-(family-name:--font-body) text-sm"
                    style={{ color: "var(--color-white-muted)" }}
                  >
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

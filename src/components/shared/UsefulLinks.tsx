const LINKS = [
  {
    name: "Niyo Global Card",
    desc: "Zero forex markup card for international travel",
    url: "https://niyo.co",
  },
  {
    name: "Scapia Credit Card",
    desc: "Travel credit card with zero forex fees",
    url: "https://scapia.in",
  },
  {
    name: "Visa2Fly",
    desc: "Visa assistance and application service",
    url: "https://visa2fly.com",
  },
  {
    name: "Airalo eSIM",
    desc: "International eSIM for seamless connectivity",
    url: "https://airalo.com",
  },
];

export function UsefulLinks() {
  return (
    <section className="py-12 border-t border-(--color-navy-border)">
      <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
        Travel Essentials for Indian Travelers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LINKS.map((link) => (
          <div
            key={link.name}
            className="bg-(--color-navy-surface) rounded-xl p-4 border border-(--color-navy-border) hover:border-(--color-gold)/30 transition-colors flex flex-col gap-3"
          >
            <div>
              <p className="font-sans font-medium text-white mb-1">
                {link.name}
              </p>
              <p className="font-sans text-xs text-(--color-white-muted)">
                {link.desc}
              </p>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-(--color-gold) hover:text-(--color-gold-light) transition-colors border border-(--color-gold)/30 hover:border-(--color-gold)/60 rounded-lg px-3 py-2 text-center mt-auto"
            >
              Visit →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

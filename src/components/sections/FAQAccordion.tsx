import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What happens after I submit a booking request?",
    answer:
      "Once you submit a request, our travel experts review your details and reach out within 2 hours via WhatsApp to confirm availability, answer any questions, and provide your personalised quote.",
  },
  {
    question: "How does the quote and payment process work?",
    answer:
      "After our team confirms availability and you're happy with the quote, we send you a secure payment link. You complete payment at your convenience — no need to call or visit an office. We accept UPI, credit/debit cards, EMI, and net banking.",
  },
  {
    question: "Can I make changes to my itinerary after booking?",
    answer:
      "Yes, minor changes like meal preferences or optional add-ons can usually be accommodated. Significant changes (dates, destination) depend on availability and may have associated fees. Contact your dedicated travel expert to discuss.",
  },
  {
    question: "How is RapidLuxe different from booking websites or travel agents?",
    answer:
      "Unlike booking websites, we provide human expertise and genuine curation — every package is handpicked and vetted. Unlike traditional agents, our process is fully digital and transparent. You get the best of both: expert guidance without the friction.",
  },
  {
    question: "What kind of support do I get before and during my trip?",
    answer:
      "You have a dedicated travel expert available via WhatsApp from the moment you book until you return. We assist with any on-trip issues, last-minute changes, and local recommendations. You're never on your own.",
  },
];

export function FAQAccordion() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-gold)" }}
          >
            FAQ
          </p>
          <h2
            className="text-4xl text-white mt-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Still have questions?
          </h2>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full border-t border-(--color-navy-border)">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-b-(--color-navy-border) transition-all duration-200 data-[state=open]:border-l-2 data-[state=open]:border-l-(--color-gold) data-[state=open]:pl-4"
            >
              <AccordionTrigger
                className="py-5 text-base font-medium text-white hover:text-(--color-gold) hover:no-underline **:data-[slot=accordion-trigger-icon]:text-(--color-gold)"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                className="pb-5 pt-0 text-sm leading-relaxed text-(--color-white-muted)"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

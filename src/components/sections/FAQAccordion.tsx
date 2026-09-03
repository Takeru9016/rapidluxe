import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqCategory } from "@/types/faq";

export function FAQAccordion({ categories }: { categories: FaqCategory[] }) {
  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <div key={category.title}>
          <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl text-(--color-white) font-light mb-4">
            {category.title}
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full border-t border-(--color-navy-border)"
          >
            {category.items.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`${category.title}-${index}`}
                className="border-b border-b-(--color-navy-border) transition-all duration-200 data-[state=open]:border-l-2 data-[state=open]:border-l-(--color-gold) data-[state=open]:pl-4"
              >
                <AccordionTrigger className="py-5 font-sans text-base font-medium text-(--color-white) hover:text-(--color-gold) hover:no-underline **:data-[slot=accordion-trigger-icon]:text-(--color-gold)">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pt-0 font-sans text-sm leading-relaxed text-(--color-white-muted)">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}

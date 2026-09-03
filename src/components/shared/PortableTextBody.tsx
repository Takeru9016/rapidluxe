import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import Image from "next/image";

import { urlFor } from "@/lib/sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-sans text-lg text-(--color-white-muted) leading-relaxed">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl text-(--color-white) mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-['Cormorant_Garamond'] text-xl md:text-2xl text-(--color-white) mt-8 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-(--color-gold) pl-5 my-6 font-['Cormorant_Garamond'] text-xl text-(--color-gold-light) italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = (value?.href as string) ?? "#";
      const external = !href.startsWith("/");
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-(--color-gold) underline underline-offset-2 hover:text-(--color-gold-light) transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 font-sans text-lg text-(--color-white-muted) leading-relaxed my-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 font-sans text-lg text-(--color-white-muted) leading-relaxed my-4">
        {children}
      </ol>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8 rounded-xl overflow-hidden border border-(--color-navy-border)">
          <Image
            src={urlFor(value).width(1200).fit("max").url()}
            alt={(value.alt as string) ?? ""}
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
          />
        </figure>
      );
    },
  },
};

export function PortableTextBody({
  value,
  className,
}: {
  value: PortableTextBlock[];
  className?: string;
}) {
  if (!value?.length) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}

import type { PortableTextBlock } from "@portabletext/react";

export interface StaticPageSeo {
  metaTitle?: string;
  metaDescription?: string;
}

export interface StaticPageData {
  title: string;
  subtitle?: string;
  body: PortableTextBlock[];
  seo?: StaticPageSeo;
  lastUpdated?: string;
}

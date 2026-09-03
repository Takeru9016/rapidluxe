export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export interface FaqPageSeo {
  metaTitle?: string;
  metaDescription?: string;
}

export interface FaqPageData {
  title?: string;
  subtitle?: string;
  categories?: FaqCategory[];
  seo?: FaqPageSeo;
}

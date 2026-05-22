"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, CalendarDays, ArrowRight } from "lucide-react";

import { dummyBlogPosts, type BlogPost } from "@/lib/dummy/blog";
import { formatDate } from "@/lib/utils";

import { Badge } from "@/components/shared/Badge";

// Phase 2E: replace with <PortableText> from Sanity

function splitBody(body: string): string[] {
  const sentences = body.split(". ");
  const chunkSize = Math.ceil(sentences.length / 4);
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += chunkSize) {
    chunks.push(sentences.slice(i, i + chunkSize).join(". ").trim() + ".");
  }
  return chunks;
}

const SECTION_HEADINGS: Record<string, string[]> = {
  "blog-001": ["Getting There & First Steps", "Culture, Food & Money", "The Mindset Shift"],
  "blog-002": ["The Case for Maldives", "The Case for Bali", "Making the Choice"],
  "blog-003": ["Before You Book Anything", "Visas, Finance & Legal Bits", "On the Ground"],
  "blog-004": ["The Numbers Behind the Shift", "Who These Travellers Are", "What They Demand"],
};

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="rounded-xl overflow-hidden bg-(--color-navy-surface) border border-(--color-navy-border) hover:border-(--color-gold)/30 hover:-translate-y-1 transition-all duration-200">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="gold" size="sm">{post.category}</Badge>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-['Cormorant_Garamond'] text-lg text-white line-clamp-2 group-hover:text-(--color-gold-light) transition-colors">
            {post.title}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-xs font-sans text-(--color-text-secondary)">
            <Clock size={11} className="shrink-0" />
            <span>{post.readTime} min read</span>
            <span aria-hidden>·</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = dummyBlogPosts.find((p) => p.slug === slug) ?? dummyBlogPosts[0];
  const paragraphs = splitBody(post.body);
  const headings = SECTION_HEADINGS[post.id] ?? ["Key Insights", "Going Deeper", "Final Thoughts"];
  const related = dummyBlogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-(--color-navy)">
      {/* Hero */}
      <div className="relative w-full aspect-21/9 overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-(--color-navy) via-(--color-navy)/30 to-transparent" />
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="gold" size="sm">{post.category}</Badge>
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="ghost" size="sm">{tag}</Badge>
          ))}
        </div>
        <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white font-light leading-tight">
          {post.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-sans text-(--color-text-secondary)">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
              <Image src={post.authorAvatarUrl} alt={post.author} fill className="object-cover" sizes="32px" />
            </div>
            <span className="text-(--color-white-muted)">{post.author}</span>
          </div>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} className="shrink-0" />
            {formatDate(post.publishedAt)}
          </span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="shrink-0" />
            {post.readTime} min read
          </span>
        </div>
      </div>

      {/* Body */}
      {/* Phase 2E: replace with <PortableText> from Sanity */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <p className="font-sans text-lg text-(--color-white-muted) leading-relaxed">
          {paragraphs[0]}
        </p>

        {paragraphs.slice(1).map((para, i) => (
          <div key={i}>
            {headings[i] && (
              <h2 className="font-['Cormorant_Garamond'] text-2xl text-white mt-10 mb-4">
                {headings[i]}
              </h2>
            )}
            <p className="font-sans text-lg text-(--color-white-muted) leading-relaxed">
              {para}
            </p>
          </div>
        ))}
      </div>

      {/* Author card */}
      <div className="max-w-3xl mx-auto px-4 mt-12">
        <div className="flex items-center gap-4 p-6 rounded-xl border border-(--color-navy-border) bg-(--color-navy-surface)">
          <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0">
            <Image src={post.authorAvatarUrl} alt={post.author} fill className="object-cover" sizes="64px" />
          </div>
          <div>
            <p className="font-['Cormorant_Garamond'] text-xl text-white">{post.author}</p>
            <p className="font-sans text-xs text-(--color-gold) uppercase tracking-widest mt-0.5">
              Travel Writer
            </p>
            <p className="font-sans text-sm text-(--color-text-secondary) mt-2 leading-relaxed">
              A seasoned travel writer covering luxury and adventure destinations across Asia, Europe, and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Related articles */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pb-8">
        <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((p) => (
            <RelatedCard key={p.id} post={p} />
          ))}
        </div>
      </div>

      {/* CTA banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pb-20">
        <div className="bg-(--color-gold)/10 border border-(--color-gold)/20 rounded-xl p-8 text-center">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-3">
            Ready to travel?
          </h2>
          <p className="font-sans text-(--color-white-muted) text-sm mb-6">
            Explore our curated luxury packages and start planning your next journey.
          </p>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 bg-(--color-coral) text-white font-sans font-medium px-8 py-3 rounded-lg hover:bg-(--color-coral)/90 transition-colors"
          >
            Browse Packages <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}

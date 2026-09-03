"use client";

import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import type { BlogCardData } from "@/types/blog";

const CATEGORIES = [
  "All",
  "Travel Tips",
  "Destination Guide",
  "Honeymoon",
  "Adventure",
] as const;

function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="rounded-xl overflow-hidden bg-(--color-navy-surface) border border-(--color-navy-border) hover:border-(--color-gold)/30 hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
        <div className="aspect-video relative overflow-hidden shrink-0">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {post.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="gold" size="sm">
                {post.category}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-['Cormorant_Garamond'] text-xl text-(--color-white) line-clamp-2 group-hover:text-(--color-gold-light) transition-colors">
            {post.title}
          </h3>
          <p className="font-sans text-sm mt-2 line-clamp-3 text-(--color-white-muted) flex-1">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs font-sans text-(--color-text-secondary)">
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 relative">
              <Image
                src={post.authorAvatarUrl}
                alt={post.author}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span>{post.author}</span>
            {post.publishedAt && (
              <>
                <span aria-hidden>·</span>
                <span>{formatDate(post.publishedAt)}</span>
              </>
            )}
            {post.readTime != null && (
              <>
                <span aria-hidden>·</span>
                <Clock size={11} className="shrink-0" />
                <span>{post.readTime} min</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

function JournalNewsletterStrip() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-(--color-navy-surface) border-y border-(--color-navy-border) py-16">
      <div className="text-center max-w-xl mx-auto px-4">
        <p className="font-sans text-xs uppercase tracking-widest text-(--color-gold)">
          STAY INFORMED
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-4xl text-white mt-2">
          New Stories, Delivered.
        </h2>
        <p className="font-sans text-(--color-white-muted) mt-4">
          Subscribe to hear when we publish a new Journal story.
        </p>

        {submitted ? (
          <p className="mt-8 text-(--color-gold) font-sans">
            ✓ You&apos;re on the list!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex gap-3 max-w-sm mx-auto"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-(--color-navy) border border-(--color-navy-border) focus:border-(--color-gold) text-white placeholder:text-(--color-text-secondary) rounded-lg px-4 h-10 flex-1"
            />
            <Button
              type="submit"
              variant="gold"
              disabled={submitting}
              className="h-10 px-6 font-sans font-medium"
            >
              Subscribe →
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

export function BlogList({ posts }: { posts: BlogCardData[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const featured = posts[0];
  const rest = posts.slice(1);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? rest
        : rest.filter((p) => p.category === activeCategory),
    [activeCategory, rest],
  );

  return (
    <main className="min-h-screen bg-(--color-navy)">
      {/* Page header */}
      <div className="border-b border-(--color-navy-border) py-12 text-center">
        <p className="font-sans text-sm tracking-widest uppercase text-(--color-gold) mb-2">
          From the Journal
        </p>
        <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-(--color-white) font-light">
          Travel Stories &amp; Guides
        </h1>
      </div>

      {!featured ? (
        <p className="text-center font-sans text-(--color-text-secondary) py-24">
          No stories published yet. Check back soon.
        </p>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
          {/* Featured post */}
          <Link href={`/blog/${featured.slug}`} className="block group">
            <article className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-(--color-navy-border) hover:border-(--color-gold)/30 transition-colors bg-(--color-navy-surface)">
              <div className="relative aspect-video md:aspect-auto md:min-h-[360px] overflow-hidden">
                <Image
                  src={featured.imageUrl}
                  alt={featured.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-10 gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="coral" size="sm">
                    Featured
                  </Badge>
                  {featured.category && (
                    <Badge variant="gold" size="sm">
                      {featured.category}
                    </Badge>
                  )}
                </div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) leading-snug group-hover:text-(--color-gold-light) transition-colors">
                  {featured.title}
                </h2>
                <p className="font-sans text-(--color-white-muted) text-sm leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs font-sans text-(--color-text-secondary)">
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 relative">
                    <Image
                      src={featured.authorAvatarUrl}
                      alt={featured.author}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                  <span>{featured.author}</span>
                  {featured.publishedAt && (
                    <>
                      <span aria-hidden>·</span>
                      <span>{formatDate(featured.publishedAt)}</span>
                    </>
                  )}
                  {featured.readTime != null && (
                    <>
                      <span aria-hidden>·</span>
                      <Clock size={11} className="shrink-0" />
                      <span>{featured.readTime} min read</span>
                    </>
                  )}
                </div>
                <span className="inline-flex items-center gap-2 font-sans text-sm text-(--color-gold) font-medium mt-2">
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </article>
          </Link>

          {/* Category filter */}
          <div>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="bg-(--color-navy-surface) border border-(--color-navy-border) h-auto p-1 flex flex-wrap gap-1">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="font-sans text-sm data-[state=active]:bg-(--color-gold) data-[state=active]:text-[#1B2A41] text-(--color-text-secondary)"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center font-sans text-(--color-text-secondary) py-16">
              No posts in this category yet.
            </p>
          )}
        </div>
      )}

      <JournalNewsletterStrip />
    </main>
  );
}

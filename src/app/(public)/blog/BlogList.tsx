"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";

import type { BlogCardData } from "@/types/blog";
import { formatDate } from "@/lib/utils";

import { Badge } from "@/components/shared/Badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          <div className="absolute top-3 left-3">
            <Badge variant="gold" size="sm">
              {post.category}
            </Badge>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-['Cormorant_Garamond'] text-xl text-white line-clamp-2 group-hover:text-(--color-gold-light) transition-colors">
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
            <span aria-hidden>·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span aria-hidden>·</span>
            <Clock size={11} className="shrink-0" />
            <span>{post.readTime} min</span>
          </div>
        </div>
      </article>
    </Link>
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
        <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-white font-light">
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
                  <Badge variant="gold" size="sm">
                    {featured.category}
                  </Badge>
                </div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white leading-snug group-hover:text-(--color-gold-light) transition-colors">
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
                  <span aria-hidden>·</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span aria-hidden>·</span>
                  <Clock size={11} className="shrink-0" />
                  <span>{featured.readTime} min read</span>
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
                    className="font-sans text-sm data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) text-(--color-text-secondary)"
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
    </main>
  );
}

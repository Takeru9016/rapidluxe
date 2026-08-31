"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/ui/button";
import { type BlogPostPreview, useBlogPosts } from "@/hooks/api/useBlogPosts";
import { formatDate } from "@/lib/utils";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=80";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80";

function BlogCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-(--color-navy-surface) border border-(--color-navy-border) animate-pulse">
      <div className="aspect-video bg-(--color-navy-border)" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-(--color-navy-border) rounded w-2/3" />
        <div className="h-6 bg-(--color-navy-border) rounded" />
        <div className="h-4 bg-(--color-navy-border) rounded w-full" />
        <div className="h-4 bg-(--color-navy-border) rounded w-4/5" />
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPostPreview }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="rounded-xl overflow-hidden bg-(--color-navy-surface) border border-(--color-navy-border) hover:border-(--color-gold)/30 hover:-translate-y-1 transition-all duration-200">
        {/* Image */}
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={post.mainImageUrl ?? FALLBACK_IMAGE}
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

        {/* Content */}
        <div className="p-5">
          <h3 className="font-(family-name:--font-display) text-xl text-white mt-3 line-clamp-2 group-hover:text-(--color-gold-light) transition-colors">
            {post.title}
          </h3>
          <p
            className="font-sans text-sm mt-2 line-clamp-3"
            style={{ color: "var(--color-white-muted)" }}
          >
            {post.excerpt}
          </p>

          {/* Meta */}
          <div
            className="mt-4 flex items-center gap-3 text-xs font-sans"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 relative">
              <Image
                src={post.authorAvatarUrl ?? FALLBACK_AVATAR}
                alt={post.author ?? "Author"}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            {post.author && <span>{post.author}</span>}
            {post.publishedAt && (
              <>
                <span aria-hidden>·</span>
                <span>{formatDate(new Date(post.publishedAt))}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function BlogPreview() {
  const { data, isLoading } = useBlogPosts(3);
  const posts = data?.data ?? [];

  if (!isLoading && posts.length === 0) return null;

  return (
    <section className="py-20 md:py-32">
      {/* Header */}
      <div className="text-center mb-12 px-4">
        <p
          className="font-sans text-sm tracking-widest uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          From the Journal
        </p>
        <h2 className="font-(family-name:--font-display) text-4xl md:text-5xl text-white mt-2">
          Travel Stories &amp; Guides
        </h2>
        <p
          className="font-sans text-sm mt-3 max-w-md mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Expert tips, destination guides, and insider stories to inspire your
          next journey.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))
            : posts.map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      </div>

      {/* CTA */}
      {!isLoading && (
        <div className="mt-10 text-center">
          <Button variant="outline-gold" className="font-sans" asChild>
            <Link href="/blog">Read the Journal →</Link>
          </Button>
        </div>
      )}
    </section>
  );
}

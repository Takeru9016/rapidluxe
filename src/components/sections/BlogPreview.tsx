import Link from "next/link";
import Image from "next/image";

import { dummyBlogPosts } from "@/lib/dummy/blog";
import { formatDate } from "@/lib/utils";

import { Badge } from "@/components/shared/Badge";

function BlogCard({ post }: { post: (typeof dummyBlogPosts)[number] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article
        className="rounded-xl overflow-hidden bg-(--color-navy-surface) border border-(--color-navy-border) hover:border-(--color-gold)/30 hover:-translate-y-1 transition-all duration-200"
      >
        {/* Image */}
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

        {/* Content */}
        <div className="p-5">
          <h3
            className="font-(family-name:--font-display) text-xl text-white mt-3 line-clamp-2 group-hover:text-(--color-gold-light) transition-colors"
          >
            {post.title}
          </h3>
          <p
            className="font-(family-name:--font-body) text-sm mt-2 line-clamp-3"
            style={{ color: "var(--color-white-muted)" }}
          >
            {post.excerpt}
          </p>

          {/* Meta */}
          <div
            className="mt-4 flex items-center gap-3 text-xs font-(family-name:--font-body)"
            style={{ color: "var(--color-text-secondary)" }}
          >
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
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function BlogPreview() {
  const posts = dummyBlogPosts.slice(0, 3);

  return (
    <section className="py-20 md:py-32">
      {/* Header */}
      <div className="text-center mb-12 px-4">
        <p
          className="font-(family-name:--font-body) text-sm tracking-widest uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          From the Journal
        </p>
        <h2
          className="font-(family-name:--font-display) text-4xl md:text-5xl text-white mt-2"
        >
          Travel Stories &amp; Guides
        </h2>
        <p
          className="font-(family-name:--font-body) text-sm mt-3 max-w-md mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Expert tips, destination guides, and insider stories to inspire your next journey.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link href="/blog">
          <span
            className="inline-block font-(family-name:--font-body) font-medium text-sm px-8 py-3 rounded-lg transition-colors"
            style={{
              border: "1px solid var(--color-gold)",
              color: "var(--color-gold)",
            }}
          >
            Read More on the Blog →
          </span>
        </Link>
      </div>
    </section>
  );
}

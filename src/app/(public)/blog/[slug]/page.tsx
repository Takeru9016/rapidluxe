import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/shared/Badge";
import { PortableTextBody } from "@/components/shared/PortableTextBody";
import { Button } from "@/components/ui/button";
import {
  BLOG_FALLBACK_AVATAR,
  BLOG_FALLBACK_IMAGE,
  toBlogCard,
} from "@/lib/blog";
import { POST_BY_SLUG_QUERY, RELATED_POSTS_QUERY } from "@/lib/queries/blog";
import { sanityReadClient } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import type { BlogCardData, PostDetail, PostListItem } from "@/types/blog";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityReadClient.fetch<PostDetail | null>(
    POST_BY_SLUG_QUERY,
    { slug },
  );

  if (!post) return { title: "Post Not Found" };

  const image = post.mainImage?.asset?.url;
  const title = post.seo?.metaTitle ?? post.title;
  const description = post.seo?.metaDescription ?? post.excerpt ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

function RelatedCard({ post }: { post: BlogCardData }) {
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
          {post.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="gold" size="sm">
                {post.category}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-['Cormorant_Garamond'] text-lg text-(--color-white) line-clamp-2 group-hover:text-(--color-gold-light) transition-colors">
            {post.title}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-xs font-sans text-(--color-text-secondary)">
            {post.readTime != null && (
              <>
                <Clock size={11} className="shrink-0" />
                <span>{post.readTime} min read</span>
              </>
            )}
            {post.publishedAt && (
              <>
                <span aria-hidden>·</span>
                <span>{formatDate(post.publishedAt)}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, relatedRaw] = await Promise.all([
    sanityReadClient.fetch<PostDetail | null>(POST_BY_SLUG_QUERY, { slug }),
    sanityReadClient.fetch<PostListItem[]>(RELATED_POSTS_QUERY, { slug }),
  ]);

  if (!post) notFound();

  const heroImage = post.mainImage?.asset?.url ?? BLOG_FALLBACK_IMAGE;
  const authorName = post.author?.name ?? "RapidLuxe";
  const authorAvatar = post.author?.image?.asset?.url ?? BLOG_FALLBACK_AVATAR;
  const related = (relatedRaw ?? []).map(toBlogCard);

  return (
    <main className="min-h-screen bg-(--color-navy)">
      {/* Hero */}
      <div className="relative w-full aspect-21/9 overflow-hidden">
        <Image
          src={heroImage}
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
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-2 text-sm font-sans text-(--color-text-secondary)">
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                Journal
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-(--color-white)">
              {post.title}
            </li>
          </ol>
        </nav>
        <div className="flex items-center gap-3 mb-4">
          {post.category?.title && (
            <Badge variant="gold" size="sm">
              {post.category.title}
            </Badge>
          )}
          {(post.tags ?? []).slice(0, 2).map((tag) => (
            <Badge key={tag} variant="ghost" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-(--color-white) font-light leading-tight">
          {post.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-sans text-(--color-text-secondary)">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
              <Image
                src={authorAvatar}
                alt={authorName}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="text-(--color-white-muted)">{authorName}</span>
          </div>
          {post.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} className="shrink-0" />
                {formatDate(post.publishedAt)}
              </span>
            </>
          )}
          {post.readTime != null && (
            <>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="shrink-0" />
                {post.readTime} min read
              </span>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        {post.excerpt && (
          <p className="font-sans text-lg text-(--color-white-muted) leading-relaxed mb-6 italic">
            {post.excerpt}
          </p>
        )}
        <div className="space-y-5">
          <PortableTextBody value={post.body ?? []} />
        </div>
      </div>

      {/* Author card */}
      <div className="max-w-3xl mx-auto px-4 mt-12">
        <div className="flex items-center gap-4 p-6 rounded-xl border border-(--color-navy-border) bg-(--color-navy-surface)">
          <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0">
            <Image
              src={authorAvatar}
              alt={authorName}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <p className="font-['Cormorant_Garamond'] text-xl text-(--color-white)">
              {authorName}
            </p>
            {post.author?.role && (
              <p className="font-sans text-xs text-(--color-gold) uppercase tracking-widest mt-0.5">
                {post.author.role}
              </p>
            )}
            {post.author?.bio && (
              <p className="font-sans text-sm text-(--color-text-secondary) mt-2 leading-relaxed">
                {post.author.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pb-8">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) mb-8">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <RelatedCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}

      {/* CTA banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pb-20">
        <div className="bg-(--color-gold)/10 border border-(--color-gold)/20 rounded-xl p-8 text-center">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) mb-3">
            Ready to travel?
          </h2>
          <p className="font-sans text-(--color-white-muted) text-sm mb-6">
            Explore our curated luxury packages and start planning your next
            journey.
          </p>
          <Button
            variant="coral"
            className="h-auto gap-2 px-8 py-3 font-sans"
            asChild
          >
            <Link href="/packages">
              Explore Journeys <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

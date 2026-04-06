'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Calendar, User, Eye, ArrowLeft, Tag } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug);
      setMounted(true);
    });
  }, [params]);

  const { data: blog, isLoading } = useSWR(
    slug ? `/api/blogs/${slug}` : null,
    fetcher
  );

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog you're looking for doesn't exist.</p>
          <Link href="/blogs" className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
            <ArrowLeft size={20} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} /> Back to Blogs
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full capitalize">
              {blog.category}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Eye size={16} /> {blog.views} views
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {blog.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{blog.author?.name || blog.author || 'demo-user'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {(blog.imageUrl || blog.featuredImage) && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg h-96 bg-muted">
            <img
              src={blog.imageUrl || blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <article className="bg-card rounded-xl p-8 mb-8 border border-border shadow-lg">
          <div className="prose prose-invert max-w-none">
            <div
              className="text-foreground leading-relaxed whitespace-pre-wrap space-y-4"
              dangerouslySetInnerHTML={{ __html: blog.content || blog.description || '' }}
            />
          </div>
        </article>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Tag size={20} /> Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {blog.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-primary/10 text-primary text-sm rounded-lg border border-primary/20 hover:border-primary transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Card */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-primary-foreground">
          <h3 className="text-xl font-bold mb-2">About the Author</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20"></div>
            <div>
              <p className="font-bold text-lg">{blog.author?.name || blog.author || 'demo-user'}</p>
              <p className="text-primary-foreground/80">Senior Technical Author</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
    
'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Calendar, User, Eye, ArrowLeft, Tag, Download } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ManualDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug);
      setMounted(true);
    });
  }, [params]);

  const { data: manual, isLoading } = useSWR(
    slug ? `/api/manuals/${slug}` : null,
    fetcher
  );

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading manual...</p>
        </div>
      </div>
    );
  }

  if (!manual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Manual Not Found</h1>
          <p className="text-muted-foreground mb-6">The manual you're looking for doesn't exist.</p>
          <Link href="/manuals" className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
            <ArrowLeft size={20} /> Back to Manuals
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
          href="/manuals"
          className="inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} /> Back to Manuals
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
              {manual.category}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Eye size={16} /> {manual.views} views
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {manual.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{manual.author?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(manual.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="bg-card rounded-xl p-8 mb-8 border border-border shadow-lg">
          <div className="prose prose-invert max-w-none">
            <div
              className="text-foreground leading-relaxed whitespace-pre-wrap space-y-4"
              dangerouslySetInnerHTML={{ __html: manual.content }}
            />
          </div>
        </article>

        {/* Download Section */}
        {manual.documentUrl && (
          <div className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Download Documentation</h3>
                <p className="text-sm text-muted-foreground">Get the complete PDF guide for offline access</p>
              </div>
              <a
                href={manual.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
              >
                <Download size={20} /> Download PDF
              </a>
            </div>
          </div>
        )}

        {/* Tags */}
        {manual.tags && manual.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Tag size={20} /> Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {manual.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-accent/10 text-accent text-sm rounded-lg border border-accent/20 hover:border-accent transition-colors cursor-pointer"
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
              <p className="font-bold text-lg">{manual.author?.name}</p>
              <p className="text-primary-foreground/80">Technical Documentation Specialist</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}   
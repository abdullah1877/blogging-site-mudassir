'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FileText, BookOpen, LogOut, ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setMounted(true);
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary font-semibold mb-6 hover:gap-3 transition-all"
          >
            <ArrowLeft size={20} /> Back to Website
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/');
              }}
              className="px-4 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Create Blog */}
          <Link
            href="/dashboard/create-blog"
            className="group bg-gradient-to-br from-primary to-accent rounded-xl p-8 text-primary-foreground hover:shadow-lg transition-all border border-primary/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <Plus size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Create New Blog</h2>
            <p className="text-primary-foreground/80">Write and publish technical articles</p>
          </Link>

          {/* Create Manual */}
          <Link
            href="/dashboard/create-manual"
            className="group bg-gradient-to-br from-accent to-primary rounded-xl p-8 text-primary-foreground hover:shadow-lg transition-all border border-accent/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <Plus size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Create New Manual</h2>
            <p className="text-primary-foreground/80">Publish guides and documentation</p>
          </Link>
        </div>

        {/* Content Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manage Blogs */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="text-primary" size={24} /> Your Blogs
              </h2>
              <Link
                href="/dashboard/blogs"
                className="text-primary font-semibold text-sm hover:underline"
              >
                View All
              </Link>
            </div>
            <p className="text-muted-foreground mb-6">
              Manage all your published blogs, edit drafts, and view statistics.
            </p>
            <Link
              href="/dashboard/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Manage Blogs
            </Link>
          </div>

          {/* Manage Manuals */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText className="text-accent" size={24} /> Your Manuals
              </h2>
              <Link
                href="/dashboard/manuals"
                className="text-primary font-semibold text-sm hover:underline"
              >
                View All
              </Link>
            </div>
            <p className="text-muted-foreground mb-6">
              Manage all your published manuals, update documentation, and track engagement.
            </p>
            <Link
              href="/dashboard/manuals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Manage Manuals
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-card rounded-xl p-8 border border-border shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Tips</h2>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="font-semibold text-foreground mb-2">📝 SEO-Friendly Content</p>
              <p className="text-sm text-muted-foreground">
                Use descriptive titles and excerpts to improve visibility on search engines.
              </p>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <p className="font-semibold text-foreground mb-2">🏷️ Use Tags</p>
              <p className="text-sm text-muted-foreground">
                Add relevant tags to make your content more discoverable and organized.
              </p>
            </div>
            <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
              <p className="font-semibold text-foreground mb-2">📊 Monitor Views</p>
              <p className="text-sm text-muted-foreground">
                Track which content resonates most with your audience and plan accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

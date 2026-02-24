'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { ArrowLeft, Plus, Edit, Trash2, Eye } from 'lucide-react';
import axios from 'axios';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ManageManualsPage() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      router.push('/login');
      return;
    }
    setToken(authToken);
    setMounted(true);
  }, [router]);

  const { data, mutate, isLoading } = useSWR('/api/manuals?limit=50', fetcher);
  const manuals = data?.manuals || [];

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this manual?')) return;

    try {
      await axios.delete(`/api/manuals/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate();
    } catch (error) {
      alert('Failed to delete manual');
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Your Manuals</h1>
          <Link
            href="/dashboard/create-manual"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={20} /> Create New
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading manuals...
            </div>
          </div>
        )}

        {/* Manuals Table */}
        {!isLoading && manuals.length > 0 ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden lg:table-cell">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden sm:table-cell">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {manuals.map((manual: any) => (
                    <tr key={manual._id} className="border-b border-border hover:bg-background/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-semibold text-foreground truncate">{manual.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{manual.excerpt}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                        {manual.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <Eye size={16} /> {manual.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                        {new Date(manual.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/manuals/${manual.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/dashboard/edit-manual/${manual.slug}`}
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(manual.slug)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : !isLoading ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground mb-6">No manuals published yet.</p>
            <Link
              href="/dashboard/create-manual"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <Plus size={20} /> Create Your First Manual
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}

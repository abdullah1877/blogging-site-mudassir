'use client';

import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';
import { Search, Eye, ChevronDown, FileText } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ManualsPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  queryParams.append('page', page.toString());
  queryParams.append('limit', '9');

  const { data, isLoading } = useSWR(`/api/manuals?${queryParams}`, fetcher);

  const manuals = data?.manuals || [];
  const pagination = data?.pagination || {};

  const categories = ['Getting Started', 'API Documentation', 'Installation', 'Configuration', 'Best Practices'];

  const filteredManuals = manuals.filter((manual: any) =>
    manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manual.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Technical Manuals & Guides</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Explore comprehensive documentation and step-by-step guides for technical implementations.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search manuals..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
            />
          </div>

          {/* Category Filter */}
          <div className="md:w-56 relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full px-4 py-3 border border-border rounded-lg bg-card flex items-center justify-between hover:border-primary transition-colors"
            >
              <span className="text-sm">
                {category ? `Category: ${category}` : 'All Categories'}
              </span>
              <ChevronDown size={20} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setCategory('');
                    setIsFilterOpen(false);
                    setPage(1);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors text-sm border-b border-border last:border-b-0"
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setIsFilterOpen(false);
                      setPage(1);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors text-sm border-b border-border last:border-b-0"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
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

        {/* Manuals Grid */}
        {!isLoading && filteredManuals.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredManuals.map((manual: any) => (
                <Link
                  key={manual._id}
                  href={`/manuals/${manual.slug}`}
                  className="group bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all border border-border hover:border-primary hover:-translate-y-1 p-6"
                >
                  <div className="flex items-start gap-4 h-full flex-col">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                          {manual.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye size={14} />
                          {manual.views}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {manual.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {manual.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {manual.tags?.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="w-full pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span className="line-clamp-1">{manual.author?.name}</span>
                      <span>{new Date(manual.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === p
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border hover:bg-primary/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : !isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No manuals found. Try adjusting your filters.</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}

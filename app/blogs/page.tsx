'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Search, Eye, ChevronDown } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  queryParams.append('page', page.toString());
  queryParams.append('limit', '9');

  const { data, error, isLoading } = useSWR(`/api/blogs?${queryParams}`, fetcher);

  const blogs = data?.blogs || [];
  const pagination = data?.pagination || {};

  const categories = ['Cement Industry', 'Power Plant', 'Condition Monitoring' , 'Lubrication' , 'NDT'];

  const filteredBlogs = blogs.filter((blog: any) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Technical Blogs</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Discover in-depth articles on software development, best practices, and industry insights.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
            />
          </div>

          {/* Category Filter */}
          <div className="md:w-48 relative">
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
                    className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors text-sm border-b border-border last:border-b-0 capitalize"
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
              Loading blogs...
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        {!isLoading && filteredBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredBlogs.map((blog: any) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog.slug}`}
                  className="group bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all border border-border hover:border-primary hover:-translate-y-1"
                >
                  {blog.imageUrl && (
                    <div className="w-full h-48 relative overflow-hidden bg-muted">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full capitalize">
                        {blog.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye size={14} />
                        {blog.views}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags?.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                        <span className="text-xs font-medium text-muted-foreground line-clamp-1">
                          {blog.author?.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
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
            <p className="text-muted-foreground">No blogs found. Try adjusting your filters.</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}

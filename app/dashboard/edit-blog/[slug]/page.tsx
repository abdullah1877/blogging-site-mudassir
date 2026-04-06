'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function EditBlogPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Cement Industry',
    excerpt: '',
    content: '',
    tags: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setMounted(true);
  }, [router]);

  useEffect(() => {
    if (!slug || !mounted) return;

    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/blogs/${slug}`);
        const blog = response.data;

        setFormData({
          title: blog.title || '',
          category: blog.category || 'Cement Industry',
          excerpt: blog.excerpt || blog.description || '',
          content: blog.content || blog.description || '',
          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
          imageUrl: blog.imageUrl || blog.featuredImage || '',
        });
      } catch (err) {
        setError('Failed to load blog. It may not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug, mounted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.content || !formData.excerpt) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await axios.put(
        `/api/blogs/${slug}`,
        {
          title: formData.title,
          category: formData.category,
          content: formData.content,
          excerpt: formData.excerpt,
          tags: tagsArray,
          imageUrl: formData.imageUrl || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Blog updated successfully! Redirecting...');
      setTimeout(() => router.push('/dashboard/blogs'), 1200);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.error || 'Failed to update blog'
          : 'An error occurred'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8">Edit Blog</h1>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading blog details...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-600">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 text-green-600">
                <CheckCircle size={20} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border border-border shadow-lg space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-foreground mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="Cement Industry">Cement Industry</option>
                    <option value="Power Plant">Power Plant</option>
                    <option value="Condition Monitoring">Condition Monitoring</option>
                    <option value="Lubrication">Lubrication</option>
                    <option value="NDT">NDT</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-semibold text-foreground mb-2">
                    Featured Image URL
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-semibold text-foreground mb-2">
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary for list pages"
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-foreground mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your full blog content here"
                  required
                  rows={12}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use plain text or basic HTML. Line breaks will be preserved.
                </p>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-semibold text-foreground mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., NDT, Cement, Maintenance"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} /> Update Blog
                    </>
                  )}
                </button>
                <Link
                  href="/dashboard/blogs"
                  className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function CreateManualPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Getting Started',
    excerpt: '',
    content: '',
    tags: '',
    documentUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setMounted(true);
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await axios.post(
        '/api/manuals',
        {
          title: formData.title,
          category: formData.category,
          content: formData.content,
          excerpt: formData.excerpt,
          tags: tagsArray,
          documentUrl: formData.documentUrl || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Manual created successfully!');
      setTimeout(() => {
        router.push('/dashboard/manuals');
      }, 1500);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.error || 'Failed to create manual'
          : 'An error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        {/* Header */}
        <h1 className="text-4xl font-bold text-foreground mb-8">Create New Manual</h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 text-green-600">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border border-border shadow-lg space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
              Manual Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title for your manual"
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Category and Document URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
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
                <option value="Getting Started">Getting Started</option>
                <option value="API Documentation">API Documentation</option>
                <option value="Installation">Installation</option>
                <option value="Configuration">Configuration</option>
                <option value="Best Practices">Best Practices</option>
              </select>
            </div>

            {/* Document URL */}
            <div>
              <label htmlFor="documentUrl" className="block text-sm font-semibold text-foreground mb-2">
                PDF Document URL
              </label>
              <input
                type="url"
                id="documentUrl"
                name="documentUrl"
                value={formData.documentUrl}
                onChange={handleChange}
                placeholder="https://example.com/manual.pdf"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-semibold text-foreground mb-2">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of your manual"
              required
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-foreground mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your complete manual content here..."
              required
              rows={12}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Use basic HTML or plain text. Include installation steps, configuration, and usage examples.
            </p>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-foreground mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., Setup, Configuration, Troubleshooting"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save size={20} /> Publish Manual
                </>
              )}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

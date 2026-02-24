  'use client';

  import { useState } from 'react';
  import Link from 'next/link';
  import { useRouter } from 'next/navigation';
  import axios from 'axios';
  import { LogIn, AlertCircle } from 'lucide-react';

  export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const response = await axios.post('/api/auth/login', formData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/dashboard');
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.error || 'Login failed'
            : 'An error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
                <LogIn className="text-primary-foreground" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Login</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Access your dashboard to manage content
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-600">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@techblog.com"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} /> Login
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Link to Register */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Register here
              </Link>
            </p>

            {/* Demo Credentials */}
            {/* <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
              <p className="text-xs text-muted-foreground mb-1">Email: demo@techblog.com</p>
              <p className="text-xs text-muted-foreground">Password: Demo@123</p>
            </div> */}
          </div>
        </div>
      </main>
    );
  }

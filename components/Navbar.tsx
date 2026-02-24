'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
    setIsOpen(false);
  };

  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('token');

  const links = [
    { label: 'Home', href: '/' }, 
    { label: 'Technical Blogs', href: '/blogs' },
    { label: 'Technical Manuals', href: '/manuals' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="p-4 w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold">MR</span>
            </div>
            <span>Mudasir Rafiq</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-secondary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          {/* <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-primary-foreground text-primary rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border-2 border-primary-foreground rounded-lg font-medium hover:bg-primary-foreground hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <> */}
                {/* <Link
                  href="/login"
                  className="px-4 py-2 border-2 border-primary-foreground rounded-lg font-medium hover:bg-primary-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary-foreground text-primary rounded-lg font-medium hover:opacity-90 transition-opacity"
                > 
                  Register
                </Link> */}
              {/* </>
            )}
          </div> */}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-primary-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-primary-foreground/20">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-4 py-3 hover:bg-primary-foreground/10 font-medium rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="px-4 pt-3 border-t border-primary-foreground/20 flex flex-col gap-2 mt-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-primary-foreground text-primary rounded-lg font-medium text-center hover:opacity-90 transition-opacity"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border-2 border-primary-foreground rounded-lg font-medium hover:bg-primary-foreground hover:text-primary transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* <Link
                    href="/login"
                    className="px-4 py-2 border-2 border-primary-foreground rounded-lg font-medium text-center hover:bg-primary-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-primary-foreground text-primary rounded-lg font-medium text-center hover:opacity-90 transition-opacity"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link> */}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

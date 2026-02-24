import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-background font-bold">MR</span>
              </div>
              <span className="text-xl font-bold">Mudassir Rafiq</span>
            </div>
            <p className="text-sm opacity-80">
              Your ultimate destination for technical blogs, manuals, and expert engineering insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-primary transition-colors">Blogs</Link>
              </li>
              <li>
                <Link href="/manuals" className="hover:text-primary transition-colors">Manuals</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blogs" className="hover:text-primary transition-colors">Technical Articles</Link>
              </li>
              <li>
                <Link href="/manuals" className="hover:text-primary transition-colors">Documentation</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Get In Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span>mudassirrafiq056@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>0300 9492118</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-75">
          <p>&copy; 2024 TechBlog. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
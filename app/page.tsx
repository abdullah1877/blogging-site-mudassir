'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FileText, Zap, Globe, Cpu } from 'lucide-react';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: blogsData } = useSWR('/api/blogs?limit=3', fetcher);
  const { data: manualsData } = useSWR('/api/manuals?limit=3', fetcher);

  const blogs = blogsData?.blogs || [];
  const manuals = manualsData?.manuals || [];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              className="lg:col-span-7 space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Zap size={14} className="fill-current" />
                <span>Mudassir Rafiq Reliability Engineer</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Bridging the Gap <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Between Code & Theory
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Expert-led technical documentation and software engineering insights. We deconstruct complex systems into manageable learning paths.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/blogs"
                  className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Repository <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 border border-border bg-background/50 backdrop-blur-sm hover:bg-secondary/50 text-foreground rounded-full font-bold transition-all"
                >
                  Consultation
                </Link>
              </motion.div>

              {/* Trust Stats */}
              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
                <div>
                  <p className="text-3xl font-bold tracking-tighter">{blogs.length + 10}+</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Articles</p>
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tighter">{manuals.length + 5}+</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Blueprints</p>
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tighter">99.9%</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Accuracy</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Image with Decorative Elements */}
            <motion.div 
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative z-10 w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-border shadow-2xl">
                <Image
                  src="/mudassir.png"
                  alt="Lead Engineer"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <p className="text-2xl font-bold">Mudassir Rafiq</p>
                  <p className="text-primary font-medium">Reliability Engineer</p>
                </div>
              </div>
              
              {/* Floating Decorative Cards */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-xl -z-10 animate-pulse" />
              
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Section Label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-2">Knowledge Base</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Latest Technical Insights</h3>
          </div>
          <Link href="/blogs" className="text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors">
            BROWSE ALL <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Bento Grid Blogs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {blogs.map((blog: any, index: number) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${index === 0 ? 'md:col-span-8' : 'md:col-span-4'} group`}
            >
              <Link href={`/blogs/${blog.slug}`}>
                <div className="h-full relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
                        {blog.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                         <Globe size={12} /> {blog.views} reads
                      </span>
                    </div>
                    <h3 className={`${index === 0 ? 'text-3xl' : 'text-xl'} font-bold mb-4 group-hover:text-primary transition-colors`}>
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 mb-8 flex-grow">
                      {blog.excerpt || blog.description}
                    </p>
                    <div className="flex items-center gap-3 pt-6 border-t border-border/50">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent" />
                      <span className="text-sm font-medium">{blog.author?.name || 'Admin'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Manuals Section - Dark/Contrast */}
      <section className="bg-secondary/30 py-24 border-y border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5">
           <Cpu size={400} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-2">Documentation</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Standard Operating Procedures</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {manuals.map((manual: any) => (
              <Link key={manual._id} href={`/manuals/${manual.slug}`}>
                <div className="group bg-background border border-border p-1 rounded-[2rem] transition-all hover:scale-[1.02]">
                  <div className="p-8 rounded-[1.8rem] border border-transparent group-hover:border-primary/20 transition-all">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                      <FileText size={24} />
                    </div>
                    <h4 className="text-xl font-bold mb-2">{manual.title}</h4>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6">{manual.excerpt}</p>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Technical Manual</span>
                       <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Professional Footer Gradient */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] bg-foreground p-12 md:p-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent" />
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-background mb-6">
                Build your technical foundation today.
              </h2>
              <p className="text-background/70 text-lg mb-10">
                Join 10,000+ engineers who receive our monthly deep-dives into systems architecture and modern web standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform">
                  Subscribe to Newsletter ehccchf
                </button>
                <Link href="/manuals" className="px-8 py-4 bg-background/10 text-background border border-background/20 backdrop-blur-md rounded-full font-bold hover:bg-background/20 transition-all">
                  View Documentation
                </Link> 
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
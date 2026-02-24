'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await axios.post('/api/contact', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        axios.isAxiosError(error)
          ? error.response?.data?.error || 'Failed to send message'
          : 'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Get In Touch</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground">mudassirrafiq056@gmail.com</p>
              <p className="text-xs text-muted-foreground mt-2">We'll respond within 24 hours</p>
            </div>

            {/* Phone */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Phone</h3>
              <p className="text-muted-foreground">0300 9292118 </p>
              <p className="text-xs text-muted-foreground mt-2">Monday - Friday, 9AM - 6PM</p>
            </div>

            {/* Location */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Faislabad</h3>
              <p className="text-muted-foreground">Jarawala Streat 2 , FSD</p>
              <p className="text-muted-foreground">Pakistan</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-card rounded-xl p-8 border border-border shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-foreground mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 text-green-600">
                  <CheckCircle size={20} />
                  <span>Message sent successfully! We'll be in touch soon.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600">
                  <p className="font-semibold">Error sending message</p>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 border border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-foreground mb-2">How quickly will I receive a response?</p>
              <p className="text-muted-foreground text-sm">
                We aim to respond to all inquiries within 24 hours during business days (Monday-Friday).
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2">Can I contribute content?</p>
              <p className="text-muted-foreground text-sm">
                Yes! We welcome guest contributions. Reach out to discuss potential collaboration opportunities.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2">Do you offer consulting services?</p>
              <p className="text-muted-foreground text-sm">
                Contact us to discuss your specific needs. We may be able to assist with technical consulting.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2">How can I report an issue?</p>
              <p className="text-muted-foreground text-sm">
                Use the contact form or email us directly. Include details about the issue for faster resolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

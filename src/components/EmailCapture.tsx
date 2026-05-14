'use client';

import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // TODO: Replace with your email service API call (ConvertKit, Mailchimp, etc.)
    // Example: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    await new Promise((r) => setTimeout(r, 700));
    setStatus('success');
  };

  return (
    <section className="rounded-2xl bg-gradient-primary p-8 text-white shadow-card">
      <div className="mx-auto max-w-xl text-center">
        <EnvelopeIcon className="mx-auto mb-3 h-10 w-10 text-blue-200" />
        <h2 className="text-2xl font-bold">Stay ahead of your FIRE journey</h2>
        <p className="mt-2 text-sm text-blue-100">
          Get tips, calculator updates, and FIRE strategies delivered to your inbox. No spam, ever.
        </p>
        {status === 'success' ? (
          <p className="mt-6 rounded-xl bg-white/20 px-6 py-4 text-sm font-semibold">
            You&apos;re in! Check your inbox for a confirmation email.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 rounded-lg border-0 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition hover:bg-blue-50 disabled:opacity-70"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe Free'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-3 text-xs text-red-200">Something went wrong. Please try again.</p>
        )}
        <p className="mt-3 text-xs text-blue-200">Unsubscribe anytime. We respect your privacy.</p>
      </div>
    </section>
  );
}

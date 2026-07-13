'use client';

import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/brand';
import clsx from 'clsx';

type Props = {
  message?: string;
  label?: string;
  className?: string;
  variant?: 'primary' | 'floating' | 'inline' | 'panel';
};

export function WhatsAppButton({
  message,
  label = 'Cotizar por WhatsApp',
  className,
  variant = 'primary',
}: Props) {
  const href = whatsappUrl(message);

  if (variant === 'floating') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full',
          'bg-[#25D366] text-white shadow-lg shadow-green-900/30 transition hover:scale-105 hover:bg-[#20bd5a]',
          'md:bottom-8',
          className,
        )}
        aria-label={label}
        title={label}
      >
        <MessageCircle className="h-7 w-7" fill="currentColor" />
      </a>
    );
  }

  if (variant === 'panel') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200',
          'bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100',
          className,
        )}
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>
    );
  }

  if (variant === 'inline') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline',
          className,
        )}
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5',
        'text-sm font-semibold text-white transition hover:bg-[#20bd5a]',
        className,
      )}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Suspense } from 'react';

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone || undefined,
        });
      }
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-brand-blue/50 bg-white shadow-glow-blue ring-2 ring-brand-accent/40">
          <Image
            src="/logo-hq.jpg"
            alt="MG Mundo Turístico"
            width={160}
            height={160}
            className="h-full w-full object-cover"
            priority
            quality={95}
          />
        </div>
        <h1 className="font-display text-2xl font-bold">
          {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
        </h1>
        <p className="mt-2 text-sm text-white/50">
          <span className="text-brand-sky font-semibold">MG</span> Mundo Turístico — Viajes y Turismo
        </p>
      </div>

      <form onSubmit={onSubmit} className="glass space-y-4 rounded-3xl p-6 md:p-8">
        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Nombre</label>
              <input
                required
                className="input-field"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              />
            </div>
            <div>
              <label className="label-field">Apellido</label>
              <input
                required
                className="input-field"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              />
            </div>
          </div>
        )}

        <div>
          <label className="label-field">Correo</label>
          <input
            type="email"
            required
            className="input-field"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label className="label-field">Contraseña</label>
          <input
            type="password"
            required
            minLength={8}
            className="input-field"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder={mode === 'register' ? 'Mín. 8, mayúscula y número' : '••••••••'}
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className="label-field">Teléfono (opcional)</label>
            <input
              className="input-field"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+58 414..."
            />
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : mode === 'login' ? (
            'Ingresar'
          ) : (
            'Registrarme'
          )}
        </button>

        <p className="text-center text-sm text-white/50">
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            className="font-medium text-brand-accent hover:underline"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>

        <p className="text-center text-[11px] text-white/35">
          Demo: cliente@demo.com / Cliente123!
        </p>
        <p className="text-center text-[10px] text-white/30">
          Al continuar aceptas los{' '}
          <Link href="/legal/terminos" className="text-brand-accent hover:underline">
            términos
          </Link>{' '}
          y la{' '}
          <Link href="/legal/privacidad" className="text-brand-accent hover:underline">
            privacidad
          </Link>
          .
        </p>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href="/" className="text-white/50 hover:text-white">
          ← Volver al planeta
        </Link>
      </p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-28 stars">
      <Suspense fallback={<div className="text-white/50">Cargando…</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}

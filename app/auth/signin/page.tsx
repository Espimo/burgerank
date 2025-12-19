'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SigninPage() {
  const router = useRouter();
  const { signin: authSignin, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authSignin(formData.email, formData.password);
      setMessage('✅ Sesión iniciada exitosamente');
      setTimeout(() => {
        router.push('/ranking');
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 backdrop-blur">
          <h1 className="text-3xl font-bold text-amber-400 mb-2 text-center">🍔 BurgeRank</h1>
          <h2 className="text-xl text-gray-300 mb-6 text-center">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded text-green-400">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-900 font-bold rounded-lg transition-colors"
            >
              {loading || authLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/signup" className="text-amber-400 hover:text-amber-300">
                Regístrate aquí
              </Link>
            </p>
            <p>
              <Link href="/auth/reset-password" className="text-sm text-gray-400 hover:text-amber-400">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              Para desarrolladores: usa cualquier email y contraseña (mín. 8 caracteres)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

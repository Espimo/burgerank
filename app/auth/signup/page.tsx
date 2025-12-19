'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup: authSignup, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
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
      await authSignup(formData.email, formData.password, formData.username);
      setMessage('✅ Cuenta creada exitosamente. Redirigiendo...');
      setTimeout(() => {
        router.push('/auth/verify-email');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrarse';
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
          <h2 className="text-xl text-gray-300 mb-6 text-center">Crear Cuenta</h2>

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
                Usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="usuario123"
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 disabled:opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">3-20 caracteres, sin espacios</p>
            </div>

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
              <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-900 font-bold rounded-lg transition-colors"
            >
              {loading || authLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/signin" className="text-amber-400 hover:text-amber-300">
                Inicia sesión
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              Al registrarte, aceptas nuestros términos de servicio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

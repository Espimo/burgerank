'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function VerifyEmailContent() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Supabase automáticamente valida el token en la URL
        // y actualiza email_confirmed_at
        const supabase = createClient();
        
        // Esperar un poco para que Supabase procese
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar si el usuario está confirmado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (user?.email_confirmed_at) {
          setVerified(true);
          setMessage('✅ Email verificado exitosamente');
          setTimeout(() => {
            router.push('/auth/signin');
          }, 2000);
        } else {
          setMessage('Verifica tu email haciendo clic en el enlace que te enviamos');
        }
      } catch (err) {
        setError('Error al verificar email');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 backdrop-blur text-center">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">🍔 BurgeRank</h1>
          <h2 className="text-xl text-gray-300 mb-6">Verificar Email</h2>

          {loading ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="animate-spin">
                  <div className="text-4xl">📧</div>
                </div>
              </div>
              <p className="text-gray-400">Verificando tu email...</p>
            </div>
          ) : verified ? (
            <div className="space-y-4">
              <p className="text-2xl">✅</p>
              <p className="text-green-400 font-medium">{message}</p>
              <p className="text-sm text-gray-400">Redirigiendo al inicio de sesión...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xl">📧</p>
              <p className="text-gray-300 mb-4">{message}</p>
              
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-4">
                  ¿No recibiste el email? Revisa tu carpeta de spam
                </p>
                <Link
                  href="/auth/signin"
                  className="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-lg transition-colors"
                >
                  Volver al Inicio de Sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

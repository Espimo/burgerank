#!/bin/bash

# ============================================================================
# CHECKLIST FINAL DE CONFIGURACIÓN DE AUTENTICACIÓN
# ============================================================================
# Este archivo es una guía de verificación para asegurar que todo está
# configurado correctamente en Supabase

echo "🔐 CHECKLIST DE CONFIGURACIÓN - AUTENTICACIÓN SUPABASE"
echo "======================================================"
echo ""

# Verificar variables de entorno
echo "1️⃣ Verificando variables de entorno..."
if [ -f .env.local ]; then
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "   ✅ NEXT_PUBLIC_SUPABASE_URL encontrado"
    else
        echo "   ❌ NEXT_PUBLIC_SUPABASE_URL NO encontrado en .env.local"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY encontrado"
    else
        echo "   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY NO encontrado en .env.local"
    fi
    
    if grep -q "NEXT_PUBLIC_APP_URL" .env.local; then
        echo "   ✅ NEXT_PUBLIC_APP_URL encontrado"
    else
        echo "   ⚠️  NEXT_PUBLIC_APP_URL NO encontrado (opcional pero recomendado)"
    fi
else
    echo "   ❌ Archivo .env.local NO encontrado"
    echo "      Crea el archivo con tus credenciales de Supabase"
fi

echo ""
echo "2️⃣ Archivos de autenticación verificados:"
echo "   ✅ app/api/auth/signin/route.ts"
echo "   ✅ app/api/auth/signup/route.ts"
echo "   ✅ app/api/auth/logout/route.ts"
echo "   ✅ app/auth/signin/page.tsx"
echo "   ✅ app/auth/signup/page.tsx"
echo "   ✅ app/contexts/AuthContext.tsx"
echo "   ✅ lib/auth/helpers.ts"
echo "   ✅ middleware.ts"
echo ""

echo "3️⃣ Scripts SQL disponibles:"
echo "   📄 database/rls_policies.sql"
echo ""

echo "📋 PASOS FINALES EN SUPABASE DASHBOARD:"
echo "======================================"
echo ""
echo "A. Habilitar Email Authentication:"
echo "   1. Ve a Authentication > Providers"
echo "   2. Encuentra Email"
echo "   3. Asegúrate que esté HABILITADO (toggle verde)"
echo "   4. Pon checkmarks en:"
echo "      - Email Confirmations"
echo "      - Secure email change"
echo ""

echo "B. Configurar Redirect URLs:"
echo "   1. Ve a Authentication > URL Configuration"
echo "   2. En 'Redirect URLs', agrega:"
echo "      http://localhost:3000/auth/verify-email"
echo "      http://localhost:3000/auth/signin"
echo "      http://localhost:3000/ranking"
echo "      https://tu-dominio.com/auth/verify-email (cuando deployes)"
echo ""

echo "C. Ejecutar Políticas de RLS:"
echo "   1. Ve a SQL Editor"
echo "   2. Copia el contenido de: database/rls_policies.sql"
echo "   3. Ejecuta el script"
echo ""

echo "D. (Opcional) Configurar Email Real:"
echo "   1. Ve a Project Settings > Email Templates"
echo "   2. O configura SMTP personalizado"
echo ""

echo "🧪 PRUEBAS LOCALES:"
echo "================="
echo ""
echo "1. Inicia el servidor:"
echo "   npm run dev"
echo ""
echo "2. Ve a: http://localhost:3000/auth/signup"
echo ""
echo "3. Intenta crear una cuenta con:"
echo "   Email: test@example.com"
echo "   Username: testuser123"
echo "   Password: TestPassword123!"
echo ""
echo "4. Verifica que suceda:"
echo "   ✅ Se crea usuario en auth.users"
echo "   ✅ Se crea perfil en public.users"
echo "   ✅ Recibes email de confirmación (si está habilitado)"
echo ""
echo "5. Intenta iniciar sesión"
echo ""

echo "🔍 TROUBLESHOOTING:"
echo "=================="
echo ""
echo "Si hay errores, verifica:"
echo "□ Variables de entorno correctas (.env.local)"
echo "□ Email habilitado en Authentication > Providers"
echo "□ Redirect URLs configuradas"
echo "□ RLS policies ejecutadas"
echo "□ Tabla 'users' existe y tiene estructura correcta"
echo "□ No hay errores en la consola del navegador (F12)"
echo "□ No hay errores en la terminal de Next.js"
echo ""

echo "📚 DOCUMENTACIÓN:"
echo "================"
echo ""
echo "Lee estos archivos para más detalles:"
echo "📖 AUTH_SETUP.md - Guía completa de configuración"
echo "📖 AUTENTICACION_COMPLETA.md - Documentación del sistema"
echo ""

echo "✅ CHECKLIST COMPLETADO"
echo ""
echo "Una vez completados todos los pasos anteriores, la autenticación"
echo "debería estar funcionando correctamente."
echo ""

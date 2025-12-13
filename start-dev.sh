#!/bin/bash

echo "🧹 Limpiando cache de Next.js..."
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache

echo "🗑️  Limpiando archivos temporales..."
rm -rf /tmp/next-* 2>/dev/null

echo "✅ Cache limpiado"
echo ""
echo "🚀 Levantando servidor de desarrollo..."
echo ""
echo "════════════════════════════════════════"
echo "   ✨ SERVIDOR LOCAL EN MODO DEBUG     "
echo "════════════════════════════════════════"
echo ""
echo "🌐 Abre en tu navegador:"
echo "   → http://localhost:3000/demo"
echo ""
echo "📊 Dashboard de Logs:"
echo "   ← Los logs aparecerán en la página"
echo ""
echo "🐛 DevTools:"
echo "   ← Presiona F12 para ver console"
echo ""
echo "════════════════════════════════════════"
echo ""

npm run dev

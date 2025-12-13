# 🧪 BURGERANK - DEV SERVER WITH DEBUG MODE

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✨ SERVIDOR LOCAL - MODO DEBUG & PREVIEW" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Clean cache
Write-Host "🧹 Limpiando cache de Next.js..." -ForegroundColor Green
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
Remove-Item -Path ".turbo" -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue | Out-Null

Write-Host "✅ Cache limpiado" -ForegroundColor Green
Write-Host ""

# Kill any existing node processes
Write-Host "🛑 Deteniendo servidores previos..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Write-Host "✅ Hecho" -ForegroundColor Green
Write-Host ""

# Start dev server
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 ABRE EN TU NAVEGADOR:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000/demo" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 CARACTERÍSTICAS:" -ForegroundColor Yellow
Write-Host "   ✅ Demo interactivo sin Supabase" -ForegroundColor Green
Write-Host "   ✅ Live logs en la página" -ForegroundColor Green
Write-Host "   ✅ Hot reload en cambios" -ForegroundColor Green
Write-Host "   ✅ Error display claro" -ForegroundColor Green
Write-Host "   ✅ DevTools disponible (F12)" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 DEBUGGING:" -ForegroundColor Yellow
Write-Host "   • Abre F12 (DevTools)" -ForegroundColor Gray
Write-Host "   • Ve a Console tab" -ForegroundColor Gray
Write-Host "   • Busca mensajes con ✅, ⚠️, o 🔴" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Start the server
npm run dev

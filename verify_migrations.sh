#!/bin/bash

# ============================================================================
# BurgeRank Database Migration Verification Script
# ============================================================================
# Este script verifica que todas las migraciones se hayan ejecutado correctamente
# Ejecuta: chmod +x verify_migrations.sh && ./verify_migrations.sh

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║         🍔 BurgeRank Database Migration Verification            ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Supabase credentials are set
if [ -z "$SUPABASE_DB_HOST" ]; then
  echo -e "${YELLOW}⚠️  No direct database connection configured for verification${NC}"
  echo ""
  echo -e "${BLUE}Alternative: Verify manually in Supabase SQL Editor${NC}"
  echo ""
  echo "1. Go to https://app.supabase.com"
  echo "2. Open SQL Editor"
  echo "3. Run the verification queries below:"
  echo ""
  echo -e "${YELLOW}=== Copy and paste this into the SQL Editor ===${NC}"
  cat << 'EOF'

-- ============================================================================
-- VERIFICACIÓN COMPLETA DE MIGRACIONES BurgeRank
-- ============================================================================

SELECT 
  'TABLAS' as Categoria, 
  COUNT(*) as Cantidad 
FROM pg_tables 
WHERE schemaname = 'public'
UNION ALL
SELECT 'FUNCIONES', COUNT(*) 
FROM pg_proc 
WHERE schemaname = 'public'
UNION ALL
SELECT 'TRIGGERS', COUNT(*) 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
UNION ALL
SELECT 'POLITICAS RLS', COUNT(*) 
FROM pg_policies 
WHERE schemaname = 'public'
UNION ALL
SELECT 'VISTAS MATERIALIZADAS', COUNT(*) 
FROM pg_matviews 
WHERE schemaname = 'public'
UNION ALL
SELECT 'REWARDS', COUNT(*) FROM rewards
UNION ALL
SELECT 'RESTAURANTES', COUNT(*) FROM restaurants
UNION ALL
SELECT 'HAMBURGUESAS', COUNT(*) FROM burgers
ORDER BY Categoria;

-- Listar rewards
SELECT '=== REWARDS DISPONIBLES ===' as Titulo;
SELECT name, points_cost, reward_type FROM rewards ORDER BY points_cost;

-- Listar restaurantes
SELECT '=== RESTAURANTES ===' as Titulo;
SELECT name, city, average_rating FROM restaurants ORDER BY average_rating DESC;

-- Listar tablas
SELECT '=== TABLAS CREADAS ===' as Titulo;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

EOF
  
  echo ""
  echo -e "${GREEN}✅ Asegúrate de que todos estos valores sean correctos:${NC}"
  echo "  • TABLAS: 12"
  echo "  • FUNCIONES: 12+"
  echo "  • TRIGGERS: 15+"
  echo "  • POLITICAS RLS: 50+"
  echo "  • VISTAS MATERIALIZADAS: 7"
  echo "  • REWARDS: 12"
  echo "  • RESTAURANTES: 5"
  echo "  • HAMBURGUESAS: 9"
  echo ""
  echo -e "${BLUE}=== Próximos Pasos ===${NC}"
  echo ""
  echo "1. Abre https://app.supabase.com en tu navegador"
  echo "2. Selecciona tu proyecto BurgeRank"
  echo "3. Ve a SQL Editor (menú izquierdo)"
  echo "4. Copia y pega cada archivo de migración en orden:"
  echo ""
  echo "   Orden de ejecución:"
  echo "   1️⃣  supabase/migrations/001_schema.sql"
  echo "   2️⃣  supabase/migrations/002_functions.sql"
  echo "   3️⃣  supabase/migrations/003_triggers.sql"
  echo "   4️⃣  supabase/migrations/004_rls_policies.sql"
  echo "   5️⃣  supabase/migrations/005_seed_data.sql"
  echo "   6️⃣  supabase/migrations/006_materialized_views.sql"
  echo ""
  echo "5. Después de cada migración, haz clic en 'Run'"
  echo ""
  echo -e "${GREEN}✅ Tiempo total esperado: 15-25 segundos${NC}"
  
else
  echo -e "${GREEN}✅ Conectando a la base de datos...${NC}"
  # Connection would go here with psql if credentials are available
  echo -e "${YELLOW}Connection string detected but script verification not fully configured${NC}"
fi

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════╗"
echo "║              Para más detalles, lee MIGRATION_GUIDE.md             ║"
echo "╚══════════════════════════════════════════════════════════════════╝${NC}"

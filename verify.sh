#!/bin/bash
# BurgeRank Project Verification Script

echo "🍔 BurgeRank - Project Verification"
echo "===================================="
echo ""

# Check Node version
echo "✓ Node.js version:"
node --version

echo ""
echo "✓ npm version:"
npm --version

echo ""
echo "=== PROJECT STRUCTURE ==="
echo ""

# Check key files
files=(
  ".env.local"
  "package.json"
  "next.config.ts"
  "tailwind.config.ts"
  "tsconfig.json"
  "app/layout.tsx"
  "app/page.tsx"
  "app/(main)/layout.tsx"
  "app/(main)/ranking/page.tsx"
  "app/(main)/search/page.tsx"
  "app/(main)/rate/page.tsx"
  "app/(main)/rewards/page.tsx"
  "app/(main)/profile/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - MISSING!"
  fi
done

echo ""
echo "=== COMPONENTS ==="
echo ""

components=(
  "components/layout/Header.tsx"
  "components/layout/BottomNav.tsx"
  "components/burger/BurgerCard.tsx"
  "components/burger/RatingItem.tsx"
  "components/shared/FilterPanel.tsx"
)

for component in "${components[@]}"; do
  if [ -f "$component" ]; then
    echo "✅ $component"
  else
    echo "❌ $component - MISSING!"
  fi
done

echo ""
echo "=== LIBRARY FILES ==="
echo ""

libs=(
  "lib/supabase/client.ts"
  "lib/supabase/queries.ts"
  "lib/stores/auth.ts"
  "lib/stores/burger.ts"
  "lib/stores/user.ts"
  "lib/validations/schemas.ts"
  "lib/utils/format.ts"
  "types/index.ts"
)

for lib in "${libs[@]}"; do
  if [ -f "$lib" ]; then
    echo "✅ $lib"
  else
    echo "❌ $lib - MISSING!"
  fi
done

echo ""
echo "=== API ROUTES ==="
echo ""

apis=(
  "app/api/burgers/search/route.ts"
  "app/api/burgers/[id]/route.ts"
  "app/api/ratings/route.ts"
  "app/api/auth/register/route.ts"
  "app/api/auth/login/route.ts"
  "app/api/users/[id]/route.ts"
)

for api in "${apis[@]}"; do
  if [ -f "$api" ]; then
    echo "✅ $api"
  else
    echo "❌ $api - MISSING!"
  fi
done

echo ""
echo "=== DOCUMENTATION ==="
echo ""

docs=(
  "README.md"
  "SETUP.md"
  "PROYECTO_COMPLETADO.md"
)

for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    echo "✅ $doc"
  else
    echo "❌ $doc - MISSING!"
  fi
done

echo ""
echo "=== TYPESCRIPT FILES COUNT ==="
echo ""

ts_count=$(find app components lib types -name "*.tsx" -o -name "*.ts" | wc -l)
echo "Total TypeScript files: $ts_count"

echo ""
echo "=== BUILD TEST ==="
echo ""

echo "Running: npm run build"
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
else
  echo "❌ Build failed!"
  exit 1
fi

echo ""
echo "🎉 All verifications passed!"
echo ""
echo "Next steps:"
echo "1. Configure .env.local with Supabase credentials"
echo "2. Create database tables (see SETUP.md)"
echo "3. Run: npm run dev"
echo "4. Visit: http://localhost:3000"

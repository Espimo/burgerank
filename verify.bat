@echo off
REM BurgeRank Project Verification Script for Windows

echo.
echo 🍔 BurgeRank - Project Verification
echo ====================================
echo.

REM Check Node version
echo ✓ Node.js version:
node --version
echo.

REM Check npm version
echo ✓ npm version:
npm --version
echo.

echo === PROJECT STRUCTURE ===
echo.

REM Check key files
for %%f in (
  ".env.local"
  "package.json"
  "next.config.ts"
  "tailwind.config.ts"
  "tsconfig.json"
  "app\layout.tsx"
  "app\page.tsx"
  "app\(main)\layout.tsx"
  "app\(main)\ranking\page.tsx"
  "app\(main)\search\page.tsx"
  "app\(main)\rate\page.tsx"
  "app\(main)\rewards\page.tsx"
  "app\(main)\profile\page.tsx"
) do (
  if exist "%%f" (
    echo ✅ %%f
  ) else (
    echo ❌ %%f - MISSING!
  )
)

echo.
echo === COMPONENTS ===
echo.

for %%c in (
  "components\layout\Header.tsx"
  "components\layout\BottomNav.tsx"
  "components\burger\BurgerCard.tsx"
  "components\burger\RatingItem.tsx"
  "components\shared\FilterPanel.tsx"
) do (
  if exist "%%c" (
    echo ✅ %%c
  ) else (
    echo ❌ %%c - MISSING!
  )
)

echo.
echo === LIBRARY FILES ===
echo.

for %%l in (
  "lib\supabase\client.ts"
  "lib\supabase\queries.ts"
  "lib\stores\auth.ts"
  "lib\stores\burger.ts"
  "lib\stores\user.ts"
  "lib\validations\schemas.ts"
  "lib\utils\format.ts"
  "types\index.ts"
) do (
  if exist "%%l" (
    echo ✅ %%l
  ) else (
    echo ❌ %%l - MISSING!
  )
)

echo.
echo === API ROUTES ===
echo.

for %%a in (
  "app\api\burgers\search\route.ts"
  "app\api\burgers\[id]\route.ts"
  "app\api\ratings\route.ts"
  "app\api\auth\register\route.ts"
  "app\api\auth\login\route.ts"
  "app\api\users\[id]\route.ts"
) do (
  if exist "%%a" (
    echo ✅ %%a
  ) else (
    echo ❌ %%a - MISSING!
  )
)

echo.
echo === DOCUMENTATION ===
echo.

for %%d in (
  "README.md"
  "SETUP.md"
  "PROYECTO_COMPLETADO.md"
) do (
  if exist "%%d" (
    echo ✅ %%d
  ) else (
    echo ❌ %%d - MISSING!
  )
)

echo.
echo === BUILD TEST ===
echo.

echo Running: npm run build
call npm run build

if %ERRORLEVEL% EQU 0 (
  echo.
  echo ✅ Build successful!
) else (
  echo.
  echo ❌ Build failed!
  exit /b 1
)

echo.
echo 🎉 All verifications passed!
echo.
echo Next steps:
echo 1. Configure .env.local with Supabase credentials
echo 2. Create database tables ^(see SETUP.md^)
echo 3. Run: npm run dev
echo 4. Visit: http://localhost:3000
echo.
pause

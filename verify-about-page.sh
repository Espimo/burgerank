#!/bin/bash

# About Page Installation Verification Script
# Verifica que todos los archivos necesarios estén presentes

set -e

echo "======================================"
echo "🧪 BurgeRank About Page - Verification"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
FOUND=0
MISSING=0

# Function to check file
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((FOUND++))
    else
        echo -e "${RED}✗${NC} $1"
        ((MISSING++))
    fi
}

# Function to check directory
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((FOUND++))
    else
        echo -e "${RED}✗${NC} $1/"
        ((MISSING++))
    fi
}

echo "📁 Checking Directory Structure..."
echo ""

# Main directories
check_dir "components/about"
check_dir "app/about"
check_dir "app/legal"
check_dir "app/legal/terms"
check_dir "app/legal/privacy"
check_dir "app/legal/cookies"
check_dir "app/api/contact"
check_dir "lib/utils"
check_dir "lib/constants"
check_dir "types"
check_dir "supabase/migrations"
check_dir "__tests__"

echo ""
echo "📄 Checking Component Files..."
echo ""

# Components
check_file "components/about/hero-section.tsx"
check_file "components/about/about-us-section.tsx"
check_file "components/about/how-it-works-section.tsx"
check_file "components/about/ranking-methodology-section.tsx"
check_file "components/about/for-restaurants-section.tsx"
check_file "components/about/restaurant-contact-form.tsx"
check_file "components/about/contact-section.tsx"
check_file "components/about/social-links.tsx"
check_file "components/about/faqs-section.tsx"
check_file "components/about/press-section.tsx"
check_file "components/about/cookie-banner.tsx"

echo ""
echo "📄 Checking Page Files..."
echo ""

# Pages
check_file "app/about/page.tsx"
check_file "app/about/layout.tsx"
check_file "app/legal/terms/page.tsx"
check_file "app/legal/privacy/page.tsx"
check_file "app/legal/cookies/page.tsx"

echo ""
echo "🔌 Checking API Routes..."
echo ""

# API Routes
check_file "app/api/contact/general/route.ts"
check_file "app/api/contact/restaurant/route.ts"

echo ""
echo "⚙️  Checking Utilities & Config..."
echo ""

# Utilities
check_file "lib/utils/send-email.ts"
check_file "lib/constants/about.ts"
check_file "types/about.ts"
check_file ".env.example"

echo ""
echo "🗄️  Checking Database..."
echo ""

# Database
check_file "supabase/migrations/20241115_create_contact_tables.sql"

echo ""
echo "📚 Checking Documentation..."
echo ""

# Documentation
check_file "ABOUT_PAGE_README.md"
check_file "ABOUT_PAGE_SUMMARY.md"
check_file "DEPLOYMENT_GUIDE.md"
check_file "CHANGELOG.md"

echo ""
echo "🧪 Checking Tests..."
echo ""

# Tests
check_file "__tests__/about-page.test.ts"

echo ""
echo "======================================"
echo "Summary:"
echo -e "${GREEN}Found: $FOUND${NC}"
echo -e "${RED}Missing: $MISSING${NC}"
echo "======================================"
echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ All files present!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure environment: cp .env.example .env.local"
    echo "2. Install dependencies: npm install nodemailer"
    echo "3. Run migrations: supabase migration up"
    echo "4. Start development: npm run dev"
    echo "5. Visit: http://localhost:3000/about"
    exit 0
else
    echo -e "${RED}❌ Some files are missing!${NC}"
    echo ""
    echo "Please ensure all files have been created."
    echo "Check ABOUT_PAGE_README.md for setup instructions."
    exit 1
fi

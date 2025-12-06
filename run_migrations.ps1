# ============================================================================
# BurgeRank Database Migration Executor (PowerShell)
# ============================================================================
# Ejecuta todas las migraciones SQL en Supabase automáticamente

param(
    [string]$Password = ""
)

# Colors
$Green = [System.ConsoleColor]::Green
$Red = [System.ConsoleColor]::Red
$Yellow = [System.ConsoleColor]::Yellow
$Cyan = [System.ConsoleColor]::Cyan

# Configuration
$Host = "wxbfteisljkzsduuicis.db.supabase.co"
$Port = 5432
$Database = "postgres"
$User = "postgres"
$Migrations = @(
    "supabase/migrations/001_schema.sql",
    "supabase/migrations/002_functions.sql",
    "supabase/migrations/003_triggers.sql",
    "supabase/migrations/004_rls_policies.sql",
    "supabase/migrations/005_seed_data.sql",
    "supabase/migrations/006_materialized_views.sql"
)

# ============================================================================
# Functions
# ============================================================================

function Write-Header {
    param([string]$Text)
    Write-Host "`n" -ForegroundColor Gray
    Write-Host ("=" * 80) -ForegroundColor Cyan
    Write-Host "  $Text" -ForegroundColor Green
    Write-Host ("=" * 80) -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Text)
    Write-Host "✅ $Text" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Text)
    Write-Host "❌ $Text" -ForegroundColor Red
}

function Write-Info {
    param([string]$Text)
    Write-Host "ℹ️  $Text" -ForegroundColor Cyan
}

function Validate-Migrations {
    Write-Header "VALIDANDO ARCHIVOS DE MIGRACIÓN"
    
    $allExist = $true
    foreach ($migration in $Migrations) {
        if (Test-Path $migration) {
            $size = (Get-Item $migration).Length
            Write-Success "$migration ($size bytes)"
        } else {
            Write-Error-Custom "No encontrado: $migration"
            $allExist = $false
        }
    }
    
    return $allExist
}

function Execute-Migrations {
    param([string]$Password)
    
    if ([string]::IsNullOrEmpty($Password)) {
        Write-Error-Custom "Contraseña de Supabase no proporcionada"
        Write-Info "Uso: .\run_migrations.ps1 -Password 'tu_contraseña'"
        return $false
    }
    
    Write-Header "EJECUTANDO MIGRACIONES"
    
    $failed = @()
    $success = 0
    
    for ($i = 0; $i -lt $Migrations.Count; $i++) {
        $migration = $Migrations[$i]
        $number = $i + 1
        
        Write-Host "`n$("─" * 80)" -ForegroundColor Gray
        Write-Host "Migración $number`: $(Split-Path $migration -Leaf)" -ForegroundColor Yellow
        Write-Host "$("─" * 80)" -ForegroundColor Gray
        
        # Lee el archivo SQL
        if (-not (Test-Path $migration)) {
            Write-Error-Custom "Archivo no encontrado: $migration"
            $failed += $migration
            continue
        }
        
        $sqlContent = Get-Content $migration -Raw
        
        try {
            # Intenta usar psql si está disponible
            $psqlExists = $null -ne (Get-Command psql -ErrorAction SilentlyContinue)
            
            if ($psqlExists) {
                # Usa psql
                $env:PGPASSWORD = $Password
                $output = $sqlContent | psql -h $Host -p $Port -U $User -d $Database 2>&1
                $exitCode = $LASTEXITCODE
                
                if ($exitCode -eq 0) {
                    Write-Success "Migración $number completada"
                    $success++
                } else {
                    Write-Error-Custom "Migración $number falló"
                    Write-Host $output -ForegroundColor Red
                    $failed += $migration
                }
            } else {
                Write-Info "psql no encontrado, usando método alternativo..."
                Write-Info "Por favor ejecuta manualmente en Supabase SQL Editor:"
                Write-Host "`n$sqlContent`n" -ForegroundColor Gray
                $failed += $migration
            }
        } catch {
            Write-Error-Custom "Error en migración $number`: $_"
            $failed += $migration
        }
    }
    
    Write-Header "RESUMEN"
    Write-Info "Migraciones exitosas: $success / $($Migrations.Count)"
    
    if ($failed.Count -gt 0) {
        Write-Error-Custom "Migraciones fallidas: $($failed.Count)"
        foreach ($f in $failed) {
            Write-Host "  - $f" -ForegroundColor Red
        }
        return $false
    } else {
        Write-Success "✨ Todas las migraciones completadas exitosamente ✨"
        Write-Info "Tu base de datos BurgeRank está lista"
        return $true
    }
}

# ============================================================================
# Main
# ============================================================================

Write-Host @"

╔════════════════════════════════════════════════════════════════════════════════╗
║              🍔 BurgeRank Database Migration Executor 🍔                       ║
║                     Supabase PostgreSQL Migrations                             ║
╚════════════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Validar migraciones
if (-not (Validate-Migrations)) {
    Write-Error-Custom "Algunos archivos de migración no existen"
    exit 1
}

# Ejecutar migraciones
if (-not (Execute-Migrations -Password $Password)) {
    Write-Host "`n⚠️  Algunas migraciones fallaron" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "`n✨ ¡Proceso completado exitosamente!" -ForegroundColor Green
    exit 0
}

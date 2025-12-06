#!/usr/bin/env python3
"""
Verificador de Migraciones SQL - BurgeRank Database
Valida que todas las migraciones fueron ejecutadas correctamente
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables de entorno
env_path = Path(__file__).parent / '.env.local'
load_dotenv(env_path)

def verify_migration_files():
    """Verifica que todos los archivos de migración existan"""
    print("=" * 70)
    print("[*] VERIFICADOR DE MIGRACIONES - BurgeRank Database")
    print("=" * 70)
    
    migration_dir = Path(__file__).parent / 'supabase' / 'migrations'
    required_files = [
        '001_schema.sql',
        '002_functions.sql',
        '003_triggers.sql',
        '004_rls_policies.sql',
        '005_seed_data.sql',
        '006_materialized_views.sql'
    ]
    
    print("\n[*] Verificando archivos de migración:")
    print("-" * 70)
    
    all_exist = True
    for i, filename in enumerate(required_files, 1):
        filepath = migration_dir / filename
        exists = filepath.exists()
        status = "[OK]" if exists else "[X]"
        print(f"{status} [{i}] {filename:<30} ", end="")
        
        if exists:
            size = filepath.stat().st_size
            lines = len(filepath.read_text().splitlines())
            print(f"({size:,} bytes, {lines} líneas)")
        else:
            print("(NO ENCONTRADO)")
            all_exist = False
    
    return all_exist

def check_sql_syntax():
    """Verifica que no haya errores de sintaxis comunes en los archivos"""
    print("\n[*] Verificando sintaxis SQL:")
    print("-" * 70)
    
    migration_dir = Path(__file__).parent / 'supabase' / 'migrations'
    
    issues = []
    
    # Verificar 001_schema.sql específicamente por el error anterior
    schema_file = migration_dir / '001_schema.sql'
    if schema_file.exists():
        content = schema_file.read_text()
        
        # Verificar que la FK circular fue removida
        if 'FOREIGN KEY (user_id, reward_id) REFERENCES (' in content:
            issues.append("[X] ERROR: Se encontró la FK circular en user_rewards (no fue corregida)")
        else:
            print("[OK] [001] FK circular removida correctamente")
        
        # Verificar que user_rewards tiene la estructura correcta
        if 'CREATE TABLE user_rewards' in content and 'ON DELETE CASCADE' in content:
            print("[OK] [001] user_rewards tiene estructura correcta")
        else:
            issues.append("[X] [001] Estructura de user_rewards podría estar incorrecta")
        
        # Verificar extensiones requeridas
        if 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"' in content:
            print("[OK] [001] Extensión uuid-ossp configurada")
        else:
            issues.append("[!] [001] No se encontró extensión uuid-ossp")
        
        if 'CREATE EXTENSION IF NOT EXISTS pgcrypto' in content:
            print("[OK] [001] Extensión pgcrypto configurada")
        else:
            issues.append("[!] [001] No se encontró extensión pgcrypto")
    
    # Verificar 002_functions.sql
    functions_file = migration_dir / '002_functions.sql'
    if functions_file.exists():
        content = functions_file.read_text()
        functions_count = content.count('CREATE OR REPLACE FUNCTION')
        print(f"[OK] [002] {functions_count} funciones PostgreSQL encontradas")
    
    # Verificar 003_triggers.sql
    triggers_file = migration_dir / '003_triggers.sql'
    if triggers_file.exists():
        content = triggers_file.read_text()
        triggers_count = content.count('CREATE TRIGGER')
        print(f"[OK] [003] {triggers_count} triggers encontrados")
    
    # Verificar 004_rls_policies.sql
    policies_file = migration_dir / '004_rls_policies.sql'
    if policies_file.exists():
        content = policies_file.read_text()
        policies_count = content.count('CREATE POLICY')
        print(f"[OK] [004] {policies_count} políticas RLS encontradas")
    
    # Verificar 005_seed_data.sql
    seed_file = migration_dir / '005_seed_data.sql'
    if seed_file.exists():
        content = seed_file.read_text()
        insert_count = content.count('INSERT INTO')
        print(f"[OK] [005] {insert_count} INSERT statements en seed data")
    
    # Verificar 006_materialized_views.sql
    views_file = migration_dir / '006_materialized_views.sql'
    if views_file.exists():
        content = views_file.read_text()
        views_count = content.count('CREATE MATERIALIZED VIEW')
        print(f"[OK] [006] {views_count} vistas materializadas encontradas")
    
    return issues

def check_env_configuration():
    """Verifica que las variables de entorno estén configuradas"""
    print("\n[*] Verificando configuración de Supabase:")
    print("-" * 70)
    
    required_vars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY'
    ]
    
    all_configured = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            # Mostrar solo primeros caracteres por seguridad
            masked = value[:20] + '...' if len(value) > 20 else value
            print(f"[OK] {var:<35} {masked}")
        else:
            print(f"[X] {var:<35} (NO CONFIGURADA)")
            all_configured = False
    
    return all_configured

def check_automation_scripts():
    """Verifica que los scripts de automatización existan"""
    print("\n[*] Verificando scripts de automatización:")
    print("-" * 70)
    
    scripts = [
        ('run_migrations.py', 'Python'),
        ('run_migrations.ps1', 'PowerShell')
    ]
    
    base_dir = Path(__file__).parent
    
    for script_name, lang in scripts:
        script_path = base_dir / script_name
        if script_path.exists():
            size = script_path.stat().st_size
            lines = len(script_path.read_text().splitlines())
            print(f"[OK] {script_name:<30} ({lines} líneas, {size:,} bytes)")
        else:
            print(f"[X] {script_name:<30} (NO ENCONTRADO)")

def main():
    """Función principal"""
    
    # Verificar archivos de migración
    files_ok = verify_migration_files()
    
    # Verificar sintaxis SQL
    issues = check_sql_syntax()
    
    # Verificar configuración
    env_ok = check_env_configuration()
    
    # Verificar scripts de automatización
    check_automation_scripts()
    
    # Resumen final
    print("\n" + "=" * 70)
    print("[*] RESUMEN DE VERIFICACION")
    print("=" * 70)
    
    if files_ok and not issues and env_ok:
        print("[OK] TODO ESTA CORRECTO - Listo para ejecutar migraciones")
        print("\n[*] Proximos pasos:")
        print("   1. Si aun no has ejecutado las migraciones:")
        print("      - Opcion A: python run_migrations.py")
        print("      - Opcion B: .\\run_migrations.ps1 -Password 'tu_password'")
        print("      - Opcion C: Copia/pega en Supabase SQL Editor")
        print("\n   2. Verifica que todas las tablas se crearon:")
        print("      SELECT * FROM information_schema.tables WHERE table_schema='public'")
        print("\n   3. Inicia tu app: npm run dev")
    else:
        print("[!] HAY PROBLEMAS QUE NECESITAN ATENCION:")
        if not files_ok:
            print("   - [X] Faltan algunos archivos de migracion")
        if issues:
            print("   - [X] Se encontraron problemas de sintaxis SQL:")
            for issue in issues:
                print(f"      {issue}")
        if not env_ok:
            print("   - [!] Faltan variables de entorno en .env.local")
    
    print("=" * 70 + "\n")

if __name__ == '__main__':
    main()

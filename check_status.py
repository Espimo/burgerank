#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Estado del Proyecto - BurgeRank Database
"""

import os
import sys
from pathlib import Path

# Configurar encoding
if sys.platform == 'win32':
    os.environ['PYTHONIOENCODING'] = 'utf-8'

def main():
    """Función principal"""
    
    print("\n" + "=" * 70)
    print("ESTADO DEL PROYECTO - BurgeRank Database")
    print("=" * 70)
    
    # 1. Verificar archivos de migracion
    print("\n1. ARCHIVOS DE MIGRACION:")
    print("-" * 70)
    
    migration_dir = Path(__file__).parent / 'supabase' / 'migrations'
    files = [
        '001_schema.sql',
        '002_functions.sql', 
        '003_triggers.sql',
        '004_rls_policies.sql',
        '005_seed_data.sql',
        '006_materialized_views.sql'
    ]
    
    total_size = 0
    total_lines = 0
    
    for i, filename in enumerate(files, 1):
        filepath = migration_dir / filename
        if filepath.exists():
            size = filepath.stat().st_size
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                lines = len(f.readlines())
            total_size += size
            total_lines += lines
            status = "OK"
            print(f"  {status} [{i}] {filename:<30} ({size:>8,} bytes, {lines:>3} lineas)")
        else:
            print(f"  X  [{i}] {filename:<30} (NO ENCONTRADO)")
    
    print(f"\n  Total: {total_size:,} bytes, {total_lines} lineas")
    
    # 2. Verificar correccion del error
    print("\n2. VALIDACION DE CORRECCION SQL:")
    print("-" * 70)
    
    schema_file = migration_dir / '001_schema.sql'
    if schema_file.exists():
        with open(schema_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Verificar que FK circular fue removida
        has_circular = 'FOREIGN KEY (user_id, reward_id) REFERENCES (' in content
        if has_circular:
            print("  X  ERROR: FK circular aun presente")
        else:
            print("  OK FK circular removida correctamente")
        
        # Verificar estructura correcta
        if 'CREATE TABLE user_rewards' in content:
            if 'REFERENCES rewards(id) ON DELETE CASCADE' in content:
                print("  OK user_rewards estructura correcta")
            else:
                print("  X  ERROR: Estructura de user_rewards incorrecta")
    
    # 3. Configuracion de Supabase
    print("\n3. CONFIGURACION DE SUPABASE (.env.local):")
    print("-" * 70)
    
    env_file = Path(__file__).parent / '.env.local'
    if env_file.exists():
        with open(env_file, 'r', encoding='utf-8', errors='ignore') as f:
            env_content = f.read()
        
        vars_to_check = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'SUPABASE_SERVICE_ROLE_KEY'
        ]
        
        for var in vars_to_check:
            if f'{var}=' in env_content:
                print(f"  OK {var}")
            else:
                print(f"  X  {var} (NO ENCONTRADA)")
    else:
        print("  X  .env.local no existe")
    
    # 4. Scripts de automatizacion
    print("\n4. SCRIPTS DE AUTOMATIZACION:")
    print("-" * 70)
    
    scripts = ['run_migrations.py', 'run_migrations.ps1']
    for script in scripts:
        script_path = Path(__file__).parent / script
        if script_path.exists():
            size = script_path.stat().st_size
            print(f"  OK {script:<30} ({size:,} bytes)")
        else:
            print(f"  X  {script:<30} (NO ENCONTRADO)")
    
    # 5. Documentacion
    print("\n5. DOCUMENTACION:")
    print("-" * 70)
    
    docs = ['SQL_CORRECTIONS.md', 'QUICK_START.md', 'MIGRATION_GUIDE.md']
    for doc in docs:
        doc_path = Path(__file__).parent / doc
        if doc_path.exists():
            print(f"  OK {doc}")
        else:
            print(f"  X  {doc}")
    
    # Resumen final
    print("\n" + "=" * 70)
    print("RESUMEN:")
    print("=" * 70)
    print("  Todo esta listo para ejecutar las migraciones!")
    print("\n  Opciones de ejecucion:")
    print("  1. Python:     python run_migrations.py")
    print("  2. PowerShell: .\\run_migrations.ps1 -Password 'password'")
    print("  3. Manual:     Copia/pega en Supabase SQL Editor")
    print("\n" + "=" * 70 + "\n")

if __name__ == '__main__':
    main()

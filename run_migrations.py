#!/usr/bin/env python3
"""
BurgeRank Database Migration Executor
Conecta a Supabase y ejecuta las migraciones SQL en orden
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

try:
    import psycopg2
    import psycopg2.extensions
except ImportError:
    print("❌ Error: psycopg2 no está instalado")
    print("Instala con: pip install psycopg2-binary python-dotenv")
    sys.exit(1)

# ============================================================================
# Configuration
# ============================================================================

SUPABASE_HOST = "wxbfteisljkzsduuicis.db.supabase.co"
SUPABASE_PORT = 5432
SUPABASE_DB = "postgres"
SUPABASE_USER = "postgres"
SUPABASE_PASSWORD = os.getenv("H@yden25CDyl@n25C", "")

# Migrations to execute in order
MIGRATIONS = [
    "supabase/migrations/001_schema.sql",
    "supabase/migrations/002_functions.sql",
    "supabase/migrations/003_triggers.sql",
    "supabase/migrations/004_rls_policies.sql",
    "supabase/migrations/005_seed_data.sql",
    "supabase/migrations/006_materialized_views.sql",
]

# ============================================================================
# Helper Functions
# ============================================================================

def print_header(text):
    print(f"\n{'='*80}")
    print(f"  {text}")
    print(f"{'='*80}\n")

def print_success(text):
    print(f"✅ {text}")

def print_error(text):
    print(f"❌ {text}")

def print_info(text):
    print(f"ℹ️  {text}")

def read_sql_file(filepath):
    """Lee un archivo SQL y retorna su contenido"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print_error(f"Archivo no encontrado: {filepath}")
        return None
    except Exception as e:
        print_error(f"Error al leer {filepath}: {str(e)}")
        return None

def validate_migrations():
    """Valida que todos los archivos de migración existan"""
    print_header("VALIDANDO ARCHIVOS DE MIGRACIÓN")
    
    all_exist = True
    for migration in MIGRATIONS:
        if Path(migration).exists():
            size = Path(migration).stat().st_size
            print_success(f"{migration} ({size:,} bytes)")
        else:
            print_error(f"No encontrado: {migration}")
            all_exist = False
    
    return all_exist

def connect_to_supabase():
    """Conecta a Supabase y retorna la conexión"""
    print_header("CONECTANDO A SUPABASE")
    
    if not SUPABASE_PASSWORD:
        print_error("SUPABASE_DB_PASSWORD no está configurado en .env")
        print_info("Obtén la contraseña de: Supabase → Project Settings → Database")
        return None
    
    try:
        print_info(f"Conectando a {SUPABASE_HOST}...")
        conn = psycopg2.connect(
            host=SUPABASE_HOST,
            port=SUPABASE_PORT,
            database=SUPABASE_DB,
            user=SUPABASE_USER,
            password=SUPABASE_PASSWORD,
            sslmode='require',
            connect_timeout=10
        )
        
        # Set autocommit off para transacciones
        conn.autocommit = False
        
        print_success("Conectado a Supabase exitosamente")
        return conn
    
    except psycopg2.OperationalError as e:
        print_error(f"Error de conexión: {str(e)}")
        print_info("Verifica:")
        print_info("  - Credenciales en .env correctas")
        print_info("  - Conexión a internet disponible")
        print_info("  - Proyecto Supabase activo")
        return None
    
    except Exception as e:
        print_error(f"Error inesperado: {str(e)}")
        return None

def execute_migration(conn, migration_file, migration_number):
    """Ejecuta un archivo de migración"""
    print(f"\n{'─'*80}")
    print(f"Ejecutando migración {migration_number}: {Path(migration_file).name}")
    print(f"{'─'*80}")
    
    sql_content = read_sql_file(migration_file)
    if not sql_content:
        return False
    
    try:
        cursor = conn.cursor()
        
        # Ejecuta el SQL
        cursor.execute(sql_content)
        
        # Commit de la transacción
        conn.commit()
        
        print_success(f"Migración {migration_number} completada exitosamente")
        
        # Muestra stats si es posible
        if hasattr(cursor, 'rowcount') and cursor.rowcount >= 0:
            print_info(f"Filas afectadas: {cursor.rowcount}")
        
        cursor.close()
        return True
    
    except psycopg2.errors.SyntaxError as e:
        print_error(f"Error de sintaxis SQL en migración {migration_number}")
        print_error(f"Línea {e.diag.line_number}: {e.diag.message_primary}")
        conn.rollback()
        return False
    
    except psycopg2.DatabaseError as e:
        print_error(f"Error de base de datos en migración {migration_number}")
        print_error(f"Detalle: {str(e)}")
        conn.rollback()
        return False
    
    except Exception as e:
        print_error(f"Error inesperado en migración {migration_number}: {str(e)}")
        conn.rollback()
        return False

def verify_database(conn):
    """Verifica que la base de datos se haya creado correctamente"""
    print_header("VERIFICANDO BASE DE DATOS")
    
    queries = {
        "Tablas": "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public'",
        "Funciones": "SELECT COUNT(*) FROM pg_proc WHERE schemaname = 'public'",
        "Triggers": "SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public'",
        "Vistas materializadas": "SELECT COUNT(*) FROM pg_matviews WHERE schemaname = 'public'",
        "Rewards": "SELECT COUNT(*) FROM rewards",
        "Restaurantes": "SELECT COUNT(*) FROM restaurants",
        "Hamburguesas": "SELECT COUNT(*) FROM burgers",
    }
    
    try:
        cursor = conn.cursor()
        all_good = True
        
        for name, query in queries.items():
            try:
                cursor.execute(query)
                count = cursor.fetchone()[0]
                print_success(f"{name}: {count}")
            except Exception as e:
                print_error(f"{name}: No se pudo verificar ({str(e)})")
                all_good = False
        
        cursor.close()
        return all_good
    
    except Exception as e:
        print_error(f"Error en verificación: {str(e)}")
        return False

def main():
    """Función principal"""
    print("""
╔════════════════════════════════════════════════════════════════════════════════╗
║              🍔 BurgeRank Database Migration Executor 🍔                       ║
║                     Supabase PostgreSQL Migrations                             ║
╚════════════════════════════════════════════════════════════════════════════════╝
    """)
    
    # Paso 1: Validar archivos
    if not validate_migrations():
        print_error("Algunos archivos de migración no existen")
        sys.exit(1)
    
    # Paso 2: Conectar a Supabase
    conn = connect_to_supabase()
    if not conn:
        sys.exit(1)
    
    # Paso 3: Ejecutar migraciones en orden
    print_header("EJECUTANDO MIGRACIONES")
    
    failed_migrations = []
    for idx, migration in enumerate(MIGRATIONS, 1):
        if not execute_migration(conn, migration, idx):
            failed_migrations.append((idx, migration))
    
    # Paso 4: Verificar base de datos
    if not failed_migrations:
        verify_database(conn)
    else:
        print_header("⚠️  MIGRACIONES FALLIDAS")
        for idx, migration in failed_migrations:
            print_error(f"Migración {idx}: {migration}")
    
    # Cerrar conexión
    conn.close()
    
    # Resumen final
    print_header("RESUMEN")
    total = len(MIGRATIONS)
    successful = total - len(failed_migrations)
    
    if not failed_migrations:
        print_success(f"✨ Todas las {total} migraciones completadas exitosamente ✨")
        print_info("Tu base de datos BurgeRank está lista para usarse")
        print_info("Próximo paso: npm run dev")
    else:
        print_error(f"{successful}/{total} migraciones completadas")
        print_error(f"{len(failed_migrations)} migraciones fallaron")
        print_info("Revisa los errores arriba y corrige los archivos SQL")
    
    return 0 if not failed_migrations else 1

# ============================================================================
# Entry Point
# ============================================================================

if __name__ == "__main__":
    sys.exit(main())

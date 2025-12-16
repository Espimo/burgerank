# Panel Administrativo BurgeRank 🔐

## Descripción General

El panel administrativo es una herramienta completa de gestión para BurgeRank que permite a los administradores controlar todos los aspectos de la plataforma durante el despliegue inicial.

**URL**: `https://burgerank.vercel.app/admin`

**Credenciales de Demo**:
- Usuario: `usuario_admin`
- Contraseña: `admin123`

## Características Principales

### 1. 📊 Dashboard
- **Estadísticas en Tiempo Real**: Visualiza métricas clave de la plataforma
  - Total de restaurantes
  - Total de hamburguesas
  - Valoraciones pendientes
  - Tickets sin verificar
  - Usuarios totales
  - Solicitudes pendientes

- **Registro de Actividad**: Historial de las últimas 5 acciones realizadas
  - Tipo de acción
  - Descripción
  - Fecha y hora
  - Estado

### 2. 🏪 Gestión de Restaurantes
**Crear Nuevos Restaurantes**:
- Nombre del restaurante
- Ciudad (seleccionar entre: Madrid, Barcelona, Valencia, Sevilla, Bilbao)
- Dirección completa
- Teléfono de contacto
- Horario de atención
- Sitio web (opcional)
- Descripción detallada

**Funcionalidades**:
- Ver detalles del restaurante
- Eliminar restaurante (elimina automáticamente sus hamburguesas)
- Visualizar rating y número de reseñas

### 3. 🍟 Gestión de Hamburguesas
**Crear Nuevas Hamburguesas**:
- Nombre de la hamburguesa
- Restaurante (seleccionar de la lista)
- Tipo: Premium, Clásica, Doble Carne, Vegana, Especial
- Precio
- Descripción detallada
- Tags personalizados (presiona Enter para añadir)

**Funcionalidades**:
- Sistema de tags dinámico
- Ver detalles completos
- Eliminar hamburguesa
- Rating asociado

### 4. 📋 Solicitudes de Usuarios
**Gestión de Solicitudes**:
- Revisar nuevas solicitudes de usuarios
- Aprobar solicitudes (activa el usuario en el sistema)
- Rechazar solicitudes (elimina de la cola)
- Estados: Pendiente, Aprobado

**Caso de Uso**:
Perfecta para el control inicial donde revisas manualmente cada nuevo usuario antes de permitir su acceso a la plataforma.

### 5. ⭐ Revisión de Valoraciones
**Gestión de Valoraciones**:
- Ver todas las valoraciones pendientes
- Información del usuario que valora
- Hamburguesa valorada
- Comentario del usuario
- Rating (1-5 estrellas)
- Fecha de la valoración

**Acciones**:
- ✅ Verificar: Publica la valoración en la plataforma
- ❌ Rechazar: Elimina la valoración

**Por Qué es Importante**:
- Evita contenido inapropiado
- Verifica que las valoraciones sean legítimas
- Mantiene la calidad del contenido

### 6. 🎫 Gestión de Tickets
**Verificación de Tickets**:
- Revisar pruebas de compra
- Usuario que subió el ticket
- Hamburguesa consumida
- Restaurante
- Precio pagado
- Fecha del consumo

**Acciones**:
- ✅ Verificar: Confirma la compra
- ❌ Rechazar: Rechaza el ticket

**Por Qué es Importante**:
- Valida que los usuarios hayan probado realmente las hamburguesas
- Evita spam y ratings falsos
- Asegura la integridad de los datos

### 7. 👥 Gestión de Usuarios
**Control de Usuarios Registrados**:
- Nombre de usuario
- Email
- Categoría (Burger Fan, Lover, Obsessed, etc.)
- Puntos acumulados
- Número de valoraciones
- Fecha de registro

**Funcionalidades**:
- Ver perfil completo del usuario
- Historial de actividad

## Flujo de Trabajo Recomendado (Primeras Fases)

### Fase 1: Configuración Inicial
1. Crear restaurantes de prueba
2. Crear hamburguesas de prueba
3. Cargar datos desde `seed.sql`

### Fase 2: Control Manual
1. **Aprobar nuevas solicitudes de usuarios** regularmente
2. **Verificar valoraciones** antes de publicar
3. **Validar tickets** de compra
4. Monitorear el Dashboard para detectar problemas

### Fase 3: Monitoreo
1. Revisar estadísticas diarias
2. Validar que no haya spam
3. Corregir bugs encontrados
4. Ajustar según feedback

### Fase 4: Automatización Gradual
- Una vez todo esté estable, puedes implementar auto-aprobación
- Mantener verificación manual para casos especiales

## Almacenamiento de Datos

**Local**: 
- Los datos se guardan en `localStorage` del navegador
- Perfecto para desarrollo y pruebas

**Producción**:
- Los datos deben conectarse a Supabase
- API endpoints para GET/POST/DELETE

## Seguridad

⚠️ **Notas Importantes**:
- Las credenciales mostradas son solo para demo
- En producción, cambiar las credenciales
- Implementar autenticación con Supabase Auth
- Usar tokens JWT seguros
- Auditar todos los cambios

## Interfaz de Usuario

### Tema
- **Color Principal**: Dorado (#fbbf24)
- **Fondo Oscuro**: Tema dark mode
- **Diseño Responsivo**: Mobile-friendly

### Navegación
- Sidebar izquierda con todas las secciones
- Header superior con usuario y cerrar sesión
- Alertas emergentes para confirmar acciones
- Modales para ver detalles

## Próximas Mejoras (Roadmap)

### Corto Plazo
- [ ] Integración con Supabase para datos persistentes
- [ ] Autenticación segura con JWT
- [ ] Reportes avanzados
- [ ] Exportar datos a CSV/PDF

### Mediano Plazo
- [ ] Sistema de roles (Admin, Moderator, etc.)
- [ ] Filtros y búsqueda avanzada
- [ ] Gráficos de tendencias
- [ ] Notificaciones en tiempo real

### Largo Plazo
- [ ] Sistema de reglas automáticas
- [ ] Machine learning para detección de spam
- [ ] Analytics completo
- [ ] Sistema de soporte integrado

## Troubleshooting

### ¿Los datos no se guardan?
- Verifica que localStorage está habilitado
- Abre la consola del navegador (F12)
- Busca errores en la pestaña Console

### ¿Las nuevas solicitudes no aparecen?
- Los datos son de ejemplo en localStorage
- Para datos reales, conectar con Supabase
- Usar formulario de registro de la web principal

### ¿No se puede iniciar sesión?
- Usuario: `usuario_admin`
- Contraseña: `admin123`
- Verifica mayúsculas/minúsculas
- Limpia caché del navegador

## Atajo de Teclado

| Combinación | Acción |
|------------|--------|
| `Enter` | Añadir tag (en formulario de hamburguesa) |
| `Esc` | Cerrar modal |

## Contacto y Soporte

Para reportar bugs o sugerencias del panel admin, contacta con el equipo de desarrollo.

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2025  
**Estado**: En Producción Beta

# Configuración de Base de Datos - Supabase

## Instrucciones para configurar las tablas en Supabase

### 1. Acceder al Editor SQL de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, selecciona **SQL Editor**
3. Crea una nueva consulta

### 2. Ejecutar el Script SQL

Copia y pega el contenido completo del archivo `database/schema.sql` en el editor SQL de Supabase y ejecuta la consulta.

Este script creará:

#### Tabla `profiles`
- Extiende la tabla de usuarios de Supabase Auth
- Almacena información adicional del usuario (nombre, avatar, etc.)
- Se crea automáticamente un perfil cuando se registra un nuevo usuario

#### Tabla `boards`
- Almacena los boards creados por los usuarios
- Cada board pertenece a un usuario específico
- Incluye nombre, descripción, color y timestamps

### 3. Verificar la configuración

Después de ejecutar el script, verifica que:

1. **Tablas creadas**: `profiles` y `boards` aparecen en la sección **Table Editor**
2. **RLS habilitado**: Row Level Security está activo en ambas tablas
3. **Políticas creadas**: Las políticas de seguridad están configuradas
4. **Triggers activos**: Los triggers para crear perfiles automáticamente están funcionando

### 4. Estructura de las tablas

#### Tabla `profiles`
```sql
id          | UUID (PK, FK a auth.users)
email       | TEXT (UNIQUE, NOT NULL)
name        | TEXT
avatar_url  | TEXT
created_at  | TIMESTAMP
updated_at  | TIMESTAMP
```

#### Tabla `boards`
```sql
id          | UUID (PK)
name        | TEXT (NOT NULL)
description | TEXT
color       | TEXT (default: '#3B82F6')
user_id     | UUID (FK a profiles.id)
created_at  | TIMESTAMP
updated_at  | TIMESTAMP
```

### 5. Políticas de Seguridad (RLS)

- **Profiles**: Los usuarios solo pueden ver y editar su propio perfil
- **Boards**: Los usuarios solo pueden ver, crear, editar y eliminar sus propios boards

### 6. Funciones Automáticas

- **handle_new_user()**: Crea automáticamente un perfil cuando se registra un usuario
- **update_updated_at_column()**: Actualiza automáticamente el campo `updated_at`

### 7. Próximos pasos

Una vez configurada la base de datos:

1. Prueba el registro de usuarios
2. Verifica que se creen los perfiles automáticamente
3. Prueba la creación de boards desde el dashboard
4. Confirma que las políticas RLS funcionan correctamente

### Troubleshooting

Si encuentras errores:

1. **Error de permisos**: Asegúrate de estar usando el rol correcto en Supabase
2. **Tablas no creadas**: Verifica que el script se ejecutó completamente
3. **RLS bloqueando consultas**: Revisa que las políticas estén configuradas correctamente
4. **Triggers no funcionan**: Verifica que las funciones se crearon sin errores

### Comandos útiles para verificación

```sql
-- Verificar que las tablas existen
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies WHERE schemaname = 'public';

-- Verificar triggers
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```
# Configuración de Autenticación con Gmail y Supabase

## 1. Configurar Google OAuth

### Paso 1: Crear un proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ y Google OAuth2

### Paso 2: Configurar OAuth 2.0
1. Ve a "Credenciales" en el menú lateral
2. Haz clic en "Crear credenciales" > "ID de cliente de OAuth 2.0"
3. Selecciona "Aplicación web"
4. Agrega estas URLs autorizadas:
   - **Orígenes autorizados de JavaScript**: 
     - `http://localhost:3001` (desarrollo)
     - `https://reevio.online` (producción)
   - **URIs de redirección autorizados**: 
     - `http://localhost:3001/api/auth/callback/google` (desarrollo)
     - `https://reevio.online/api/auth/callback/google` (producción)

### Paso 3: Obtener las credenciales
- Copia el **Client ID** y **Client Secret**
- Los necesitarás para el archivo `.env.local`

## 2. Configurar Supabase

### Paso 1: Crear un proyecto en Supabase
1. Ve a [Supabase](https://supabase.com/)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración

### Paso 2: Obtener las credenciales
1. Ve a "Settings" > "API"
2. Copia:
   - **Project URL**
   - **anon public key**
   - **service_role key** (mantén esto secreto)

### Paso 3: Configurar las tablas de autenticación
Supabase ya incluye las tablas de autenticación por defecto. NextAuth.js creará automáticamente las tablas adicionales necesarias.

## 3. Configurar Variables de Entorno

Edita el archivo `.env.local` con tus credenciales:

```env
# NextAuth.js
# Para desarrollo: http://localhost:3000
# Para producción: https://reevio.online
NEXTAUTH_URL=https://reevio.online
NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

## 4. Generar NEXTAUTH_SECRET

Puedes generar un secreto seguro ejecutando:
```bash
openssl rand -base64 32
```

O usa cualquier generador de contraseñas seguras.

## 5. Configuración de Producción

Para el despliegue en **reevio.online**:

1. **Google OAuth**: 
   - Agrega `https://reevio.online` a los orígenes autorizados
   - Agrega `https://reevio.online/api/auth/callback/google` a las URIs de redirección

2. **NextAuth.js**: 
   - Cambia `NEXTAUTH_URL=https://reevio.online`
   - Asegúrate de que `NODE_ENV=production` para habilitar HTTPS

3. **Supabase**: Las credenciales son las mismas para desarrollo y producción

4. **Variables de entorno de producción**:
   ```env
   NEXTAUTH_URL=https://reevio.online
   NODE_ENV=production
   ```

## 6. Funcionalidades Implementadas

✅ **Login con Google**: Funciona con NextAuth.js y Google OAuth
✅ **Login con Email**: Usa Supabase Auth para autenticación con credenciales
✅ **Registro de usuarios**: Crea cuentas nuevas en Supabase
✅ **Gestión de sesiones**: NextAuth.js maneja las sesiones automáticamente
✅ **Integración con Supabase**: Todos los usuarios se almacenan en Supabase

## 7. Próximos Pasos

1. Configura las credenciales en `.env.local`
2. Reinicia el servidor de desarrollo
3. Prueba el login y registro
4. Personaliza los estilos según tus necesidades

## Notas Importantes

- **Nunca** subas el archivo `.env.local` a tu repositorio
- Mantén seguras tus credenciales de Supabase service_role
- Para producción, configura las URLs correctas en Google Cloud Console
- Supabase maneja automáticamente la confirmación de email para nuevos usuarios
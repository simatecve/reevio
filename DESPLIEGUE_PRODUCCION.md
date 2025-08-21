# Despliegue en Producción - reevio.online

## Pasos para configurar el proyecto en reevio.online

### 1. Configuración de Google OAuth

**IMPORTANTE**: Antes del despliegue, actualiza la configuración en Google Cloud Console:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a "Credenciales" > "ID de cliente de OAuth 2.0"
4. Edita las configuraciones:

**Orígenes autorizados de JavaScript:**
- `https://reevio.online`
- `http://localhost:3001` (mantener para desarrollo)

**URIs de redirección autorizados:**
- `https://reevio.online/api/auth/callback/google`
- `http://localhost:3001/api/auth/callback/google` (mantener para desarrollo)

### 2. Variables de Entorno

Usa el archivo `.env.production` que contiene:

```env
NEXTAUTH_URL=https://reevio.online
NODE_ENV=production
```

### 3. Configuraciones Aplicadas

✅ **NextAuth.js configurado para HTTPS en producción**
- Cookies seguros habilitados automáticamente
- Redirects configurados para usar el dominio de producción

✅ **URLs actualizadas en toda la aplicación**
- Callbacks de Google OAuth
- Configuración de NextAuth
- Documentación actualizada

### 4. Verificaciones Post-Despliegue

Después del despliegue, verifica:

1. **Login con Google funciona correctamente**
   - Prueba el flujo completo de autenticación
   - Verifica que redirija a `/dashboard` después del login

2. **Sesiones se mantienen correctamente**
   - Las cookies se configuran con `secure: true` en producción
   - Las sesiones persisten entre recargas de página

3. **Redirects funcionan correctamente**
   - Después del login redirije a `/dashboard`
   - Los usuarios no autenticados son redirigidos al login

### 5. Troubleshooting

**Si el login con Google no funciona:**
1. Verifica que las URLs estén correctamente configuradas en Google Cloud Console
2. Revisa que `NEXTAUTH_URL` esté configurado como `https://reevio.online`
3. Asegúrate de que `NODE_ENV=production`

**Si las sesiones no persisten:**
1. Verifica que las cookies se estén configurando con `secure: true`
2. Revisa que el dominio sea HTTPS

### 6. Archivos Modificados

- `.env.local` - Actualizado con URL de producción
- `.env.production` - Nuevo archivo para producción
- `app/api/auth/[...nextauth]/route.ts` - Configuración de cookies y redirects
- `app/api/auth/google/route.ts` - URLs de callback actualizadas
- `CONFIGURACION_AUTH.md` - Documentación actualizada

### 7. Comandos de Despliegue

```bash
# Para usar las variables de producción
cp .env.production .env.local

# Build para producción
npm run build

# Start en producción
npm start
```

---

**Nota**: Mantén seguras las credenciales de Google OAuth y Supabase. Nunca las subas a repositorios públicos.
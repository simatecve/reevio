# Despliegue en cPanel - Reevio

## ⚠️ IMPORTANTE: Limitaciones de cPanel

cPanel en hosting compartido **NO soporta aplicaciones Node.js** como Next.js de forma nativa. Para desplegar Reevio necesitas una de estas opciones:

## Opción 1: Hosting con Soporte Node.js (Recomendado)

### Proveedores Compatibles:
- **Vercel** (Gratuito, optimizado para Next.js)
- **Netlify** (Gratuito con límites)
- **Railway** (Gratuito con límites)
- **DigitalOcean App Platform**
- **Heroku** (Planes de pago)

### Pasos para Vercel (Más Fácil):

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Regístrate con GitHub

2. **Subir proyecto a GitHub**
   - Crea repositorio en GitHub
   - Sube el código (sin .env.production)

3. **Conectar con Vercel**
   - Importa el repositorio desde GitHub
   - Vercel detectará automáticamente que es Next.js

4. **Configurar Variables de Entorno**
   ```
   NEXTAUTH_URL=https://tu-proyecto.vercel.app
   NEXTAUTH_SECRET=tu-secret-aqui
   GOOGLE_CLIENT_ID=tu-google-client-id
   GOOGLE_CLIENT_SECRET=tu-google-client-secret
   SUPABASE_URL=tu-supabase-url
   SUPABASE_ANON_KEY=tu-supabase-key
   ```

5. **Actualizar Google OAuth**
   - Agregar `https://tu-proyecto.vercel.app` a orígenes autorizados
   - Agregar `https://tu-proyecto.vercel.app/api/auth/callback/google` a URIs de redirección

## Opción 2: Exportación Estática (Limitada)

⚠️ **ADVERTENCIA**: Esta opción elimina funcionalidades del servidor como:
- Autenticación con NextAuth
- APIs del backend
- Funciones del servidor

### Solo si quieres una versión estática:

1. **Modificar next.config.js**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   
   module.exports = nextConfig
   ```

2. **Compilar para exportación**
   ```bash
   npm run build
   ```

3. **Subir carpeta 'out' a cPanel**
   - Se genera carpeta `out/` con archivos estáticos
   - Subir contenido de `out/` al directorio `public_html/`

## Opción 3: VPS con Node.js

Si tienes un VPS o servidor dedicado:

1. **Instalar Node.js 18+**
2. **Subir archivos del proyecto**
3. **Instalar dependencias**
   ```bash
   npm install --production
   ```
4. **Configurar variables de entorno**
5. **Iniciar aplicación**
   ```bash
   npm start
   ```
6. **Configurar proxy reverso (Nginx/Apache)**

## Recomendación Final

**Para Reevio, recomiendo usar Vercel** porque:
- ✅ Gratuito para proyectos personales
- ✅ Optimizado para Next.js
- ✅ Despliegue automático desde GitHub
- ✅ HTTPS incluido
- ✅ CDN global
- ✅ Soporte completo para todas las funcionalidades

## Archivos Preparados

- `reevio-production.zip` - Contiene el proyecto compilado
- Configuraciones de producción ya aplicadas
- Variables de entorno documentadas

¿Necesitas ayuda con alguna de estas opciones?
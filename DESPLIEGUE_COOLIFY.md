# Despliegue en Coolify - Reevio

## ¿Qué es Coolify?

Coolify es una plataforma de despliegue self-hosted que permite desplegar aplicaciones como Vercel/Netlify pero en tu propio servidor. Es **perfecta para aplicaciones Next.js** como Reevio.

## Ventajas de Coolify

✅ **Soporte completo para Next.js**
✅ **Despliegue automático desde Git**
✅ **Variables de entorno seguras**
✅ **SSL automático con Let's Encrypt**
✅ **Base de datos integrada (PostgreSQL, MySQL)**
✅ **Monitoreo y logs**
✅ **Backups automáticos**

## Requisitos Previos

- Servidor VPS (Ubuntu 20.04+ recomendado)
- Mínimo 2GB RAM, 20GB almacenamiento
- Dominio apuntando al servidor

## Instalación de Coolify

### 1. Preparar el Servidor

```bash
# Conectar al servidor via SSH
ssh root@tu-servidor.com

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker
```

### 2. Instalar Coolify

```bash
# Descargar e instalar Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

### 3. Acceder a Coolify

- Ve a `https://tu-servidor.com:8000`
- Completa la configuración inicial
- Crea tu cuenta de administrador

## Configuración del Proyecto Reevio

### 1. Crear Nuevo Proyecto

1. **En Coolify Dashboard:**
   - Click "New Project"
   - Nombre: "Reevio"
   - Descripción: "Plataforma de feedback"

### 2. Agregar Aplicación

1. **Configuración básica:**
   - Tipo: "Application"
   - Source: "Git Repository"
   - Repository: `https://github.com/simatecve/reevio.git`
   - Branch: `main`

2. **Build Settings:**
   - Build Pack: "Node.js"
   - Node Version: "18"
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Port: `3000`

### 3. Variables de Entorno

En la sección "Environment Variables" agregar:

```env
NEXTAUTH_URL=https://reevio.tu-dominio.com
NEXTAUTH_SECRET=tu-secret-super-seguro-aqui
NODE_ENV=production

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Supabase
SUPABASE_URL=tu-supabase-url
SUPABASE_ANON_KEY=tu-supabase-anon-key
```

### 4. Configurar Dominio

1. **En Coolify:**
   - Ve a "Domains"
   - Agregar: `reevio.tu-dominio.com`
   - Habilitar SSL automático

2. **En tu DNS:**
   - Crear registro A: `reevio` → IP del servidor

### 5. Base de Datos (Opcional)

Si quieres migrar de Supabase a PostgreSQL local:

1. **Crear servicio PostgreSQL:**
   - En Coolify: "New Service" → "PostgreSQL"
   - Configurar credenciales

2. **Actualizar variables de entorno:**
   ```env
   DATABASE_URL=postgresql://usuario:password@postgres:5432/reevio
   ```

## Despliegue

### 1. Primer Despliegue

1. Click "Deploy" en Coolify
2. Coolify automáticamente:
   - Clona el repositorio
   - Instala dependencias (`npm install`)
   - Ejecuta build (`npm run build`)
   - Inicia la aplicación (`npm start`)

### 2. Verificar Despliegue

- Ve a `https://reevio.tu-dominio.com`
- Verifica que cargue correctamente
- Prueba el login con Google

## Configuración Post-Despliegue

### 1. Actualizar Google OAuth

En Google Cloud Console:

**Orígenes autorizados:**
- `https://reevio.tu-dominio.com`

**URIs de redirección:**
- `https://reevio.tu-dominio.com/api/auth/callback/google`

### 2. Configurar Auto-Deploy

1. **En Coolify:**
   - Ve a "Git" → "Webhooks"
   - Copia la URL del webhook

2. **En GitHub:**
   - Settings → Webhooks → Add webhook
   - Pega la URL de Coolify
   - Eventos: "Push events"

Ahora cada push a `main` desplegará automáticamente.

## Monitoreo y Mantenimiento

### Logs
- En Coolify: "Logs" para ver logs en tiempo real
- Filtrar por errores, warnings, etc.

### Métricas
- CPU, RAM, almacenamiento
- Tiempo de respuesta
- Uptime

### Backups
- Configurar backups automáticos
- Incluir base de datos y archivos

## Comandos Útiles

```bash
# Ver logs de la aplicación
docker logs coolify-reevio

# Reiniciar aplicación
docker restart coolify-reevio

# Acceder al contenedor
docker exec -it coolify-reevio bash
```

## Solución de Problemas

### Error de Build
1. Verificar logs de build en Coolify
2. Comprobar que todas las dependencias estén en `package.json`
3. Verificar versión de Node.js

### Error de Variables de Entorno
1. Verificar que todas las variables estén configuradas
2. Reiniciar la aplicación después de cambios

### Error de SSL
1. Verificar que el dominio apunte correctamente
2. Esperar propagación DNS (hasta 24h)
3. Regenerar certificado SSL en Coolify

## Ventajas vs Otras Opciones

| Característica | Coolify | Vercel | cPanel |
|---|---|---|---|
| Next.js Support | ✅ Completo | ✅ Completo | ❌ No |
| Control Total | ✅ Sí | ❌ Limitado | ❌ No |
| Costo | 💰 Solo servidor | 💰 Gratis/Pago | 💰 Hosting |
| Base de Datos | ✅ Incluida | ❌ Externa | ✅ Incluida |
| SSL | ✅ Automático | ✅ Automático | ✅ Manual |

## Conclusión

**Coolify es ideal si:**
- Quieres control total sobre tu infraestructura
- Necesitas base de datos integrada
- Planeas escalar la aplicación
- Tienes experiencia con servidores

**El proyecto está listo** con `reevio-production.zip` que contiene todo lo necesario para el despliegue.
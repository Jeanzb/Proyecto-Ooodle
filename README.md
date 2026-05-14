# Ooodle Game

Juego numerico desarrollado con frontend en React y backend en Node.js.

## Tecnologias Utilizadas

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- TypeScript
- Hono
- Supabase

## Requisitos

Antes de instalar el proyecto necesitas tener instalado:

- Node.js >= 20
- npm

Puedes verificarlo con:

```bash
node -v
npm -v
```

## Instalacion

Clona el repositorio:

```bash
git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
cd TU-REPOSITORIO
```

Instala las dependencias del frontend:

```bash
cd frontend
npm install
```

Instala las dependencias del backend:

```bash
cd ../backend
npm install
```

## Variables de Entorno

Crea un archivo `.env` dentro de la carpeta `backend`:

```env
PORT=3000
SUPABASE_URL=TU_SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY=TU_SUPABASE_PUBLISHABLE_KEY
```

Ejemplo:

```env
PORT=3000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxx
```

## Ejecutar el Proyecto

Abre una terminal e inicia el backend:

```bash
cd backend
npm run dev
```

El backend correra en:

```txt
http://localhost:3000
```

Abre otra terminal e inicia el frontend:

```bash
cd frontend
npm run dev
```

El frontend correra en:

```txt
http://localhost:5173
```

## Build

Para compilar el frontend:

```bash
cd frontend
npm run build
```

Para compilar el backend:

```bash
cd backend
npm run build
```

## Comandos Utiles

Verificar TypeScript del frontend:

```bash
cd frontend
npm run check
```

Verificar TypeScript del backend:

```bash
cd backend
npm run check
```

Ejecutar lint del frontend:

```bash
cd frontend
npm run lint
```

## Guia de Deploy

El proyecto esta preparado para desplegarse como un servicio web de Node.js. El backend sirve el frontend compilado desde `frontend/dist`, por eso en produccion se debe construir primero el frontend y luego el backend.

### Deploy en Render

El repositorio incluye un archivo `render.yaml` con la configuracion base del servicio.

Pasos:

1. Sube el proyecto a GitHub.
2. Entra a Render.
3. Crea un nuevo servicio usando **Blueprint** o conecta el repositorio manualmente.
4. Si usas el `render.yaml`, Render tomara estos comandos:

```bash
npm --prefix frontend ci && npm --prefix frontend run build && npm --prefix backend ci && npm --prefix backend run build
```

Start command:

```bash
npm --prefix backend start
```

Health check:

```txt
/api/v1/health
```

### Variables en Render

Configura estas variables de entorno en el servicio:

```env
NODE_VERSION=20
SUPABASE_URL=TU_SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY=TU_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL=TU_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=TU_SUPABASE_PUBLISHABLE_KEY
```

### API en Produccion

La API usa versionamiento:

```txt
/api/v1
```

Ejemplo:

```txt
https://TU-DOMINIO.onrender.com/api/v1/health
```

### Probar el Deploy

Cuando Render termine el deploy, abre:

```txt
https://TU-DOMINIO.onrender.com
```

Y verifica la API:

```txt
https://TU-DOMINIO.onrender.com/api/v1/health
```

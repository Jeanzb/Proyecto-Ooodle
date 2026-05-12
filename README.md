
# Ooodle Game

Juego numérico desarrollado con frontend en React y backend en Node.js.

## Tecnologías Utilizadas

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

## Instalación

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

El backend correrá en:

```txt
http://localhost:3000
```

Abre otra terminal e inicia el frontend:

```bash
cd frontend
npm run dev
```

El frontend correrá en:

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

## Comandos Útiles

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
```

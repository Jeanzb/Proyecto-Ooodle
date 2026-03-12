# 🧮 Ooodle Universitario

Un juego web interactivo de deducción matemática inspirado en Wordle y Ooodle. El objetivo del jugador es adivinar la ecuación oculta del día en un máximo de 6 intentos, recibiendo retroalimentación visual (colores) basada en la precisión de los números y operadores ingresados.

Proyecto desarrollado bajo la metodología ágil **Scrum** y gestionado a través de **Jira**.

---

## 🚀 Tecnologías y Arquitectura

Este proyecto utiliza una arquitectura **Cliente-Servidor** estructurada en un Monorepo, utilizando un stack moderno:

### Frontend (Cliente)
* **React:** Librería principal para la construcción de interfaces de usuario.
* **Vite:** Entorno de desarrollo rápido y empaquetador.
* **Tailwind CSS (v3):** Framework de utilidades CSS para un diseño ágil y responsivo.

### Backend (Servidor)
* **Node.js & Express:** Entorno de ejecución y framework para la construcción de la API REST.
* **CORS:** Middleware para permitir la comunicación segura entre el cliente y el servidor en desarrollo.
* **Supabase (PostgreSQL):** Base de datos relacional para la gestión de usuarios, partidas y rankings *(Próxima implementación)*.

---

## 📁 Estructura del Proyecto

El repositorio está organizado como un Monorepo con dos carpetas principales:

```text
Proyecto-Ooodle/
├── backend/ # Código del servidor (Express, lógica matemática, endpoints)
├── frontend/ # Código del cliente (React, UI del tablero y teclado)
└── README.md # Documentación principal

🛠️ Instalación y Configuración Local
Para ejecutar este proyecto en tu máquina local, asegúrate de tener instalado Node.js y Git.
1. Clonar el repositorio
git clone [https://github.com/Jeanzb/Proyecto-Ooodle.git](https://github.com/Jeanzb/Proyecto-Ooodle.git)
cd Proyecto-Ooodle

2. Levantar el Backend
Abre una terminal, navega a la carpeta del servidor y arranca la API:
cd backend
npm install
npm run dev

El servidor estará escuchando en http://localhost:3000. Puedes verificar que funciona entrando a http://localhost:3000/api/status.
3. Levantar el Frontend
Abre una nueva terminal (dejando el backend corriendo), navega a la carpeta del cliente y arranca la interfaz web:
cd frontend
npm install
npm run dev

La aplicación web estará disponible en http://localhost:5173.



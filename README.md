# Budget Flow (React + TypeScript + Vite)

Frontend en React + TypeScript para gestionar presupuesto mensual y gastos usando la API de Google Apps Script.

## Caracteristicas
- Registro y login de usuario; token y user se guardan en localStorage.
- Rutas protegidas con react-router-dom y contexto de autenticacion.
- Pantallas de dashboard, configuracion de presupuesto y registro de gastos.
- Cliente API reutilizable (src/api/client.ts) usando la base URL configurada por env.
- Estilos basicos en src/styles/global.css listos para deploy en Vercel.

## Requisitos previos
- Node 18+
- npm (o pnpm/yarn si prefieres)

## Configuracion
1) Instalar dependencias
```bash
npm install
```
2) Crear un archivo `.env` en la raiz con la base URL de la API

3) Correr la app en desarrollo
```bash
npm run dev
```
4) Build listo para deploy (Vercel usa este comando)
```bash
npm run build
```

## Rutas principales
- `/login` y `/register`: auth via API (register/login).
- `/app/dashboard`: resumen de ingreso, ahorro, gastos fijos y variables.
- `/app/budget`: carga/edicion del presupuesto (periodo, ingreso, ahorro, gastos fijos).
- `/app/expenses`: listado de gastos y formulario de alta rapida.

## API integrada
Las llamadas usan el endpoint unico con acciones:
- POST action `register`, `login`, `saveBudget`, `addExpense`
- GET action `getBudget`, `getExpenses` (requiere token)

Token invalido redirige a login. Si no hay presupuesto cargado, el formulario se muestra vacio.

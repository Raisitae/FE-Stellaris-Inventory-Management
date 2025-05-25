# Sistema de Gestión de Inventario Stellaris

Un sistema moderno de gestión de inventario construido con React, TypeScript y TanStack Router.

## Características

- 🔐 Autenticación (Inicio de sesión/Registro)
- 📦 Gestión de Productos
- 📊 Informes y Seguimiento de Ventas
- 🔄 Sistema de Respaldo
- 🌐 Soporte para Internacionalización (i18n)

## Stack Tecnológico

- React
- TypeScript
- TanStack Router
- TanStack Query (React Query)
- Tailwind CSS
- i18next

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
│   ├── layouts/   # Componentes de diseño
│   ├── ui/        # Componentes de UI
│   └── ...        # Componentes de funcionalidad
├── routes/        # Rutas de la aplicación
├── lib/           # Funciones de utilidad
├── hooks/         # Hooks personalizados
├── context/       # Contexto de React
├── queries/       # Consultas a API
└── utils/         # Funciones auxiliares
```

## Comenzando

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la construcción

## Internacionalización

La aplicación soporta múltiples idiomas. Actualmente disponibles:
- Inglés
- Español

## Contribuir

1. Haz un fork del repositorio
2. Crea tu rama de características
3. Haz commit de tus cambios
4. Push a la rama
5. Crea un Pull Request 
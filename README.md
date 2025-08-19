# Ualá - Web Developer Challenge

## 📋 Descripción

Aplicación web para gestión de transacciones y métricas financieras, desarrollada como parte del desafío técnico de Ualá. La aplicación permite a los usuarios visualizar, filtrar y descargar transacciones financieras con una interfaz moderna y responsive.

## 🚀 Instalación y Ejecución

### Prerrequisitos

- **Node.js**: Versión 18.17 o superior
- **pnpm**: Versión 8.0 o superior (recomendado) o npm 9.0+
- **Git**: Para clonar el repositorio

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd uala
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno** (si es necesario)
   ```bash
   cp .env.example .env.local
   # Editar .env.local con las configuraciones necesarias
   ```

### Scripts Disponibles

#### Desarrollo

```bash
pnpm dev          # Inicia el servidor de desarrollo con Turbopack
pnpm build        # Construye la aplicación para producción
pnpm start        # Inicia la aplicación en modo producción
pnpm lint         # Ejecuta el linter de ESLint
```

#### Testing

```bash
pnpm test         # Ejecuta todos los tests
pnpm test:watch   # Ejecuta tests en modo watch
pnpm test:coverage # Ejecuta tests con reporte de coverage
```

### Ejecutar la Aplicación

1. **Modo desarrollo**

   ```bash
   pnpm dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

2. **Modo producción**
   ```bash
   pnpm build
   pnpm start
   ```

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
uala/
├── app/                    # App Router de Next.js 15
│   ├── api/               # API Routes
│   │   ├── me/           # Endpoints del usuario
│   │   └── transactions/  # Endpoints de transacciones
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── src/
│   ├── components/        # Componentes React
│   │   ├── cross/        # Componentes de layout (navbar, sidebar)
│   │   ├── icons/        # Iconos SVG personalizados
│   │   ├── transactions-page/ # Componentes específicos de transacciones
│   │   └── shadcn/       # Componentes de UI (Radix UI + Tailwind)
│   ├── constants/         # Constantes de la aplicación
│   ├── contexts/          # Contextos de React
│   ├── hooks/             # Custom hooks
│   ├── types/             # Definiciones de TypeScript
│   └── utils/             # Utilidades y helpers
├── __tests__/             # Tests organizados por estructura
└── public/                # Archivos estáticos
```

### Patrón de Arquitectura

La aplicación sigue una **arquitectura por capas** con separación clara de responsabilidades:

- **Presentación**: Componentes React con Tailwind CSS
- **Lógica de Negocio**: Custom hooks y utilidades
- **Datos**: API Routes y SWR para manejo de estado
- **Tipado**: TypeScript para type safety

### Tecnologías Principales

- **Frontend**: Next.js 15 (App Router), React 19
- **Lenguaje**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI (accesibilidad + composición)
- **Estado**: SWR para data fetching y cache
- **Formularios**: React Hook Form + Zod para validación
- **Testing**: Jest + Testing Library
- **Package Manager**: pnpm

## 🔧 Decisiones Técnicas

### 1. **Next.js 15 con App Router**

- **Razón**: Última versión estable con mejoras de rendimiento y App Router
- **Beneficios**: File-based routing, Server Components, mejor SEO
- **Turbopack**: Habilita desarrollo más rápido

### 2. **TypeScript Estricto**

- **Configuración**: `strict: true` en tsconfig
- **Beneficios**: Type safety, mejor DX, detección temprana de errores
- **Paths**: Alias `@/*` para imports más limpios

### 3. **Radix UI + Tailwind CSS**

- **Radix UI**: Componentes accesibles y sin estilos predefinidos
- **Tailwind**: Utility-first CSS para desarrollo rápido y consistente
- **Combinación**: Máxima flexibilidad + accesibilidad nativa

### 4. **SWR para Data Fetching**

- **Razón**: Cache automático, revalidación, optimistic updates
- **Alternativas consideradas**: React Query, Zustand
- **Decisión**: SWR es más ligero y perfecto para este caso de uso

### 5. **React Hook Form + Zod**

- **React Hook Form**: Performance superior, menos re-renders
- **Zod**: Validación de esquemas con TypeScript
- **Integración**: `@hookform/resolvers` para resolver automático

### 6. **Testing con Jest + Testing Library**

- **Jest**: Framework de testing estándar
- **Testing Library**: Testing centrado en comportamiento del usuario
- **Coverage**: Mínimo 70% en branches, functions, lines y statements

### 7. **Estructura de Tests**

- **Organización**: Tests paralelos a la estructura del código
- **Naming**: `.test.ts` para archivos de test
- **Setup**: Jest configurado para Next.js y TypeScript

### Ejecutar Tests Específicos

```bash
# Tests de un archivo específico
pnpm test __tests__/app/api/me/route.test.ts

# Tests de un directorio
pnpm test __tests__/src/components/
```

## 🎯 Características Implementadas

### Funcionalidades Principales

- ✅ Dashboard de transacciones con métricas
- ✅ Sistema de filtros avanzado (fechas, montos, métodos de pago)
- ✅ Descarga de transacciones en CSV
- ✅ Layout responsive (desktop y mobile)
- ✅ Navegación con sidebar y navbar
- ✅ Persistencia de filtros en URL

### Componentes de UI

- ✅ Sidebar colapsible
- ✅ Navbar responsive
- ✅ Modal de descarga
- ✅ Filtros con validación
- ✅ Tabs para diferentes vistas
- ✅ Sistema de notificaciones

## 🚀 Posibles Mejoras a Futuro

- Mejorar la calidad de los tests sumando tests más integrales o tests e2e con Cypress.
- Mejorar la calidad de las validaciones de formularios en el cliente y servidor usando zod
- Sumar una paginación para el listado de transacciones
- Limitar al cantidad de rows para descargar
- Sumar métricas para medir el comportamiento
- Integrar i18n para multilenguaje

## 🤝 Contribución

### Estándares de Código

- **ESLint**: Configuración Next.js con reglas estrictas
- **Prettier**: Formateo automático de código
- **Husky**: Git hooks para pre-commit
- **Conventional Commits**: Estándar para mensajes de commit

### Flujo de Trabajo

1. Crear feature branch desde `main`
2. Implementar cambios con tests
3. Asegurar coverage mínimo del 70%
4. Crear Pull Request con descripción detallada
5. Code review y merge

## 📝 Licencia

Este proyecto es parte del desafío técnico de Ualá y está destinado únicamente para fines de evaluación.

---

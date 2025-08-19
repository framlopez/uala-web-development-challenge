# Uala

## Descripción

Aplicación web para gestión de transacciones y métricas financieras.

## Instalación

```bash
pnpm install
```

## Scripts disponibles

### Desarrollo

```bash
pnpm dev          # Inicia el servidor de desarrollo
pnpm build        # Construye la aplicación para producción
pnpm start        # Inicia la aplicación en modo producción
pnpm lint         # Ejecuta el linter
```

### Testing

```bash
pnpm test         # Ejecuta todos los tests
pnpm test:watch   # Ejecuta tests en modo watch
pnpm test:coverage # Ejecuta tests con reporte de coverage
```

## Cobertura de Tests

Actualmente tenemos **100% de coverage** en el archivo `app/api/me/route.ts`, que incluye:

- ✅ **Statements**: 100%
- ✅ **Branches**: 100%
- ✅ **Functions**: 100%
- ✅ **Lines**: 100%

### Estructura de Tests

Los tests están organizados en el directorio `__tests__/` siguiendo la estructura del proyecto:

```
__tests__/
└── app/
    └── api/
        └── me/
            └── route.test.ts
```

### Ejecutar Tests Específicos

Para ejecutar tests de un archivo específico:

```bash
pnpm test __tests__/app/api/me/route.test.ts
```

## Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Testing**: Jest, Testing Library
- **Package Manager**: pnpm

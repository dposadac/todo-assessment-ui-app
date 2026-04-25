# Todo Assessment App

Aplicación de gestión de tareas (To-Do) construida con **Ionic 7 + Angular 18 + Capacitor 6**, siguiendo principios de **Clean Architecture**. Disponible como app web, Android e iOS.

## Tecnologías

| Herramienta | Versión |
|---|---|
| Angular | ^18.2 |
| Ionic Framework | ^7.8 |
| Capacitor | ^6.2 |
| Node.js | ^20.x (LTS) |
| TypeScript | ~5.5 |

## Arquitectura

El proyecto sigue **Clean Architecture** en tres capas:

```
src/app/
├── core/                        # Lógica pura (independiente de Ionic)
│   ├── domain/
│   │   ├── entities/            # Todo (id, title, completed, createdAt)
│   │   └── repositories/        # Contrato abstracto TodoRepository
│   └── usecases/                # CreateTodo, GetTodos, UpdateTodo, DeleteTodo
├── data/
│   └── repositories/            # LocalStorageTodoRepository (implementación)
└── presentation/
    ├── components/todo-item/     # Componente standalone de ítem
    └── pages/todo-list/          # Página principal con Signals
```

**Decisiones de diseño:**
- Componentes **standalone** con imports explícitos de Ionic.
- Estado con **Signals** de Angular (`signal<Todo[]>([])`).
- Inyección de dependencias con `inject()` (no constructor).
- Persistencia vía **localStorage** (swappable por cualquier backend).

## Requisitos previos

- Node.js 20 LTS
- npm 10+
- Angular CLI: `npm install -g @angular/cli`
- Ionic CLI: `npm install -g @ionic/cli`
- Android Studio (para builds Android)
- Xcode (para builds iOS — solo macOS)

## Instalación

```bash
npm install
```

## Scripts disponibles

### Desarrollo web

```bash
npm start              # Servidor dev en http://localhost:4200
npm run build          # Build de desarrollo
npm run build:prod     # Build de producción
npm run watch          # Build en modo watch
```

### Calidad de código

```bash
npm run lint           # ESLint
npm test               # Unit tests con Karma + Jasmine
npm run format         # Formatea con Prettier
npm run format:check   # Verifica formato sin modificar
```

### Capacitor — Mobile (recomendado)

```bash
# Primera vez: agregar plataformas
npm run cap:add:android
npm run cap:add:ios

# Sincronizar web → nativo tras cada build
npm run cap:sync

# Build completo + abrir IDE nativo
npm run build:android   # Abre Android Studio
npm run build:ios       # Abre Xcode

# Ejecutar directamente en dispositivo/emulador
npm run cap:run:android
npm run cap:run:ios
```

### Cordova (alternativo)

> Requiere `ionic` CLI global instalado.

```bash
npm run cordova:build:android        # Build debug Android
npm run cordova:build:android:prod   # Build producción Android
npm run cordova:build:ios            # Build debug iOS
npm run cordova:build:ios:prod       # Build producción iOS
npm run cordova:run:android          # Ejecuta en dispositivo Android
npm run cordova:run:ios              # Ejecuta en dispositivo iOS
```

## Flujo de build móvil (Capacitor)

```
ng build --configuration production
        ↓
npx cap sync [android|ios]
        ↓
Android Studio / Xcode
        ↓
APK / IPA
```

## CI/CD — GitHub Actions

El pipeline (`.github/workflows/ci.yml`) se ejecuta en cada push a `main`/`develop` y en PRs:

| Job | Condición | Acción |
|---|---|---|
| **Lint** | Siempre | `npm run lint` |
| **Unit Tests** | Siempre | Karma + ChromeHeadless + cobertura |
| **Build** | Tras lint y tests | `npm run build` + artifact `dist/` (7 días) |

## Estructura de entidad principal

```typescript
interface Todo {
  id: string;        // UUID generado con crypto.randomUUID()
  title: string;
  completed: boolean;
  createdAt: Date;
}
```

## Casos de uso

| Use Case | Descripción |
|---|---|
| `GetTodosUseCase` | Obtiene todas las tareas del repositorio |
| `CreateTodoUseCase` | Crea una nueva tarea con UUID y fecha |
| `UpdateTodoUseCase` | Actualiza el estado de una tarea existente |
| `DeleteTodoUseCase` | Elimina una tarea por su ID |

# Guía de Desarrollo: Ionic LTS + Capacitor

## 🛠 Versiones de Referencia (LTS)
- **Ionic Framework:** ^7.0.0+ (LTS)
- **Capacitor:** ^6.0.0 (Última versión estable)
- **Node.js:** ^20.x (LTS - Iron)
- **Angular:** ^18.x / ^19.x (Dependiendo de la estabilidad deseada)

## 🏗 Comandos de Construcción
- **Instalar:** `npm install`
- **Build Web:** `npm run build`
- **Sincronizar Nativos:** `npx cap sync`
- **Abrir Android Studio:** `npx cap open android`
- **Abrir Xcode:** `npx cap open ios`

## 📐 Estructura Clean Architecture
- `src/app/core`: Lógica pura, Entidades y Casos de Uso (Independiente de Ionic).
- `src/app/data`: Implementaciones de Repositorios, APIs y Mappers.
- `src/app/presentation`: Componentes de UI, Páginas y Signals.

## 🚨 Reglas de Estilo (Code Style)
- **Indentación:** 2 espacios.
- **Strict Mode:** TypeScript en modo estricto siempre.
- **Inyección:** Priorizar el uso de la función `inject()` de Angular sobre el constructor.
- **Componentes:** Standalone components por defecto.
- ESLint & Prettier: Configurados para mantener la consistencia del código.

## Generación de README.md (Documentación del Proyecto)

## CI/CD (GitHub Actions)
- El proyecto incluye un flujo automatizado en .github/workflows/:
- Linting: Valida el estilo de código estándar de Ionic.
- Build: Comprueba que la compilación sea exitosa.
- Artifacts: Genera los archivos necesarios para la distribución en tiendas.
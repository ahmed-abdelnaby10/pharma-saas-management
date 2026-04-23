# Project: SaaS Pharmacy Frontend

## Stack

- React
- Vite
- TypeScript
- Feature-based frontend architecture
- Backend API: Express + TypeScript + Prisma + PostgreSQL + Redis
- Desktop target: Tauri

## Primary Goal

Maintain one shared frontend codebase that works as:

1. a web application
2. a desktop application

Do not rebuild the app from scratch.
Do not duplicate screens, routes, pages, or feature logic for desktop unless absolutely required.

## Architecture Rules

- Preserve the existing feature-based structure
- Keep shared business logic usable in both web and desktop
- Keep desktop-specific logic isolated in a dedicated layer
- Preferred locations for desktop-specific code:
  - `src/desktop/`
  - or `src/platform/desktop/`
- Keep platform detection centralized
- Avoid scattering platform checks across the app

## Shared vs Desktop-specific Rules

### Shared

These should remain shared between web and desktop:

- routes
- pages
- features
- forms
- API client
- auth flow
- state management
- i18n
- validation
- reusable UI components

### Desktop-specific

These should be isolated behind adapters/services:

- receipt printing
- barcode scanner integration
- cash drawer integration
- filesystem access
- native shell capabilities
- local desktop persistence if needed later

## Desktop Shell Rules

- Use Tauri as the desktop shell by default
- Do not switch to Electron unless there is a clear technical reason visible in the repo requirements
- Keep Tauri integration thin and clean
- Do not implement advanced native integrations during shell setup
- Keep the web build working at all times

## Code Quality Rules

- Keep components readable and small
- Prefer composition over huge components
- Keep feature boundaries clean
- Do not introduce desktop logic into unrelated feature modules
- Prefer service/adaptor abstraction for hardware integrations
- Avoid hidden globals
- Keep configuration explicit

## Directory Expectations

The repo should support a structure similar to:

```txt
src/
  app/
  pages/
  features/
  entities/
  shared/
  desktop/
    platform/
    printer/
    scanner/
    cash-drawer/
```

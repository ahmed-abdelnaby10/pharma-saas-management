# Desktop Shell Setup (Tauri v2)

The app runs as both a web application and a native desktop application from the same codebase. Tauri v2 is used as the desktop shell.

---

## Prerequisites

Install these once on the machine — they are not managed by pnpm.

### 1. Rust toolchain

```bash
# Install rustup (the Rust toolchain manager)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# On Windows use the installer from https://rustup.rs
```

After installing, restart your terminal and verify:

```bash
rustc --version
cargo --version
```

### 2. System WebView (Windows)

WebView2 ships pre-installed on Windows 10 (1803+) and Windows 11. If it is missing (e.g. a stripped LTSC build), download and install it from:
https://developer.microsoft.com/en-us/microsoft-edge/webview2/

### 3. C++ build tools (Windows)

Required by the Rust toolchain. Install via:

```
Visual Studio Build Tools → "Desktop development with C++"
```

Or install the full Visual Studio Community edition.

---

## Install JS dependencies

```bash
pnpm install
```

This installs `@tauri-apps/cli` (the `tauri` command) and `@tauri-apps/api` (JS bindings).

---

## Development

| Goal | Command |
|------|---------|
| Web dev server | `pnpm dev` |
| Desktop dev (Tauri + Vite) | `pnpm dev:desktop` |

`pnpm dev:desktop` starts the Vite dev server automatically, then opens a native window pointed at `http://localhost:5173`. Hot-module replacement works the same as in the browser.

---

## Building

| Goal | Command |
|------|---------|
| Web production build | `pnpm build:web` |
| Desktop installer | `pnpm build:desktop` |

`pnpm build:desktop` runs `pnpm build:web` first (produces `dist/`), then Tauri bundles a platform-native installer into `src-tauri/target/release/bundle/`.

---

## Icons

Tauri requires icon files in `src-tauri/icons/` before a production build succeeds. Generate all sizes from a single 1024×1024 PNG:

```bash
pnpm tauri icon path/to/your-icon-1024.png
```

This writes `32x32.png`, `128x128.png`, `128x128@2x.png`, `icon.icns`, and `icon.ico` into `src-tauri/icons/` automatically.

Icons are not required for `pnpm dev:desktop`.

---

## Architecture

```
src/
  desktop/          ← platform abstraction layer
    platform/
      index.ts      ← isDesktop(), isWeb(), platform constant
    index.ts        ← barrel export

src-tauri/          ← Rust/Tauri shell (no business logic here)
  src/
    main.rs         ← binary entry point
    lib.rs          ← Tauri builder
  capabilities/
    default.json    ← permission grants (core:default only)
  tauri.conf.json   ← app config, window size, bundle targets
  Cargo.toml        ← Rust crate manifest
  build.rs          ← Tauri build script
```

### Detecting the platform in frontend code

```typescript
import { isDesktop, isWeb, platform } from '@/desktop';

if (isDesktop()) {
  // tauri-specific path
}
```

### Adding a desktop-only feature

Keep all hardware integrations behind an adapter in `src/desktop/`:

```
src/desktop/
  printer/        ← receipt printing adapter
  scanner/        ← barcode scanner adapter
  cash-drawer/    ← cash drawer adapter
```

Never import from `@tauri-apps/api` directly in feature modules. Always go through the adapter in `src/desktop/`.

---

## Route / Bootstrap Behaviour

### Platform split

| Route group | Web | Desktop |
|-------------|-----|---------|
| `/` `/home` `/features` `/pricing` `/download` `/contact` | ✓ | ✗ |
| `/signup` | ✓ | ✗ |
| Legacy redirects (`/medicines` → `/app/medicines`, etc.) | ✓ | ✗ |
| `/login` | ✓ | ✓ |
| `/app/*` (tenant dashboard) | ✓ | ✓ |
| `/admin/*` (SaaS backoffice) | ✓ | ✗ |

### Desktop startup sequence

```
App opens
  └─ isAuthenticated()?
       ├─ no  → initial entry = /login  → LoginPage renders
       └─ yes → initial entry = /app    → DashboardPage renders
```

`isAuthenticated()` reads the access-token cookie and checks expiry synchronously — no async flash or redirect needed.

### Router implementation

```
src/app/router/
  routes.tsx       — all route definitions, grouped by platform scope
  web-router.ts    — createBrowserRouter([public + login + signup + legacy + client + admin])
  desktop-router.ts — createMemoryRouter([login + client], { initialEntries })
  index.tsx        — exports: isDesktop() ? desktopRouter : webRouter
```

Web uses `createBrowserRouter` (real URL bar, deep-linking, legacy redirects).
Desktop uses `createMemoryRouter` (no real URL bar in Tauri, controlled initial location).

### Admin routes and desktop

`/admin/*` is the **SaaS platform backoffice** (tenants, plans, subscriptions, system metrics). It is for the SaaS operator, not for pharmacy staff. It is excluded from desktop intentionally. If a super-admin ever needs desktop access to `/admin`, add `adminRoute` to `desktop-router.ts`.

---

## What is NOT in this shell

The following are explicitly deferred and should be added as isolated adapters when needed:

- Receipt printing
- Barcode scanner integration
- Cash drawer control
- Filesystem access
- Native notifications
- System tray

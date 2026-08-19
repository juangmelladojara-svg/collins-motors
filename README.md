# Collins Motors — Rediseño web + portal admin

> Sitio de venta de vehículos usados con búsqueda rápida y portal admin para el encargado.

## Setup inicial

```bash
# 1. Copiar .env.example a .env.local y completar con tus credenciales de Supabase
cp .env.example .env.local

# 2. Ejecutar en desarrollo
npm run dev
```

Luego abre http://localhost:3000

## Estructura del proyecto

```
src/
├─ app/                    Rutas Next.js (pages)
├─ components/
│  ├─ layout/              Navbar, Footer
│  ├─ home/                Hero, sección destacados, valor marca
│  ├─ catalogo/            Filtros, buscador, grilla, tarjeta vehículo
│  ├─ vehiculo/            Galería, ficha info, botón WhatsApp
│  ├─ admin/               Portal admin (formulario, subida imágenes, tabla)
│  └─ ui/                  Componentes compartidos
├─ lib/
│  ├─ supabase/            Clientes de Supabase (client, server, admin, middleware)
│  └─ vehiculos/           Queries, tipos, constantes, slug
└─ proxy.ts                Protección de rutas /admin
supabase/migrations/       SQL de schema (0001_init, 0002_mensajes, 0003_indices)
scripts/                   shots.mjs para QA visual
```

## Stack

- **React 19** + **Next.js 16** (App Router, `src/` directory)
- **Tailwind CSS v4** (CSS-first: `@import "tailwindcss"`)
- **Supabase** (auth, base de datos, storage)
- **GSAP 3** + ScrollTrigger (animaciones)
- **Lucide Icons** (iconografía)
- **@dnd-kit** (drag & drop de imágenes en admin)

## Fases

- **Fase 0** ✅ Setup base (create-next-app, dependencias, estructura)
- **Fase 1** → Diseño visual con mocks (Home, catálogo con filtros, fichas, contacto)
- **Fase 2** → Backend real (Supabase, migraciones, queries server-side)
- **Fase 3** → Portal admin (login, CRUD de vehículos, subida de imágenes)
- **Fase 4** → SEO, integración final, deploy en Vercel

## Convenciones del workspace

- Textos en **español**.
- Precisión "1:1 Pixel Perfect": cada scroll es intencional, cada animación tiene peso.
- Animaciones con `gsap.context()` en `useEffect`, `power3.out` para entradas.
- Stack por defecto: React 19, Tailwind v4, GSAP, Lucide.

## Recursos

- Plan completo: `~/.claude/plans/whimsical-sleeping-lemur.md`
- Instrucciones del workspace: `../CLAUDE.md`
- Patrón de referencia: `../contabilidad-maria/portal-contable/`

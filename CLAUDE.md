# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

Early-stage Next.js app scaffolded from `create-next-app`, with shadcn/ui added. `app/page.tsx` is still the template page; there is no app-specific logic yet.

## Commands

- `npm run dev` — dev server on **port 3002** (not 3000, despite what the README says)
- `npm run build` / `npm run start` (start also uses port 3002)
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`, `eslint-config-next`)
- Type-check: `npx tsc --noEmit`

No test framework is configured.

## Stack notes

- **Next.js 16 / React 19, App Router only** (`app/`). Per AGENTS.md, check `node_modules/next/dist/docs/` before using Next APIs — e.g. layouts use the globally-available `LayoutProps<"/">` type helper rather than hand-written prop types.
- **Tailwind CSS v4**: no `tailwind.config.*`. Theme tokens, the `dark` custom variant, and shadcn CSS variables all live in `app/globals.css` (`@theme inline` + `:root`/`.dark` blocks). Add new design tokens there.
- **shadcn/ui, `base-nova` style**: components are built on `@base-ui/react` primitives, not Radix. Add components with `npx shadcn@latest add <name>`; they land in `components/ui/`. A project-local `shadcn` skill is installed (`.claude/skills`, tracked in `skills-lock.json`) — use it for shadcn work.
- **`cn` helper** comes from the npm package `cn` (re-exported by `lib/utils.ts`), not the usual `clsx` + `tailwind-merge` combo. Import via `@/lib/utils`.
- Path alias `@/*` maps to the repo root.
- Fonts: `next/font/google` in `app/layout.tsx`; `--font-sans` is Inter, `--font-mono` is Geist Mono.

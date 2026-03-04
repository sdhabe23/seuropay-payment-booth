# Copilot Instructions

This is **SeuroPay Payment Booth** — a React + TypeScript + Vite POS terminal UI.

## Stack
- React 19 + TypeScript (strict, `verbatimModuleSyntax`)
- Vite 7
- CSS Modules for all component styles

## Key Conventions
- Use `type` imports for TypeScript types (`import type { Foo } from ...`)
- Currency: **Euro only** — always use `formatEuro()` from `src/utils/currency.ts`
- All font sizes use `clamp()` for fluid scaling across screen sizes
- Layout uses CSS Grid with `height: 100vh` on the root; never use fixed pixel heights for the main layout
- The order list must remain scrollable while payment options stay fixed/sticky
- Orders are randomised via `generateRandomOrder()` from `src/data/products.ts`

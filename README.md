# SeuroPay — Payment Booth

A full-screen Point-of-Sale (POS) payment gateway UI built with **React + TypeScript + Vite**.

## Features

- 🇪🇺 **Euro-only currency** with German locale formatting (`€1.234,56`)
- 🛒 **Randomised orders** — items & totals change on every new order
- 📜 **Scrollable item list** — the order panel scrolls while payment options stay fixed
- 💳 **Three payment methods** — Card (Chip/PIN), Contactless (NFC/Apple Pay), QR Code
- ✅ **Payment flow** — Processing → Approved / Declined states with animations
- 📺 **Large-screen optimised** — fluid `clamp()` sizing for POS booth displays
- 📐 **Aspect-ratio flexible** — CSS Grid layout adapts to any screen ratio

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── TopBar.tsx / .module.css       # Store header with live clock
│   ├── OrderSummary.tsx / .module.css # Scrollable item list + totals
│   └── PaymentPanel.tsx / .module.css # Payment method selection + flow
├── data/
│   └── products.ts                    # Product catalogue & order generator
├── utils/
│   └── currency.ts                    # Euro formatting & tax calculations
├── App.tsx / App.css                  # Root POS layout
└── index.css                          # Global reset & base styles
```

## Currency

All amounts are in **Euro (EUR)** formatted via `Intl.NumberFormat` with `de-DE` locale.  
VAT is 24% (standard Estonian VAT rate), shown separately on the receipt.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

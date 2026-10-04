# Genshin Impact Wiki & Tracker

A React + TypeScript + Vite site for browsing Genshin Impact characters and tracking
progress. Built with Tailwind CSS 4, ESLint 10, and Prettier.

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start dev server at http://localhost:5173
```

## Scripts

| Script               | What it does                                     |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Dev server with hot module replacement            |
| `npm run build`      | Typecheck (`tsc -b`) then build to `dist/`        |
| `npm run preview`    | Serve the production build locally               |
| `npm run typecheck`  | TypeScript only, no emit                         |
| `npm run lint`       | ESLint over the project                          |
| `npm run lint:fix`   | ESLint with `--fix`                              |
| `npm run format`     | Prettier write                                   |
| `npm run format:check` | Prettier check (CI-friendly)                   |

## Stack

- **React 19** + **TypeScript 6**
- **Vite 8** (bundler / dev server)
- **Tailwind CSS 4** via `@tailwindcss/vite` — no `tailwind.config.js`, theming is
  declared with `@theme` in `src/index.css`
- **ESLint 10** flat config (`eslint.config.js`) with `typescript-eslint`,
  `react-hooks`, `react-refresh`, and `jsx-a11y`
- **Prettier 3** with `prettier-plugin-tailwindcss` for class sorting

## Editor setup

`.vscode/extensions.json` recommends the extensions this project expects, and
`.vscode/settings.json` wires them together. Note the split of responsibility:

- **Prettier** owns formatting (`editor.formatOnSave`)
- **ESLint** owns lint fixes only — `source.fixAll.eslint` is set to `explicitOnly`
  so the two never fight over whitespace

Both are configured as workspace settings, so the project behaves the same for
everyone who clones it.

## Known quirks

- **`.npmrc` sets `legacy-peer-deps=true`.** `eslint-plugin-jsx-a11y@6.10.2`
  declares a peer range of `eslint@^3 || ... || ^9`, but the project runs ESLint 10.
  The plugin works; it just hasn't widened its declared range yet. Remove the line
  once it does.
- **`npm` vs `npm.cmd` in PowerShell.** If your PowerShell execution policy blocks
  `.ps1` scripts, use `npm.cmd`, or just work in Git Bash where `npm` is fine.
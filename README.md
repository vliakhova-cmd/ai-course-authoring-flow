# AI Course Authoring Flow

A React + TypeScript prototype UI for an AI-assisted course authoring experience: a content library screen with a launcher for a multi-step "compose → thinking → result" flow that turns a source document into generated course slides.

## Structure

- `src/ContentLibraryLauncher.tsx` — top-level content library screen (entry point, rendered by `src/main.tsx`)
- `src/AICourseAuthoringFlow.tsx` — the modal authoring flow (compose / thinking / result stages)
- `src/ComposeStep.tsx`, `src/ThinkingStep.tsx`, `src/ResultStep.tsx` — the three flow stages
- `src/appShell/` — shared app chrome (top header bar, left icon nav, resizable content tree)
- `src/mockData.ts`, `src/contentLibraryData.ts`, `src/appShell/treeData.ts` — mock data driving the prototype
- `src/assets/` — images and icons used by the prototype

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build; `npm run lint` runs ESLint.

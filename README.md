# The Wealth Modeler

A Next.js + TypeScript web app providing free calculators for compound interest, FIRE (Financial Independence, Retire Early), and retirement planning. The project focuses on clear math, responsive design, and an approachable user experience.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open http://localhost:3000 to use the calculators.

## Key Features

- **Compound Interest Calculator** with yearly breakdowns and growth charts.
- **FIRE Calculator** showing FIRE number, years to independence, progress bar, and Coast/Barista FIRE scenarios.
- **Retirement Calculator** projecting retirement balance, income, and a slider to adjust retirement age interactively.
- Shared components (Navbar, Footer, InputField, ResultsDisplay, Chart) for a cohesive UI.
- Tailwind CSS styling with gradients, shadows, and responsive layouts.

## Tech Stack

- Next.js (App Router) with TypeScript
- Tailwind CSS for styling
- Chart.js + react-chartjs-2 for visualizations
- react-hook-form for validation

## Project Structure

```
/src
  /app
    layout.tsx
    page.tsx
    /about
    /calculators
      /compound-interest
      /fire
      /retirement
  /components
  /lib
  /types
```

## Deployment

The app is ready for deployment to platforms like Vercel. Configure the repository, run a production build with `npm run build`, and connect your domain (e.g., thewealthmodeler.com) through your hosting provider.

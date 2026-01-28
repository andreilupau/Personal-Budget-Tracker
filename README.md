# Personal Budget Tracker (React + Vite)

A simple single-page budget tracking app where you can add **expenses** and **income**, see your **total balance**, and browse your transactions.

## Features

- Add transactions: type (expense/income), title, amount, date
- Automatic total calculation (income − expenses)
- Delete transactions from the list
- **Light/Dark** theme toggle
- Browser persistence (localStorage) — no backend

## Tech Stack

- React + Vite
- ESLint
- Persistence: localStorage (via the `useLocalStorageState` hook)

## Requirements

- Node.js 18/20/22 LTS (recommended)
- npm

## Run Locally

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run preview
npm run lint
```

## Stored Data (localStorage)

The app automatically saves:

- transactions under the `bt.transactions.v1` key
- theme under the `bt.theme.v1` key

To reset the app, delete these keys in DevTools → Application → Local Storage.

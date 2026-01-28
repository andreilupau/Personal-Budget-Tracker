# Personal Budget Tracker (React + Vite)

A simple single-page budget tracking app where you can add **expenses** and **income**, see your **total balance**, and browse your transactions.

<img width="1919" height="895" alt="Screenshot 2026-01-28 231339" src="https://github.com/user-attachments/assets/faeacb51-2a37-4816-9db0-f27f8d785fe8" />
<img width="1919" height="906" alt="Screenshot 2026-01-28 231241" src="https://github.com/user-attachments/assets/db564deb-627a-4235-b305-a8fa22a01b97" />

## Features

- Add transactions: type (expense/income), title, amount, date
- Automatic total calculation (income − expenses)
- Delete transactions from the list
- **Light/Dark** theme toggle
- Browser persistence (localStorage) — no backend yet

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

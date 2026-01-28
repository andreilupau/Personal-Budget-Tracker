# Personal Budget Tracker (React + Vite)

Aplicație simplă de urmărire a bugetului (single-page), în care poți adăuga **cheltuieli** și **venituri**, vezi **totalul** și lista de tranzacții.

## Funcționalități

- Adaugi tranzacții: tip (cheltuială/venit), titlu, sumă, dată
- Total calculat automat (venituri − cheltuieli)
- Ștergere tranzacție din listă
- Temă **light/dark**
- Persistență în browser (localStorage) — fără backend

## Tehnologii

- React + Vite
- ESLint
- Persistență: localStorage (prin hook-ul `useLocalStorageState`)

## Cerințe

- Node.js 18/20/22 LTS (recomandat)
- npm

## Rulare locală

```bash
npm install
npm run dev
```

Alte comenzi utile:

```bash
npm run build
npm run preview
npm run lint
```

## Date salvate (localStorage)

Aplicația salvează automat:

- tranzacțiile în cheia `bt.transactions.v1`
- tema în cheia `bt.theme.v1`

Ca să resetezi aplicația, șterge aceste chei din DevTools → Application → Local Storage.

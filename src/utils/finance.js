// Formatează un număr ca bani folosind Intl.NumberFormat.
// Dacă `amount` nu e valid, folosește 0.
export function formatMoney(amount, currency = "USD") {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(safe);
}

// Transformă o dată (Date/string) în format ISO pentru input type="date": YYYY-MM-DD.
export function isoDate(date = new Date()) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Returnează prima zi din luna datei primite (la 00:00).
function startOfMonth(dateLike) {
  const d = new Date(dateLike);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// Returnează ultima zi din luna datei primite (la 23:59:59.999).
function endOfMonth(dateLike) {
  const d = new Date(dateLike);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

// Filtrează tranzacțiile care sunt în aceeași lună cu `dateLike`.
// Presupune că fiecare tranzacție are `t.date` (string) pe care îl poate parsa Date().
export function filterByMonth(transactions, dateLike) {
  const from = startOfMonth(dateLike).getTime();
  const to = endOfMonth(dateLike).getTime();
  return transactions.filter((t) => {
    const ts = new Date(t.date).getTime();
    return ts >= from && ts <= to;
  });
}

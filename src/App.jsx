import { useEffect, useMemo, useState } from "react"; //hooks 3 ca numar
import "./App.css";

import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { formatMoney, isoDate } from "./utils/finance";

// ========== Helpers (funcții mici, fără state React) ==========

// textul din cardul de sus („ianuarie 2026”) → titlul lunii curente
function monthLabel(dateLike) {
  const d = new Date(dateLike);
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

// Afișare scurtă pentru o dată ISO (YYYY-MM-DD): ex. "5 ian".
// Dacă inputul e invalid, întoarce string-ul original (fallback).
function formatShortDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

// Generează un id unic pentru o tranzacție.
function makeId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `t_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// Cand adaugi o suma, niste debugging and cosmetics
function normalizeAmount(value) {
  const n =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

// Componentă de UI: doar afișează o tranzactie
//TODO: delete button UI-ul (butonul) poate sta în TransactionListSimple
// logica de ștergere (adică setTransactions(...)) trebuie să stea unde există state-ul transactions, adică în App().
function TransactionListSimple({ transactions, onDelete }) {
  if (!transactions.length) {
    return <div className="empty">Nicio tranzacție încă.</div>;
  }

  return (
    <div className="tx">
      {transactions.map((t) => {
        const isExpense = t.type === "expense";
        const sign = isExpense ? "-" : "+";
        const amountClass = isExpense
          ? "tx__amt is-expense"
          : "tx__amt is-income";
        const icon = isExpense ? "↓" : "↑";

        return (
          <div key={t.id} className="tx__row">
            <div className="tx__icon" aria-hidden>
              {icon}
            </div>
            <div className="tx__main">
              <div className="tx__title">{t.title || "Tranzacție"}</div>
              <div className="tx__sub">{formatShortDate(t.date)}</div>
            </div>
            <div className="tx__right">
              <div className={amountClass}>
                {sign}
                {formatMoney(Number(t.amount || 0), "RON")}
              </div>
              <button
                type="button"
                className="tx__del"
                aria-label={`Șterge: ${t.title || "Tranzacție"}`}
                onClick={() => onDelete?.(t.id)}
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const today = useMemo(() => new Date(), []); // Data curentă
  const [composerOpen, setComposerOpen] = useState(false); // Controlează dacă formularul de adăugare e deschis. cool
  const [theme, setTheme] = useLocalStorageState("bt.theme.v1", "light"); // Tema persistată în localStorage (se păstrează după refresh).

  // Lista de tranzacții persistată în localStorage. „save game”-ul tranzacțiilor.
  const [transactions, setTransactions] = useLocalStorageState(
    "bt.transactions.v1",
    []
  );

  useEffect(() => {
    // Side-effect: setăm tema pe <html> ca CSS-ul să poată aplica stiluri per temă.
    document.documentElement.dataset.theme =
      theme === "dark" ? "dark" : "light";
  }, [theme]);

  // Draft-ul formularului (controlled inputs).
  const [draftTitle, setDraftTitle] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [draftType, setDraftType] = useState("expense");
  const [draftDate, setDraftDate] = useState(() => isoDate(today));

  const sorted = useMemo(() => {
    // Date derivate: sortăm tranzacțiile descrescător după dată.
    return [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [transactions]);

  // Date derivate: păstrăm doar tranzacțiile din luna curentă.
  // (Varianta originală, filtrare pe lună) — o las aici în comentarii:
  // const currentMonthTx = useMemo(
  //   () => filterByMonth(sorted, today),
  //   [sorted, today]
  // );
  // Varianta curentă: afișăm toate tranzacțiile (fără filtrare pe lună).
  const currentMonthTx = sorted;

  const totalForMonth = useMemo(() => {
    // Date derivate: totalul lunii = venituri (+) și cheltuieli (-).
    return currentMonthTx.reduce((acc, t) => {
      const amt = Number(t.amount || 0);
      if (!Number.isFinite(amt)) return acc;
      return acc + (t.type === "expense" ? -amt : amt);
    }, 0);
  }, [currentMonthTx]);

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function resetDraft() {
    // Resetează câmpurile formularului.
    setDraftTitle("");
    setDraftAmount("");
    setDraftType("expense");
    setDraftDate(isoDate(today));
  }

  function onSubmit(e) {
    e.preventDefault();

    // Validare minimă: suma trebuie să fie numerică și > 0.
    const amount = normalizeAmount(draftAmount);
    if (amount == null || amount <= 0) return;

    const next = {
      id: makeId(),
      type: draftType,
      title:
        draftTitle.trim() || (draftType === "expense" ? "Cheltuială" : "Venit"),
      amount,
      date: draftDate || isoDate(today),
    };

    // Adaugă tranzacția în fața listei.
    setTransactions((prev) => [next, ...prev]);
    resetDraft();
    setComposerOpen(false);
  }

  return (
    <div className="app">
      <div className="phone">
        <div className="phone__content">
          <div className="screen bt">
            <div className="screen-header">
              <div className="screen-header__side" />
              <div className="screen-header__title">Buget</div>
              <div className="screen-header__side screen-header__side--right">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={
                    theme === "dark"
                      ? "Schimbă pe tema deschisă"
                      : "Schimbă pe tema închisă"
                  }
                  onClick={() =>
                    setTheme((t) => (t === "dark" ? "light" : "dark"))
                  }
                >
                  {theme === "dark" ? "☀" : "☾"}
                </button>
              </div>
            </div>

            <div className="card">
              <div className="muted">{monthLabel(today)}</div>
              <div className="bt__total">
                {formatMoney(totalForMonth, "RON")}
              </div>
            </div>

            {/* Afișăm formularul doar când `composerOpen` este true */}
            {composerOpen && (
              <div className="card bt__composer">
                <form className="form" onSubmit={onSubmit}>
                  <div className="field">
                    <div className="field__label">Tip</div>
                    <div className="field__row">
                      <button
                        type="button"
                        className={
                          draftType === "expense" ? "chip is-active" : "chip"
                        }
                        onClick={() => setDraftType("expense")}
                      >
                        Cheltuială
                      </button>
                      <button
                        type="button"
                        className={
                          draftType === "income" ? "chip is-active" : "chip"
                        }
                        onClick={() => setDraftType("income")}
                      >
                        Venit
                      </button>
                    </div>
                  </div>

                  <div className="field">
                    <div className="field__label">Titlu</div>
                    <input
                      className="input"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      placeholder="Ex: Mâncare, Salariu"
                      inputMode="text"
                      autoComplete="off"
                    />
                  </div>

                  <div className="field">
                    <div className="field__label">Sumă</div>
                    <input
                      className="input"
                      value={draftAmount}
                      onChange={(e) => setDraftAmount(e.target.value)}
                      placeholder="0,00"
                      inputMode="decimal"
                      autoComplete="off"
                    />
                  </div>

                  <div className="field">
                    <div className="field__label">Dată</div>
                    <input
                      className="input"
                      type="date"
                      value={draftDate}
                      onChange={(e) => setDraftDate(e.target.value)}
                    />
                  </div>

                  <div className="field__row">
                    <button type="submit" className="primary">
                      Adaugă
                    </button>
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => {
                        resetDraft();
                        setComposerOpen(false);
                      }}
                    >
                      Renunță
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="card">
              <div className="row row--between">
                <div className="section-title">Tranzacții</div>
                <div className="muted">{currentMonthTx.length}</div>
              </div>
              <TransactionListSimple
                transactions={currentMonthTx}
                onDelete={deleteTransaction}
              />
            </div>

            <button
              className="fab bt__fab"
              type="button"
              aria-label={composerOpen ? "Închide" : "Adaugă"}
              // Butonul +: deschide/închide formularul.
              onClick={() => setComposerOpen((v) => !v)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

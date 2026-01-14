import { useEffect, useState } from "react";

// Hook: state React persistat în localStorage.
// - La inițializare: citește cheia din localStorage (JSON) sau folosește `initialValue`.
// - La orice schimbare de `state`: scrie în localStorage.
// Returnează aceeași semnătură ca useState: [state, setState].
export function useLocalStorageState(key, initialValue) {
  // Inițializare lazy (funcție) ca să citim localStorage o singură dată.
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initialValue;
      return JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // Serializăm în JSON pentru a salva obiecte/array-uri.
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore write errors
    }
  }, [key, state]);

  return [state, setState];
}

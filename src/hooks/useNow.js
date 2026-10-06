import { useState, useEffect } from 'react';

// Ticking clock used to gate sections on/off around a date window (e.g. the
// team registration form, which should only render between its open and
// close dates). Re-renders every `intervalMs` so the gate flips live without
// a page refresh, the same way useCountdown keeps timers current.
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

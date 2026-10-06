// Scrolling helpers for the single-page layout. The page scrolls inside the
// `.tg-landing` container (not the window), and the fixed header covers the top
// NAV_HEIGHT pixels, so a plain scrollIntoView would land under the header.

const NAV_HEIGHT = 68;

export function scrollToSelector(selector, behavior = 'smooth') {
  const container = document.querySelector('.tg-landing');
  const el = document.querySelector(selector);
  if (!el) return false;
  if (container) {
    const containerRect = container.getBoundingClientRect();
    const elemRect = el.getBoundingClientRect();
    const top = container.scrollTop + elemRect.top - containerRect.top - NAV_HEIGHT;
    container.scrollTo({ top, behavior });
  } else {
    el.scrollIntoView({ behavior });
  }
  return true;
}

// ── Return-to-section after an OAuth round-trip ─────────────────────────────
// Signing in with Google sends the browser away and back, so the page reloads
// at the top. Before leaving we remember which section the visitor was in;
// when the page comes back that section scrolls itself into view again.
// sessionStorage (not the URL hash) is used because Supabase may put its own
// tokens in the hash on the way back.

const RETURN_KEY = 'stellar:return-scroll';
const RETURN_MAX_AGE_MS = 10 * 60 * 1000; // ignore stale flags (abandoned sign-ins)

export function rememberReturnScroll(selector) {
  try {
    sessionStorage.setItem(RETURN_KEY, JSON.stringify({ selector, at: Date.now() }));
  } catch {
    // storage unavailable (private mode etc.) — the feature just does nothing
  }
}

export function peekReturnScroll() {
  try {
    const raw = sessionStorage.getItem(RETURN_KEY);
    if (!raw) return null;
    const { selector, at } = JSON.parse(raw);
    if (!selector || Date.now() - at > RETURN_MAX_AGE_MS) {
      sessionStorage.removeItem(RETURN_KEY);
      return null;
    }
    return selector;
  } catch {
    return null;
  }
}

export function clearReturnScroll() {
  try {
    sessionStorage.removeItem(RETURN_KEY);
  } catch {
    // ignore
  }
}

// Sections above the target are code-split and load in after first paint, which
// pushes the target down the page. So instead of scrolling once, keep the
// target aligned for a short while — and stop the moment the visitor scrolls,
// touches or presses a key so we never fight them.
// Returns a cancel function (cancelling does not call onDone).
export function holdScrollOnSelector(selector, { duration = 2500, onDone } = {}) {
  const USER_EVENTS = ['wheel', 'touchstart', 'keydown', 'mousedown'];
  const start = performance.now();
  let raf = 0;
  let finished = false;

  const teardown = () => {
    cancelAnimationFrame(raf);
    USER_EVENTS.forEach((e) => window.removeEventListener(e, finish));
  };
  const finish = () => {
    if (finished) return;
    finished = true;
    teardown();
    onDone?.();
  };
  const tick = () => {
    if (performance.now() - start > duration) {
      finish();
      return;
    }
    scrollToSelector(selector, 'instant');
    raf = requestAnimationFrame(tick);
  };

  USER_EVENTS.forEach((e) => window.addEventListener(e, finish, { passive: true }));
  raf = requestAnimationFrame(tick);

  return () => {
    finished = true;
    teardown();
  };
}
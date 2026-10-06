import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FEATURES } from '@/config/features';
import { ANNOUNCEMENT } from '@/config/announcement';
import { FeaturesContext } from './featuresContext';

// Feature switches and the header announcement capsule live in Supabase:
//   `features`      — one row per switch:  key (text), enabled (boolean)
//   `announcement`  — one row per capsule preset: name, active, position, icon, text, href
//                     The active row (lowest `position` if several) is shown;
//                     no active row = capsule hidden.
// Edit a row in the dashboard and the site picks it up — no code change, no push.
//
// config/features.js and config/announcement.js are now the FALLBACK values:
// used on first paint (so nothing pops in/out) and whenever Supabase can't be
// reached. To add a new switch: add it to config/features.js, then add its row.

const REFRESH_MS = 5 * 60 * 1000; // re-check every 5 minutes while the page is open

// Applies table rows on top of the defaults. Unknown keys are ignored (with a
// warning) so a typo in the dashboard can't create a flag nothing reads.
function buildFeatures(rows) {
  const result = { ...FEATURES };
  for (const { key, enabled } of rows) {
    if (!(key in FEATURES)) {
      console.warn(`[features] unknown key "${key}" in Supabase — ignored`);
      continue;
    }
    if (typeof enabled === 'boolean') result[key] = enabled;
  }
  return result;
}

// Picks the capsule from the active rows. No active row = capsule hidden.
// Bad/empty fields fall back to the defaults in config/announcement.js.
function buildAnnouncement(rows) {
  const row = rows?.[0];
  if (!row) return { ...ANNOUNCEMENT, show: false };
  const str = (v, fallback) => (typeof v === 'string' && v.trim() ? v : fallback);
  return {
    show: true,
    icon: str(row.icon, ANNOUNCEMENT.icon),
    text: str(row.text, ANNOUNCEMENT.text),
    href: str(row.href, ANNOUNCEMENT.href),
  };
}

const INITIAL = { status: 'loading', features: FEATURES, announcement: ANNOUNCEMENT };

export default function FeaturesProvider({ children }) {
  // status: 'loading' | 'ready' | 'error'
  const [state, setState] = useState(INITIAL);
  const lastRaw = useRef('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [featuresRes, announcementRes] = await Promise.all([
        supabase.from('features').select('key, enabled'),
        supabase
          .from('announcement')
          .select('icon, text, href')
          .eq('active', true)
          .order('position')
          .limit(1),
      ]);
      if (cancelled) return;

      if (featuresRes.error && announcementRes.error) {
        console.error('[features] could not load', featuresRes.error, announcementRes.error);
        // Keep whatever we already have (defaults or last good values).
        setState((s) => (s.status === 'ready' ? s : { ...s, status: 'error' }));
        return;
      }
      if (featuresRes.error) console.error('[features] could not load features', featuresRes.error);
      if (announcementRes.error) console.error('[features] could not load announcement', announcementRes.error);

      const raw = JSON.stringify([featuresRes.data, announcementRes.data]);
      if (raw === lastRaw.current) return; // nothing changed — skip re-render
      lastRaw.current = raw;

      setState((s) => ({
        status: 'ready',
        // If one table failed, keep its current values instead of resetting to defaults.
        features: featuresRes.error ? s.features : buildFeatures(featuresRes.data ?? []),
        announcement: announcementRes.error ? s.announcement : buildAnnouncement(announcementRes.data),
      }));
    }

    load();
    const id = setInterval(load, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return <FeaturesContext.Provider value={state}>{children}</FeaturesContext.Provider>;
} 
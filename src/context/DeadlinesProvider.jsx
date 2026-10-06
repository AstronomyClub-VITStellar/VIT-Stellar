import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { DeadlinesContext } from './deadlinesContext';

// Every form open/close date lives in the Supabase `deadlines` table (one row
// per date). Edit a row in the Supabase dashboard and the site picks it up —
// no code change, no GitHub push.
//
// This file maps each table `key` to a field on a section, e.g.
//   'merch_close'  ->  deadlines.merchandise.closingDate
// To add a new date: add its row in Supabase, then add it here.
const SECTIONS = {
  merchandise: {
    merch_release: 'releaseDate',
    merch_close: 'closingDate',
  },
  fest: {
    fest_team_reg_open: 'teamRegOpenDate',
    fest_team_reg_close: 'teamRegClosingDate',
    fest_certificates_open: 'certificatesOpenDate',
    fest_certificates_close: 'certificatesClosingDate',
    fest_feedback_open: 'feedbackOpenDate',
    fest_feedback_close: 'feedbackClosingDate',
  },
  boardApplication: {
    board_open: 'openDate',
    board_deadline: 'deadline',
    board_slots_start: 'slotsStart',
    board_slots_end: 'slotsEnd',
    board_results: 'resultsDate',
  },
  domainSelection: {
    domain_open: 'openDate',
    domain_deadline: 'deadline',
  },
};

const REFRESH_MS = 5 * 60 * 1000; // re-check every 5 minutes while the page is open

// Turns table rows into { merchandise: {...Dates} | null, fest: ..., ... }.
// A section is null if any of its dates is missing/invalid, so a half-filled
// table hides that section instead of crashing the page.
function buildDeadlines(rows) {
  const byKey = new Map(rows.map((r) => [r.key, new Date(r.at)]));
  const result = {};
  for (const [section, fields] of Object.entries(SECTIONS)) {
    const built = {};
    const missing = [];
    for (const [key, field] of Object.entries(fields)) {
      const date = byKey.get(key);
      if (date && !Number.isNaN(date.getTime())) built[field] = date;
      else missing.push(key);
    }
    if (missing.length) {
      console.warn(`[deadlines] "${section}" hidden — missing/invalid keys: ${missing.join(', ')}`);
      result[section] = null;
    } else {
      result[section] = built;
    }
  }
  return result;
}

export default function DeadlinesProvider({ children }) {
  // status: 'loading' | 'ready' | 'error'
  const [state, setState] = useState({ status: 'loading', deadlines: null });
  const lastRaw = useRef('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase.from('deadlines').select('key, at');
      if (cancelled) return;

      if (error || !data || data.length === 0) {
        console.error('[deadlines] could not load deadlines', error ?? 'table returned no rows');
        // Keep showing the last good values if we already have them.
        setState((s) => (s.deadlines ? s : { status: 'error', deadlines: null }));
        return;
      }

      const raw = JSON.stringify(data);
      if (raw === lastRaw.current) return; // nothing changed — skip re-render
      lastRaw.current = raw;
      setState({ status: 'ready', deadlines: buildDeadlines(data) });
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

  return <DeadlinesContext.Provider value={state}>{children}</DeadlinesContext.Provider>;
}

import { useContext } from 'react';
import { DeadlinesContext } from '@/context/deadlinesContext';

// Returns { status, deadlines }.
//   deadlines.merchandise / .fest / .boardApplication / .domainSelection
// Each is an object of Date values, or null while loading / if its rows are
// missing in Supabase. Sections should render nothing when theirs is null.
export function useDeadlines() {
  const ctx = useContext(DeadlinesContext);
  if (!ctx) throw new Error('useDeadlines must be used inside <DeadlinesProvider>');
  return ctx;
}

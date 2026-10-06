// Shared date helpers.
// Used by the content files and any component that needs to show a
// deadline/date to the user. The dates themselves come from the Supabase
// `deadlines` table (see context/DeadlinesProvider.jsx).

export function formatDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// "01 February 2027 [11:59 PM]" — the phrasing used across the form
// "Last Date to fill the form is ..." instructions.
export function formatDeadlineNotice(date) {
  return `${formatDate(date)} [${formatTime(date)}]`;
}

// Zero-pad to two digits — used by countdowns and date parsing.
export function pad(n) {
  return String(n).padStart(2, '0');
}

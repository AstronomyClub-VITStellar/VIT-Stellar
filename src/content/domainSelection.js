import { formatDeadlineNotice } from '../lib/dateUtils';

export const DomainSelection = {
  // Takes the domain-selection deadlines from Supabase.
  formInstructions: (deadlines) => [
    `Last Date to fill the form is ${formatDeadlineNotice(deadlines.deadline)}`,
    'Fill in every field exactly as it should appear on record — double check the details you entered before submitting.',
    'You may list a first and second domain preference, in order of priority.',
    'In case of any queries, please feel free to contact any of the Board Members or reach us through the Contact Us section below.',
  ],
  domains: [
    "Events & Management",
    "Finance & Outreach",
    "Website & Technology",
    "Research & Development",
    "Design & Creativity",
    "Publicity & Marketing",
  ],
};

import { formatDeadlineNotice } from '../lib/dateUtils';

export const Recruitments = {
  // Takes the recruitments deadlines from Supabase.
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

export const InterviewSchedule = {
  instructions: [
    'Sign in with the Google account (Official VIT email) only.',
    'Only the interview slot(s) assigned to your VIT email will be shown here.',
    'Please be present on the mentioned date and time. Interview link will be shared with you by respective panel members.',
    'In case of any queries, please feel free to contact Recruitments Lead : Haneesh Yadav - 9103355700.',
  ],
};

export const RecruitmentResults = {
  instructions: [
    'Sign in with the Google account (Official VIT email) only.',
    'Only the result linked to your VIT email will be shown here.',
    'Results are final once published. Selected members will be contacted with the next steps.',
    'In case of any queries, please feel free to contact any of the Board Members or reach us through the Contact Us section below.',
  ],
};
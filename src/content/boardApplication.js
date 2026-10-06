import { formatDeadlineNotice } from '../lib/dateUtils';

export const BoardApplication = {
  phaseOverride: null,
  // Takes the board-application deadlines from Supabase.
  formInstructions: (deadlines) => [
    `Last Date to fill the form is ${formatDeadlineNotice(deadlines.deadline)}`,
    'Please read the Roles and Responsibilities carefully before applying for any Board Position. ',
    'Apply only for roles you are  genuinely interested in and ready to contribute to.',
    'In case of any queries, please feel free to contact any of the Board Members or reach us through the Contact Us section below.',
  ],
  positions: [
    "Vice Chairperson",
    "Co Secretary",
    "Events & Management Head",
    "Finance Head",
    "Technical Head",
    "Design Head",
    "Publicity Head",
    "Editorial Head",
  ],
  preferredInterviewDates: [
    "20 January 2027",
    "21 January 2027",
    "22 January 2027",
  ],
  experienceFields: [
    { id: "eventsManaged", label: "What events in the past year have you helped in managing?" },
    { id: "leadershipEvent", label: "Describe an event where you demonstrated leadership skills, and its effect on the outcome of the event. [Mention the event name]" },
    { id: "initiative", label: "Tell us about a time you took initiative without being asked. What was the situation and why did you step in?" },
    { id: "budgetManagement", label: "How would you make sure that the club\u2019s budget is never out of money and even if it is so what measures would you take that it does not affect the event? And at what time will you prefer to use the club fund to use it in the most effective way?" },
    { id: "leaderQuality", label: "What do you think is one quality of yours which qualifies you to become a leader?" },
    { id: "conflictResolution", label: "As the core of the club\u2019s leadership, how will you deal with situations when you find 2 other board members are against each other\u2019s ideas (or always have disagreement) in most of the situations, which may affect the smooth functioning of the club?" },
    { id: "positionPlans", label: "If you are the ____ (position), what plans do you have and what are the first steps you\u2019ll take which correspond to your position and the roles & responsibilities that comes with it?" },
    { id: "editorialRole", label: "Explain the role of an Editorial Domain in a scientific community." },
    { id: "designIdentity", label: "How you would use design to reflect Stellar\u2019s identity and make it stand out among other clubs?" },
    { id: "publicityIdea", label: "What\u2019s that one thing you\u2019d do differently in our publicity so people instantly know it\u2019s a STELLAR post, even without the logo?" },
    { id: "technicalHead", label: "VIT Stellar is a \"Technical Club\". What are some of the key qualities/experiences you possess which makes you a very strong candidate for this position. Moreover what are your future plans as the Technical head to take forward the recognition of Stellar as a \"Technical\" Club in the inter and intra college level?" },
  ],
  rolesResponsibilitiesPdf: '/assets/board-application/roles-and-responsibilities.pdf',
  slotInstructions: [
    'There will be no changes in the schedule, so make sure to arrive on time for your slot.',
    'The Link for Interview will be shared with you personally by the Board Member.',
    'In case of any queries, please feel free to contact any of the Board Members or reach us through the Contact Us section below.',
  ],
  interviewSlots: [
    {
      date: "20 January 2027",
      slots: [
        { regNumber: "Add Register Number", name: "Add Applicant Name", time: "10:00 AM - 10:15 AM", venue: "NA-" },
      ],
    },
  ],
  results: [
    { position: "Chairperson",              year: "2027", regNumber: "NA-", name: "NA-" },
    { position: "Secretary",                year: "2027", regNumber: "NA-", name: "NA-" },
    { position: "Vice Chairperson",         year: "2027", regNumber: "NA-", name: "NA-" },
    { position: "Co Secretary",             year: "2027", regNumber: "NA-", name: "NA-" },
    { position: "Events & Management Head", year: "2027", regNumber: "NA-", name: "NA-" },
    { position: "Finance Head",             year: "2027", regNumber: "NA-", name: "NA-" },
    { position: "Technical Head",           year: "2027", regNumber: "NA-", name: "NA-" },
    { position: "Design Head",              year: "2027", regNumber: "NA-", name: "NA-" },
    { position: "Publicity Head",           year: "2027", regNumber: "NA-", name: "NA-" },
    { position: "Editorial Head",           year: "2027", regNumber: "NA-", name: "NA-" },
  ],
};

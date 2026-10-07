import { formatDeadlineNotice } from '../lib/dateUtils';

export const Fest = {
  logo: '/assets/gravitas2026/gravitas26.svg',
  events: [
    {
      eventTitle: "Rovaris",
      org: "VIT Stellar X Vaayusastra",
      eventDesc: "Ever wondered what it feels like to be part of a Mars mission? ROVARIS combines space technology, strategy, and hands-on rover building. Day 1 features an expert-led workshop and software challenges. Day 2 brings rover building, a thrilling race, and terrain competition. Teams take home their assembled rover!",
      eventImage: "/assets/gravitas2026/Rovaris.webp",
      date: "05 SEPT - 06 SEPT",
      time: "09:00 AM - 05:00 PM",
      teamSize: "4-5",
      regCount: "80/80",
      registerUrl: "https://gravitas.vit.ac.in/events/3cd06454-d26e-4770-83ec-1f222f9d19ab",
      pocs: [
        { name: 'Haneesh Yadav', image: '/assets/team/2026/Haneesh Yadav.webp', phone: '+91 91033 55700' },
      ],
    },
    {
      eventTitle: "Aerovate 3.0",
      org: "VIT Stellar X Thrust Tech India",
      eventDesc: "Aerovate 3.0 is a two-day hands-on rocketry workshop introducing participants to aerospace engineering. Through interactive sessions, participants explore aerodynamics, rocket stability, and propulsion. They then design, build, and launch model rockets, gaining practical experience and understanding the complete engineering journey from concept and design to a successful launch.",
      eventImage: "/assets/gravitas2026/Aerovate 3.0.webp",
      date: "11 SEPT - 12 SEPT",
      time: "09:00 AM - 05:00 PM",
      teamSize: "4-5",
      regCount: "190/190",
      registerUrl: "https://gravitas.vit.ac.in/events/b706e255-5801-4091-a6c2-1a4b6f3f0098",
      pocs: [
        { name: 'Khushii Anand', image: '/assets/team/2026/Khushii Anand.webp', phone: '+91 83080 36411' },
      ],
    },
    {
      eventTitle: "Celestial Dive 5.0",
      org: "VIT Stellar X Space Tek Planetariums",
      eventDesc: "Celestial Dive 5.0 is an immersive journey beyond Earth, offering a night of cosmic exploration. Participants observe celestial wonders through powerful telescopes, explore astronomy through engaging sessions, and experience immersive planetariums. A moonlit ambiance enhances the experience, inspiring wonder, curiosity, and a deeper connection with the universe.",
      eventImage: "/assets/gravitas2026/Celestial Dive 5.0.webp",
      date: "18 SEPT - 19 SEPT",
      time: "09:00 PM - 06:00 AM",
      teamSize: "SOLO",
      regCount: "300/300",
      tag: "OVERNIGHT",
      registerUrl: "https://gravitas.vit.ac.in/events/0629102b-cc5f-4992-8921-2e55df1cb2f9",
      pocs: [
        { name: 'Ekansh Garg', image: '/assets/team/2026/Ekansh Garg.webp', phone: '+91 97613 34159' },
      ],
    },
  ],
  sponsor: { name: '', logo: '/assets/gravitas2026/SBI.webp', url: 'https://sbi.bank.in' },
  sponsorsSubtext: 'Thank you to our Gravitas 2026 sponsor!',
  teamFormEventName: '',
  // The three instruction lists below take the fest deadlines from Supabase.
  teamFormInstructions: (deadlines) => [
    `Last Date to fill the form is ${formatDeadlineNotice(deadlines.teamRegClosingDate)}`,
    'This form is to be filled by the Team Leader only, on behalf of the whole team.',
    'Fill in every field exactly as it should appear on record — double check the details you entered before submitting.',
    'In case of any queries, please feel free to contact Event POC : ',
  ],
  certificateInstructions: (deadlines) => [
    `Last Date to download the certificate is ${formatDeadlineNotice(deadlines.certificatesClosingDate)}`,
    'Sign in with the Google account (Official VIT email).',
    'Certificates for all the events organized by the Astronomy Club – VIT Stellar during graVITas 2026 will be available.',
    'In case of any queries, please feel free to contact the Web & Tech Team Captain : Haneesh Yadav - 9103355700.',
  ],
  feedbackInstructions: (deadlines) => [
    `Last Date to submit feedback is ${formatDeadlineNotice(deadlines.feedbackClosingDate)}`,
    'This form is completely anonymous — no personally identifying information is collected or stored.',
    'If you attended multiple events, please fill this form separately for each event — submit it for one event, then come back and fill it again for the next, since your response is recorded differently per event.',
    'Please be honest and constructive; your responses directly help us improve future events.',
    'In case of any queries, please feel free to contact the Web & Tech Team Captain : Haneesh Yadav - 9103355700.',
  ],
};

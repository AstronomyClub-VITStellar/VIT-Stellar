import { merchandiseDeadlines, festDeadlines, boardApplicationDeadlines, domainSelectionDeadlines } from './Deadlines';
import { formatDeadlineNotice } from '../shared/dateutils';

export const Hero = {
  titleImage: { src: '/assets/hero/stellar.webp', alt: 'STELLAR' },
  centerpieceImage: { src: '/assets/hero/Center.webp', alt: 'Astronaut floating in space' },
  planets: [
    { id: 'blackhole', image: '/assets/hero/Black Hole.webp',          alt: 'Black hole',          label: 'Black Hole' },
    { id: 'asteroid',  image: '/assets/hero/Asteroid.webp',            alt: 'Asteroid',            label: 'Asteroid' },
    { id: 'moon',      image: '/assets/hero/Moon.webp',                alt: 'Moon',                label: 'Moon' },
    { id: 'nebula',    image: '/assets/hero/Nebula in Andromeda.webp', alt: 'Nebula in Andromeda', label: 'Nebula in Andromeda' },
    { id: 'saturn',    image: '/assets/hero/Saturn.webp',              alt: 'Saturn',              label: 'Saturn' },
    { id: 'artemis',   image: '/assets/hero/Artemis II.webp',          alt: 'Artemis II',          label: 'Artemis II' },
  ],
};

export const AboutUs = {
  hero: {
    image: "/assets/events/Cosmic Walk 4.0.webp",
  },
  featured: {
    title: "WE ARE VIT-STELLAR!",
    desc: "Astronomy Club - VIT Stellar, where passion meets the cosmos! Founded by astronomy enthusiasts under the guidance of Office of Students' Welfare at Vellore Institute of Technology, Vellore our club is dedicated to exploring the wonders of the universe and fostering a community of stargazers, scientists, and dreamers. Our motive is to ignite curiosity and inspire exploration of the cosmos. Through engaging workshops, star parties, and informative sessions, we aim to make astronomy accessible and enjoyable for everyone, from beginners to seasoned astronomers.",
    quickLinks: [
      { label: "MEET THE TEAM", href: "#team" },
      { label: "EVENTS", href: "#events" },
    ],
  },
  pillars: {
    mission: {
      title: ["Our", "Mission"],
      desc: "We aim to build a vibrant community of astronomy enthusiasts, spark curiosity through hands-on exploration, and ignite a passion for space in the next generation by offering immersive activities and inspiring educational programs that empower future explorers to reach for the stars.",
    },
    vision: {
      title: ["Our", "Vision"],
      desc: "To create a world where curiosity about the cosmos is limitless, science is celebrated, and every individual—regardless of background—feels empowered to explore the stars, envisioning a future led by thinkers, dreamers, and doers inspired by the universe and driven by discovery.",
    },
    values: {
      title: ["Our", "Values"],
      desc: "At the core of everything we do lies an unwavering spirit of curiosity, a commitment to collaboration, and a deep respect for inclusivity. We strive to spark scientific wonder, foster meaningful conversations, and cultivate a space where no thought goes unheard and every idea has the power to light up the universe.",
    },
  },
};

export const Fame = {
  cards: [
    {
      title: "1600+ Active Members",
      desc: "Star-gazers and cosmic explorers converge in a vibrant, stellar community, collaborating on deep-space discovery projects and sharing celestial insights with expert astronomers and fellow enthusiasts.",
      icon: "auto_awesome",
      images: [
        { id: "fc1-1", name: "Vishesh Bansal", photo: "/assets/fame/random.webp", size: "lg", featured: true },
      ],
    },
    {
      title: "6 Years of Celestial Legacy",
      desc: "Forging a lasting cosmic legacy at VIT, our club has fostered decades of stellar exploration, student innovation, and academic passion for astronomy.",
      icon: "rocket_launch",
      images: [
        { id: "fc2-1", name: "Yajat Malhotra", video: "/assets/fame/Aerovate 2.0.mp4", size: "lg", featured: true },
      ],
    },
    {
      title: "160 Cosmic Events Hosted",
      desc: "From interactive stargazing nights to virtual summits, our diverse range of curated experiences bridges the gap between deep-space science and eager minds, building an active hub for astronomical discovery.",
      icon: "public", 
      images: [
        { id: "fc3-1", name: "Karan Deshpande", photo: "/assets/fame/random 2.webp", size: "lg", featured: true },
      ],
    },
  ],
};

export const Testimonials = {
  items: [
    {
      name: "Kritik Kumar",
      role: "Co Founder and Chairperson [2020  Tenure]",
      quote: "I founded VIT-Stellar, with a simple belief that the universe has a way of bringing people together who are curious enough to look beyond themselves. Laying VIT-Stellar foundation became my first leadership journey. It taught me how to rally people around a shared vision, build trust, create culture, and lead with influence rather than authority. More importantly, it showed me that leadership is about enabling others to grow. My professional journey reinforced these lessons. Leading diverse teams in high-pressure environments sharpened my ability to understand people, adapt to different temperaments, and drive outcomes by influencing without authority, a principle that continues to define my leadership style. Even today, whenever I look up at Orion, I’m reminded that individual stars become meaningful only when connected.",
      color: "purple",
      photo: "/assets/testimonials/Kritik Kumar.webp",
    },
    {
      name: "Aniket Rai",
      role: "Chairperson [2024 Tenure]",
      quote: "Stellar has been much more than just a club—it became my second home. It shaped me into a better leader, helped me grow personally and professionally, and gave me friendships and memories I’ll cherish for life. Forever grateful to be a Stellar family.❤️",
      color: "purple",
      photo: "/assets/testimonials/Aniket Rai.webp",
    },
    {
      name: "Vishwajith Prabhakar",
      role: "Secretary [2024 Tenure]",
      quote: "This club which I hold very close to my heart has given me countless memories, experiences and friends. I grew as a person who was not shy to speak up anymore and could lead a team with compassion. This is more than a club to me, it's my chosen family :)",
      color: "blue",
      photo: "/assets/testimonials/Vishwajith Prabhakar.webp",
    },
    {
      name: "Devangi Arora",
      role: "Vice Chairperson [2024 Tenure]",
      quote: "Stellar feels like one of those places that quietly changes you without you even realizing it. It gave me confidence when I didn’t have much, taught me to trust my decisions, reminded me that it’s okay to make mistakes, and helped me grow into someone people could rely on. Because of this family, speaking in front of crowds, meeting new people, and taking on challenges doesn’t scare me anymore. I’ll always be grateful to Stellar not just for everything it taught me, but for the person it helped me become.",
      color: "periwinkle",
      photo: "/assets/testimonials/Devangi Arora.webp",
    },
    {
      name: "Subhra Dey",
      role: "Chairperson [2025 Tenure]",
      quote: "Stellar has been a huge part of my journey at VIT. I joined because of my interest in astronomy, but over time it became much more than just a club. It gave me opportunities to take up responsibilities, work with some amazing people, organize events, and learn things that classrooms never really teach.",
      color: "white",
      photo: "/assets/testimonials/Subhra Dey.webp",
    },
    {
      name: "Abishek R",
      role: "Technical Head [2025 Tenure]",
      quote: "VIT Stellar was the foundation of my leadership and research journey. As Technical Head, I built a passionate team, led an ISRO-published research project, organized astronomy activities, and developed lifelong friendships while mentoring future leaders to continue the club's legacy.",
      color: "orange",
      photo: "/assets/testimonials/Abishek R.webp",
    },
  ],
};

export const Team = {
  2026: {
    team: [
        {
          name: "Anushka Arora",
          role: "Chairperson",
          photo: "/assets/team/2026/Anushka Arora.webp",
          offset: "down",
          links: { github: "", linkedin: "https://www.linkedin.com/in/anushka-arora-779b8828a/" },
        },
        {
          name: "Dr. Selva Rani B",
          role: "Faculty Coordinator",
          photo: "/assets/team/2026/Dr. Selva Rani B.webp",
          desc: "Dr. Selva Rani B has been a constant source of guidance for VIT-STELLAR, encouraging students to explore astronomy with curiosity, confidence, and a spirit of discovery.",
          offset: "up",
        },
        {
          name: "Arya Diwakar",
          role: "Secretary",
          photo: "/assets/team/2026/Arya Diwakar.webp",
          offset: "down",
          links: { github: "https://github.com/AryaDiwakar", linkedin: "https://www.linkedin.com/in/arya-diwakar-6199b322b/" },
        },
      ],
    grid1: [
        { name: "Ekansh Garg",
          role: "Vice Chairperson",
          photo: "/assets/team/2026/Ekansh Garg.webp",
          links: { github: "", linkedin: "https://www.linkedin.com/in/ekansh-garg-205008318/" }
        },
        { name: "Khushii Anand",
          role: "Co Secretary",
          photo: "/assets/team/2026/Khushii Anand.webp",
          links: { linkedin: "https://www.linkedin.com/in/khushii-anand-7b14ab327/" }
        },
        { name: "Zayn Khan",
          role: "Events & Management Head",
          photo: "/assets/team/2026/Zayn Khan.webp",
          links: { github: "https://github.com/firefly6969", linkedin: "https://www.linkedin.com/in/khanzayn" }
        },
        { name: "Haneesh Yadav",
          role: "Finance Head",
          photo: "/assets/team/2026/Haneesh Yadav.webp",
          links: { github: "https://github.com/haneesh-yadav", linkedin: "https://www.linkedin.com/in/haneesh-yadav/", website: "https://haneesh.vercel.app" }
        },
      ],
    grid2: [
        { name: "Ishayu Basu",
          role: "Technical Head",
          photo: "/assets/team/2026/Ishayu Basu.webp",
          links: { linkedin: "https://www.linkedin.com/in/ishayu-basu-a38b41319/" }
        },
        { name: "Rasheswari Padhi",
          role: "Design Head",
          photo: "/assets/team/2026/Rasheswari Padhi.webp",
          links: { linkedin: "https://www.linkedin.com/in/rasheswari-padhi-4a6321308/" }
        },
        { name: "Deeksha V",
          role: "Publicity Head",
          photo: "/assets/team/2026/Deeksha V.webp",
          links: { linkedin: "https://www.linkedin.com/in/deeksha-v-967033331/" }
        },
        { name: "Nakshatra Gundeli",
          role: "Editorial Head",
          photo: "/assets/team/2026/Nakshatra Gundeli.webp",
          links: { linkedin: "https://www.linkedin.com/in/nakshatra-gundeli-181783339/" }
        },
      ],
  },
  2025: {
    team: [
        {
          name: "Subhra Dey",
          role: "Chairperson",
          photo: "/assets/team/2025/Subhra Dey.webp",
          offset: "down",
          links: { linkedin: "https://www.linkedin.com/in/subhradey2003/" },
        },
        {
          name: "Dr. Selva Rani B",
          role: "Faculty Coordinator",
          photo: "/assets/team/2025/Dr. Selva Rani B.webp",
          desc: "With her continued support and mentorship, Dr. Selva Rani B has helped foster a welcoming environment where students learn, collaborate, and grow through astronomy.",
          offset: "up",
        },
        {
          name: "Sarvesh B",
          role: "Secretary",
          photo: "/assets/team/2025/Sarvesh B.webp",
          offset: "down",
          links: { linkedin: "https://www.linkedin.com/in/sarveshbaskaran/" },
        },
      ],
    grid1: [
        { name: "Arya Diwakar",
          role: "Vice Chairperson",
          photo: "/assets/team/2025/Arya Diwakar.webp",
          links: { linkedin: "https://www.linkedin.com/in/arya-diwakar-6199b322b/" }
        },
        { name: "Anushka Arora",
          role: "Co Secretary",
          photo: "/assets/team/2025/Anushka Arora.webp",
          links: { linkedin: "https://www.linkedin.com/in/anushka-arora-779b8828a/" }
        },
        { name: "Aaditya Sharma",
          role: "Events & Management Head",
          photo: "/assets/team/2025/Aaditya Sharma.webp",
          links: { linkedin: "https://www.linkedin.com/in/aaditya-sharma-9a47a128a/" }
        },
        { name: "Rishit Gupta",
          role: "Finance Head",
          photo: "/assets/team/2025/Rishit Gupta.webp",
          links: { linkedin: "https://www.linkedin.com/in/rishit-gupta-/" }
        },
      ],
    grid2: [
        { name: "Abishek R",
          role: "Technical Head",
          photo: "/assets/team/2025/Abishek R.webp",
          links: { linkedin: "https://www.linkedin.com/in/abishek-ranganathan-4878a2290/" }
        },
        { name: "Parv Pachouri",
          role: "Design Head",
          photo: "/assets/team/2025/Parv Pachouri.webp",
          links: { linkedin: "https://www.linkedin.com/in/parv-pachouri-093a5b293/" }
        },
        { name: "Shivankar Sinha",
          role: "Publicity Head",
          photo: "/assets/team/2025/Shivankar Sinha.webp",
          links: { linkedin: "https://www.linkedin.com/in/shivankar-sinha-03a03728b/" }
        },
        { name: "Anirudh J",
          role: "Editorial Head",
          photo: "/assets/team/2025/Anirudh J.webp",
          links: { linkedin: "https://www.linkedin.com/in/anirudh-janakiram-009b68299/" }
        },
      ],
  },
  2024: {
    team: [
        {
          name: "Aniket Rai",
          role: "Chairperson",
          photo: "/assets/team/2024/Aniket Rai.webp",
          offset: "down",
          links: { linkedin: "https://www.linkedin.com/in/aniket-rai-694b5b244/" },
        },
        {
          name: "Dr. Selva Rani B",
          role: "Faculty Coordinator",
          photo: "/assets/team/2024/Dr. Selva Rani B.webp",
          desc: "With a strong commitment to student learning and scientific exploration, Dr. Selva Rani B continues to guide VIT-STELLAR in its pursuit of knowledge, innovation, and discovery.",
          offset: "up",
        },
        {
          name: "Vishwajith Prabhakar",
          role: "Secretary",
          photo: "/assets/team/2024/Vishwajith Prabhakar.webp",
          offset: "down",
          links: { linkedin: "https://www.linkedin.com/in/vishwajith-prabhakar-506b08229/" },
        },
      ],
    grid1: [
        { name: "Devangi Arora",
          role: "Vice Chairperson",
          photo: "/assets/team/2024/Devangi Arora.webp",
          links: { linkedin: "https://www.linkedin.com/in/devangi-arora/" }
        },
        { name: "Aayush Nagpal",
          role: "Co Secretary",
          photo: "/assets/team/2024/Aayush Nagpal.webp",
          links: { linkedin: "https://www.linkedin.com/in/aayush-nagpal-71022b28a/" }
        },
        { name: "Shreejata Gupta",
          role: "Events Head",
          photo: "/assets/team/2024/Shreejata Gupta.webp",
          links: { linkedin: "https://www.linkedin.com/in/shreejata-gupta-385055275/" }
        },
        { name: "Swayam Galgalikar",
          role: "Finance Head",
          photo: "/assets/team/2024/Swayam Galgalikar.webp",
          links: { linkedin: "https://www.linkedin.com/in/swayam-galgalikar14/" }
        },
      ],
    grid2: [
        { name: "Muskaan Patni",
          role: "Technical Head",
          photo: "/assets/team/2024/Muskaan Patni.webp",
          links: { linkedin: "https://www.linkedin.com/in/muskaan-patni-08483820a/" }
        },
        { name: "Supransha Thapa",
          role: "Design Head",
          photo: "/assets/team/2024/Supransha Thapa.webp",
          links: { linkedin: "https://www.linkedin.com/in/supransha-thapa-b4824332a/" }
        },
        { name: "Sanchita Jindal",
          role: "Management Head",
          photo: "/assets/team/2024/Sanchita Jindal.webp",
          links: { linkedin: "https://www.linkedin.com/in/sanchita-jindal-358790289/" }
        },
        { name: "Avanish Gharat",
          role: "Editorial Head",
          photo: "/assets/team/2024/Avanish Gharat.webp",
          links: { linkedin: "https://www.linkedin.com/in/avanish-gharat/" }
        },
      ],
  },
};

export const Merchandise = {
  ...merchandiseDeadlines,
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  price: 420,
  priceWords: 'Four hundred and twenty only',
  upiId: '9103355700@ptyes',
  blurImage: '/assets/merchandise/merch-banner.webp',
  merchImage: '/assets/merchandise/merch-banner.webp',
  sizeChartImage : '/assets/merchandise/size-chart.webp',
  qrImage: '/assets/merchandise/payment-qr.webp',
  instructions: [
    `Last Date to fill the form is ${formatDeadlineNotice(merchandiseDeadlines.closingDate)}`,
    'Fill in every field exactly as it should appear on record — double check the details you entered before submitting.',
    'Please ensure the name you enter in \u201CName to be printed on Merch\u201D is appropriate. We reserve the right to change it if necessary.',
    'Complete the payment using the QR code or UPI ID shown alongside this form and upload the screenshot in \u201CUpload Payment Screenshot\u201D.',
    'Merch orders will not be placed in case of non-payment or incorrect payment. Kindly ensure the exact amount is paid.',
    'In case of any queries, please feel free to contact any of the Board Members or reach us through the Contact Us section below.',
  ],
};

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
      tag: "OVERNIGHT",
      registerUrl: "https://gravitas.vit.ac.in/events/0629102b-cc5f-4992-8921-2e55df1cb2f9",
      pocs: [
        { name: 'Ekansh Garg', image: '/assets/team/2026/Ekansh Garg.webp', phone: '+91 97613 34159' },
      ],
    },
  ],
  sponsor: { name: '', logo: '/assets/gravitas2026/SBI.webp', url: 'https://sbi.bank.in/' },
  sponsorsSubtext: 'Thank you to our Gravitas 2026 sponsor!',
  galleryUploadDesc: 'Were you at our Fest event? Share your shots with us by uploading them on below link.',
  galleryDriveLink: 'https://drive.google.com/drive/folders/1_4kXXu71Ig03Q1UTc5fBqhOqNCHQ226n?usp=sharing',
  teamFormEventName: 'Aerovate 3.0',
  teamFormInstructions: [
    `Last Date to fill the form is ${formatDeadlineNotice(festDeadlines.teamRegClosingDate)}`,
    'This form is to be filled by the Team Leader only, on behalf of the whole team.',
    'Fill in every field exactly as it should appear on record — double check the details you entered before submitting.',
    'In case of any queries, please feel free to contact Event POC : Khushii Anand - 8308036411.',
  ],
  ...festDeadlines,
};

export const BoardApplication = {
  phaseOverride: null,
  ...boardApplicationDeadlines,
  formInstructions: [
    `Last Date to fill the form is ${formatDeadlineNotice(boardApplicationDeadlines.deadline)}`,
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

export const DomainSelection = {
  ...domainSelectionDeadlines,
  formInstructions: [
    `Last Date to fill the form is ${formatDeadlineNotice(domainSelectionDeadlines.deadline)}`,
    'Fill in every field exactly as it should appear on record — double check the details you entered before submitting.',
    'You may list a first and second domain preference, in order of priority.',
    'In case of any queries, please feel free to contact any of the Board Members or reach us through the Contact Us section below.',
  ],
  domains: [
    "Events & Management",
    "Finance",
    "Technical",
    "Design",
    "Publicity",
    "Editorial",
  ],
};

export const Events = {
  items: [
    {
      title: "Cosmic Walk 4.0",
      desc: "Cosmic walk 4.0 is a guided stargazing event organized by the astronomy club, vit stellar. The session offers participants an immersive experience of the night sky through live telescope observations at kc lawn, accompanied by insights into celestial objects and constellations. The event concludes near mb, providing a unique opportunity to explore astronomy in an engaging and structured setting.",
      image: "/assets/events/Cosmic Walk 4.0.webp",
      side: "right",
    },
    {
      title: "Celestial Dive 4.0",
      desc: "Celestial Dive 4.0 is an overnight stargazing event in collaboration with an external astronomy agency. Using advanced telescopes, participants can observe the Moon, Jupiter, Saturn, Andromeda, and more—even on cloudy nights. It’s a magical experience that brings the wonders of the universe closer than ever before.",
      image: "/assets/events/Celestial Dive 4.0.webp",
      side: "left",
    },
    {
      title: "Aerovate 2.0",
      desc: "Aerovate 2.0 is an exciting two-day rocket-building workshop designed for hands-on learning. On the first day, participants explore the fundamentals of rocket design and build their own rockets with expert guidance from Thrust Tech India. The second day brings the thrill of launching their creations into the sky.",
      image: "/assets/events/Aerovate 2.0.webp",
      side: "right",
    },
    {
      title: "Cosmic Walk 3.0",
      desc: "VIT STELLAR s flagship event, delivered a magical night of stargazing and astrophotography, for an unforgettable campus experience",
      image: "/assets/events/Cosmic Walk 3.0.webp",
      side: "left",
    },
    {
      title: "Celestial Combat",
      desc: "Celestial Combat was a flagship Riviera event where three teams clashed in a high-adrenaline, strategic gel blaster battle to capture flags and dominate the arena.",
      image: "/assets/events/Celestial Combat.webp",
      side: "right",
    },
    {
      title: "Space Week",
      desc: "Space Week was a vibrant celebration of cosmic exploration, uniting clubs and students through events that sparked curiosity, creativity, and discovery.",
      image: "/assets/events/Space Week.webp",
      side: "left",
    },
    {
      title: "Celestial Dive 3.0",
      desc: "A Fest event by SPACE India and VIT, featuring telescope stargazing and expert-led sessions that sparked passion in students, professors, and enthusiasts.",
      image: "/assets/events/Celestial Dive 3.0.webp",
      side: "right",
    },
    {
      title: "Aerovate",
      desc: "Aerovate, a premier Fest event, was a hands-on rocketry workshop where students designed, simulated, and launched model rockets, turning ideas into flight.",
      image: "/assets/events/Aerovate.webp",
      side: "left",
    },
    {
      title: "Zero Gravity Dance Party",
      desc: "Zero Gravity Dance Party was a surreal cosmic dance experience where music met motion in a gravity-defying, space-themed atmosphere.",
      image: "/assets/events/Zero Gravity Dance Party.webp",
      side: "right",
    },
  ],
};

export const Publications = {
  items: [
    // {
    //   title: "Antarikshvani - VIT Stellar Newsletter 2026",
    //   desc: "Your portal to the universe, delivering deep space insights, theoretical physics, and cosmic exploration updates.",
    //   image: "/assets/publications/Antarikshvani - VIT Stellar Newsletter 2026.webp",
    //   file: "/assets/publications/Antarikshvani - VIT Stellar Newsletter 2026.pdf",
    // },
    {
      title: "23rd National Space Science Symposium",
      desc: "Publication by Technical Team Captain Mahak Yadav at the 23rd National Space Science Symposium, Page 284, showcasing research excellence.",
      image: "/assets/publications/23rd National Space Science Symposium.webp",
      file: "/assets/publications/23rd National Space Science Symposium.pdf",
    },
    {
      title: "Antarikshvani - VIT Stellar Newsletter 2025",
      desc: "A survey of 400+ young stellar clusters used to refine the local galaxy's spiral structure and rotation curve.",
      image: "/assets/publications/Antarikshvani - VIT Stellar Newsletter 2025.webp",
      file: "/assets/publications/Antarikshvani - VIT Stellar Newsletter 2025.pdf",
    },
    {
      title: "Stellar Newsletter 2024",
      desc: "Ground-based light-curve analysis identifying candidate transits around three low-mass main-sequence stars.",
      image: "/assets/publications/Stellar Newsletter 2024.webp",
      file: "/assets/publications/Stellar Newsletter 2024.pdf",
    },
  ],
};

export const Blogs = {
  items: [
    {
      title: "The Science of Stillness: How We Study the Universe Without Ever Touching It",
      author: "Lavu Anvita",
      image: "/assets/blogs/The Science of Stillness.webp",
      body: "In the vast theatre of science, most disciplines begin with contact. We humans come to understand the world through our senses. We taste to know if something is ripe, touch to gauge its texture, listen for patterns in the air, watch for movement, and smell for danger or delight. Even our sciences follow this instinct, they press, stir, split, examine, and handle the world to coax meaning from matter. However, there is a peculiar paradox in astronomy: it is a science of the physical world, and yet, one in which the subject can never be touched, never be held, never be brought into a laboratory. One that peers across unimaginable distances, receiving only the gentlest trace of light, without ever once laying hands on what it studies. It is a science conducted entirely at a distance, and perhaps because of that, it reveals truths closer to the soul.\nIn astronomy, light is everything. A single photon from a distant galaxy may have begun its journey before humans stood upright, only to end its voyage in a telescope lens or an astronomer’s eye. It carries within it the signature of its birthplace: the temperature of a star’s surface, the composition of a nebula, the motion of a galaxy.To study the universe is to study this light. That light, however old or faint, tells stories written in spectral lines and subtle shifts. We don’t experiment on the universe. We listen. We interpret. And we imagine. A bright spot may look like a single star, but it’s a cluster of hundreds. A symmetrical galaxy may appear peaceful but could be in the aftermath of a violent collision. Astronomers learn to trust the math more than their eyes. In astronomy, what you see is not always what is, and yet, what can be found in the way light bends or shifts. It is the closest we come to reading letters written in a language older than humanity.\nWhat makes this more remarkable is the level of precision it allows. We know the structure of stars we will never reach and can map the invisible pull of black holes through distortions in light, but not the full depths of our own oceans. We can estimate the diameter of a neutron star thousands of light-years away to the kilometre, though it would crush all memory of form if held in the palm. And we do this not through contact, but through patience, through mathematics, interpretation, and long listening. Astronomy does not permit intervention. It only offers clues. We make meaning not by asking the universe to respond, but by learning how to read its stillness.Astronomy relies on inference, the patient art of connecting what we see to what must be. From the redshift of a galaxy, we deduce its velocity and distance. From the dimming of a star, we infer the orbit of an unseen exoplanet. From warped light paths, we discover black holes that bend space itself. Astronomy is not experimentation; it is interpretation.Unlike other sciences, astronomy operates on a time delay. We never see the cosmos as it is, only as it was. The night sky is not a snapshot but a layered palimpsest of different centuries. We navigate not just space, but time. And sometimes, what we observe no longer even exists.The farther we look, the further back in time we see. Telescopes are not just optical instruments; they are time machines. Light travels with time stitched into its movement, so to gaze at a star ten million light-years away is to see it ten million years ago. In astronomy, every glimpse of the cosmos is a glimpse into history, we never see the universe now, only its echo from the past.And here lies a quiet truth: the night sky is never “live.” The constellations above us are illusions of simultaneity, each star telling its own story from a different epoch. The light of some stars began its journey before telescopes existed. Others began shining before Earth knew humans.\nIn the stillness of observation lies astronomy’s uniqueness. It does not rush. It waits. It records. It contemplates. An astronomer may spend years collecting data on a single supernova, knowing it will never appear again. Instruments may be designed to catch a single gravitational wave, a ripple from an ancient collision that occurred when multicellular life had only just begun to form on Earth. Despite being confined to one rotating planet in one solar system, astronomy aims to map the entire universe. It's the most ambitious extrapolation in all of science. Where other sciences are active, astronomy is contemplative, a science of presence, not of pressure.\nThis discipline, strangely distant, feels deeply human. Perhaps it’s because in studying the stars, we study ourselves. The atoms in our bodies were forged in the hearts of ancient suns. When we observe the cosmos, we are not just looking outward, we are remembering where we came from. And yet, for all its remoteness, astronomy is perhaps the most human of sciences. It evokes awe in the way a drop of acid or a petri dish never can. To gaze at Saturn’s rings or the Andromeda galaxy is to confront not only the cosmos, but also the profound question of our place within it.\nCarl Sagan captured this with haunting clarity in the image of the Pale Blue Dot, Earth as seen from the edge of the solar system, suspended in a shaft of sunlight, barely a pixel in the darkness, everything we’ve ever known, every war, every act of love, every triumph and failure, has taken place on a speck barely visible from the edge of our own solar system. “Our posturings, our imagined self-importance”, he said “the delusion that we have some privileged position in the universe, are challenged by this point of pale light. To me, it underscores our responsibility to deal more kindly and compassionately with one another and to preserve and cherish that pale blue dot, the only home we've ever known.”\nAstronomy teaches humility in a way few sciences can. The universe offers no direct feedback. It does not bend to our curiosity, nor adjust itself for our instruments. It simply continues, vast, indifferent, and unhurried. And yet, in that silence, we are shaped. It calls for a mind that finds meaning not in ownership, but in understanding, not in haste, but in stillness.Yet, for all its distance, there is an unmistakable intimacy. Stargazing is a quiet ritual that has echoed across civilizations and millennia. To look at the night sky is to be part of something continuous, a kind of memory passed down in light. The very photons that now reach our telescopes once touched the eyes of Galileo or shimmered on the ocean-bound gaze of ancient navigators steering by Polaris. In those moments of stillness beneath the stars, the act becomes more than scientific, it becomes meditative. A quiet confrontation with the infinite, where we do not seek answers, but remember how to wonder.\nIn the end, astronomy is the act of loving something from afar. It is reading the light of something that may no longer exist and yet treating that light as sacred evidence. It is a science built not on manipulation, but on imagination, not on contact, but on connection. We may never touch what we study, and yet, it changes us. Perhaps that is the quiet miracle of astronomy: of all the sciences, it keeps the greatest distance from its subject and still leaves the deepest impression on its observer.",
    },
    {
      title: "The cosmic tug of war - how the great attractor shapes galactic motion",
      author: "Prateek Srinath",
      image: "/assets/blogs/The cosmic tug of war.webp",
      body: "The universe is a vast, dynamic canvas, constantly in motion. Galaxies are not only spreading apart due to cosmic expansion, but also subtly drifting, nudged and tugged by the invisible hands of gravity. In the 1970s and 1980s, astronomers stumbled upon a cosmic puzzle: our Milky Way, along with thousands of neighbouring galaxies, was moving at astonishing speeds—around 600 kilometres per second—toward a particular region of space. Yet, curiously, when astronomers peered in that direction, they found… nothing. No massive cluster. No clear explanation. This strange, unseen force became known as the Great Attractor.The trail of clues began with the cosmic microwave background (CMB)—the relic radiation from the Big Bang. The CMB is expected to be nearly uniform across the sky, but precise measurements revealed a subtle asymmetry: one hemisphere appeared slightly warmer, the other cooler. This variation, called the CMB dipole, was not a glitch—it was evidence of motion. It is suggested that our galaxy is moving through the universe with remarkable velocity in a specific direction, roughly toward the Centaurus constellation.\nUnder normal cosmic expansion, galaxies recede from each other evenly, like dots on an inflating balloon. But this observed “drift” toward something unseen suggested a gravitational influence pulling us inward—something dense and powerful enough to divert the path of entire galaxy groups.Despite decades of searching, the Great Attractor remains shrouded in darkness—not metaphorically, but literally. It lies behind the Zone of Avoidance, a thick swath of the night sky densely packed with stars, gas, and dust from our own Milky Way. This makes it nearly invisible in optical wavelengths.But astronomers didn’t give up. Instead, they adapted:\nInfrared and X-ray telescopes allowed scientists to peer through interstellar dust.\nRedshift surveys tracked how fast galaxies were moving and in what direction.\nPeculiar velocity maps helped chart deviations from the expected Hubble flow (the standard expansion of space).\nMost importantly, the CMB dipole continued to act as a cosmic compass, confirming that our motion wasn't random—it was being pulled.\nCollectively, these tools helped confirm that a gravitational anomaly—hidden though it may be—was influencing galactic motions across hundreds of millions of light-years.The Great Attractor isn’t a single object or galaxy. It’s best described as a dense region of the cosmic web, likely composed of massive galaxy clusters, hidden concentrations of dark matter, and possibly unknown forms of mass. Its gravitational reach extends over vast regions, enough to affect the motion of entire superclusters, including the one we live in.\nAnd yet, as astronomers peered deeper into the same direction, they discovered something even more massive.Located farther away than the Great Attractor is the Shapley Supercluster, one of the largest known mass concentrations in the nearby universe. Stretching across 650 million light-years. It contains more than 8,000 galaxies and exerts an even stronger gravitational pull than the Great Attractor.\nThis discovery led scientists to reconsider their model: perhaps the Great Attractor isn’t the main destination, but a midpoint in a larger river of galactic motion. Just as tributaries lead to a central stream, many galaxies—including ours—might be part of a cosmic flow directed ultimately toward the Shapley Supercluster.\nIn 2014, scientists redefined our place in the universe with a revolutionary map of galactic motion. They identified a sprawling supercluster called Laniakea, meaning “immense heaven” in Hawaiian. It stretches over 500 million light-years and contains over 100,000 galaxies, including our Milky Way.\n\nUnlike earlier maps based solely on position, Laniakea was charted by studying the motion of galaxies—how they fall inward along gravitational channels. At the center of this flow lies the Great Attractor. This means the mysterious mass isn't just influencing us; it’s effectively the gravitational heart of our supercluster, anchoring thousands of galaxies in motion.\nThe discovery of the Great Attractor, and the even more massive structures surrounding it, reveals an important truth: the universe is not evenly spread out. While the cosmological principle suggests that matter is roughly uniform on very large scales, local and regional gravitational variations create enormous structures—webs, nodes, and filaments where galaxies cluster and move.These flows cannot be fully explained by visible matter alone. The presence of dark matter—invisible, yet gravitationally significant—is essential. Its distribution shapes these cosmic highways, and the Great Attractor may sit at the intersection of several such dark matter veins.While most scientists agree the Great Attractor is a region of high mass concentration, it’s worth imagining: what if it’s something more exotic?Could the Great Attractor be a gateway to a different phase of space-time? A primordial black hole swarm? Or even a gravitational anomaly caused by quantum fluctuations on cosmic scales?Some fringe theories suggest it might be the leading edge of a larger structure beyond the observable universe—a gravitational echo from a multiverse collision or a leftover wrinkle from inflation. While these are speculative, they encourage us to keep asking questions and pushing the boundaries of what we think we know.The Great Attractor remains partially hidden, but its influence is undeniable. It sparked a rethinking of galactic motion, revealed hidden matter in the universe, and led to the identification of Laniakea—our true home in the cosmos.Though we cannot see it yet, its gravitational pull is real. And as telescopes grow more powerful and cosmic maps more precise, we inch closer to understanding the full picture. The Great Attractor may not just be a clue to local motion, but a signpost pointing us toward the deep architecture of the universe.\nIn the end, it's a mystery that reminds us that in space—and in science—not everything real is visible.",
    },
    {
      title: "Spaghettification in Our Solar System: A Cosmic Catastrophe",
      author: "Priyadharshini. V. S",
      image: "/assets/blogs/Spaghettification in Our Solar System.webp",
      body: "Imagine a rogue black hole wandering into our solar system an invisible entity with gravity so intense, it begins to reshape everything we know but before that, what is it exactly? A Black hole is a region of space where gravity is so intense that even light can’t escape from it. It forms when a massive star collapses under its own gravity at the end of its life. The mass of the star is compressed into an extremely small space, forming what’s called a singularity a point of infinite density. Despite being invisible, black holes can be detected by their effects on nearby matter and light. They can pull in gas, stars, and even light itself, creating fascinating effects around them. Continuing further, Planets fall out of orbit, pulled helplessly toward the dark abyss. As Earth approaches the event horizon, something terrifying begins: spaghettification.\nSurrounding the black hole is the event horizon the “point of no return.” Once something crosses this invisible boundary, it cannot escape. Even if you moved at the speed of light, you couldn’t get out. Think of it like a waterfall: imagine a river flowing toward a drop. Far from the edge, a swimmer can still paddle back to shore. But once they pass the edge (the event horizon), no effort can bring them back up. That’s how it works with gravity at the event horizon. All these bizarre behaviours come from Einstein’s theory of general relativity. Instead of thinking of gravity as a force like Newton did, Einstein described it as the warping of space and time together known as spacetime by mass and energy. A Black hole is a place where this warping becomes extreme. Imagine placing a heavy ball on a trampoline. The fabric dips. Smaller balls roll toward the centre. That’s how gravity works in relativity: objects curve the fabric of spacetime, and other objects move along that curvature.In relativity, time doesn't tick the same everywhere. Near a strong gravitational field, like that of a black hole, time slows down. This is called gravitational time dilation. Suppose you're falling toward a black hole while your friend watches from far away. From their point of view, your clock ticks more and more slowly as you get closer to the event horizon. In fact, you’d appear to freeze just above the horizon and gradually fade away. But from your point of view, time feels normal. You fall in, cross the event horizon, and continue your journey toward the centre all in what feels like real-time.Now comes the dramatic part spaghettification.Black holes don't pull you in evenly. The gravitational force gets stronger the closer you are. That means if you're falling feet-first, your feet are closer to the singularity than your head, and feel a stronger pull. This difference in gravitational pull across your body is called a tidal force.\nDo You Die Instantly?\nThat depends on the size of the black hole: Stellar-mass black holes (a few times the Sun's mass) have very steep gravitational gradients. You would be stretched and torn apart before you even cross the event horizon. Death would be almost instantaneous. Supermassive black holes (millions to billions of solar masses), like the one at the centre of our galaxy, have a much gentler gradient near the event horizon. You could cross the horizon intact, with no immediate spaghettification. Only much deeper inside, closer to the singularity, would tidal forces rip you apart. So ironically, falling into a bigger black hole might let you survive longer. So what’s next Eventually, everything that falls into a black hole which heads toward the singularity, where density becomes infinite and physics as we know it breaks down. Whether anything can escape from inside or what exactly happens at the core is still unknown it’s one of the biggest mysteries in physics. Some theories suggest that quantum gravity or string theory might someday explain what happens, but for now, it’s hidden beyond the veil of the event horizon.Spaghettification isn’t just science fiction. it’s a real prediction from general relativity and physics. It combines time bending, space warping, and extreme gravity into one eerie outcome. By understanding black holes, event horizons, time dilation, and tidal forces, we begin to see how strange and beautiful the universe really is.",
    }, 
    {
      title: "Baryon Asymmetry: The Tiny Imbalance That Built The Universe",
      author: "Jiya Jaiswal",
      image: "/assets/blogs/Baryon Asymmetry.webp",
      body: "The universe should have been a perfect balance of matter and antimatter resulting in mutual annihilation but instead something rather tipped this quantitative cosmic scale in the favor of matter. This imbalance is known as Baryon Asymmetry and it’s one of the most profound unsolved problems in modern physics.\nAccording to cosmological models, matter and antimatter were created in equal quantities during the Big Bang. As the universe cooled, these particles should have collided and annihilated each other completely leaving only radiation behind. Yet, matter is everywhere around us while anti matter is rare in fact the remaining fraction, just one part in a billion is what makes up everything we see today.This leads us to come up with theories that could explain the phenomena that tipped the scale in favour of matter. To uncover this mystery, physicist Andrei Sakharov outlined three conditions and called them “Sakharov conditions”. The first being Baryon Number Violation which implies the usual conservation of baryons like protons and neutrons must be broken to generate more matter than antimatter.The second is based on C-Symmetry and CP-Symmetry Violation. C-symmetry means laws of physics are unchanged if particles are swapped with their antiparticles. CP-symmetry combines this with spatial reflection. Both need to be violated for matter to behave differently than antimatter.At last Departure from Thermal Equilibrium which says if the universe stayed in perfect thermal balance, matter and antimatter would have been erased equally but during rapid changes like the electroweak phase transition, the universe fell out of equilibrium allowing any small asymmetries to freeze in Many theories have been proposed to satisfy the Sakharov conditions and explain the matter-antimatter imbalance. One such idea is Electroweak Baryogenesis which proposes that during the early universe’s phase transitions, CP-violating interactions at expanding bubble boundaries could generate a baryon surplus. However, the Standard Model’s version of this phase transition is too weak, and stronger transitions would require new particles, like extra Higgs bosons.Another promising theory is Leptogenesis that suggests that heavy right-handed neutrinos decayed asymmetrically, creating a lepton imbalance that was later converted into baryon asymmetry through sphaleron processes. This theory is especially promising because it could also explain the tiny masses of observed neutrinos.Finally,GUT Baryogenesis involves the decay of massive particles predicted by Grand Unified Theories. These decays would naturally violate both baryon number and CP symmetry at extremely high energies, making them a strong candidate for the source of the asymmetry. Asymmetric Dark Matter theories go a step further, proposing that the same mechanism responsible for baryon asymmetry also created an imbalance between dark matter and dark antimatter. This could explain why the observed amount of dark matter is roughly five times that of ordinary matter without requiring symmetric dark-antidark annihilations.\nDespite these possible explanations, baryon asymmetry isn't completely answered. Experiments continue to search for stronger CP violations, especially in baryon decays, and future particle accelerators or cosmological observations may help broaden our understanding. The problem isn't just academic, solving it could reshape our understanding of the universe’s origin, the fate of antimatter, and the nature of dark matter itself. Until then, baryon asymmetry stands as a beacon guiding physicists toward a deeper, more complete theory of reality.",
    },
    {
      title: "Asteroid Mining - The Journey from Space Rocks to Goldmines",
      author: "P. Varshaa",
      image: "/assets/blogs/Asteroid Mining.webp",
      body: "What would happen if the next biggest treasure hunt does not occur on Earth, but on a chunk of rock 20 million miles away? Well, buckle up, because these huge and dusty space stones might actually be the universe’s hidden treasure chests, loaded with precious metals and other resources that could kickstart a new expedition. Say hello to Asteroid mining - it has been the hot topic amongst budding researchers and scientists for its exciting outcomes. Asteroid mining is the complex process of extracting precious and valuable resources like water, iron, cobalt and platinum from asteroids. Platinums are very expensive and cool, but this isn't just about extracting resources to be rich. Asteroid mining is about creating a future where we can build, live, and explore beyond Earth, using the very rocks drifting in space as our fuel and foundation.Asteroids are considered to be rocks that float in space, but in reality, there is more to these huge chunks of wanderers. They are known to be insanely valuable. One metallic asteroid is found to contain almost 10,000 quadrillion USD or 100,000 crores INR worth of metals. These enormous rocks also contain valuable resources, such as water, which can be broken down into H2O2, and we use this to power our fuel cells for rockets. It's a fact that we have an abundance of water on our Earth, but instead of carrying the majority of supplies from Earth, which is expensive and exploits ground resources, asteroid mining allows us to 'live off the land' in space. This concept is called ISRU- In Situ Resource Utilisation.How can one mine a rock that's flying through space at a thousand km per hour velocity? It soounds extremely impossible, but space scientists have been researching some clever ways to make it happen. From spotting the right rock to figuring out how to grab stuff without floating off into space, every step is a mysterious puzzle. Let’s break it down! The process of asteroid mining has 4 huge steps to it. The first step is where the scientists conduct telescopic observations to identify the most suitable rock, followed by sending robots on missions to bring these rocks to Earth. Once this resourceful rock had landed, the mining process would commence, where drilling, heating and mechanical collection would be done. The final process includes sending the mined resources to space stations and other industries to make good use of these asteroids.Asteroid mining is more than just a dream now! NASA’s OSIRIS-REx mission made it to the top of headlines when it went up to meet an asteroid named Bennu, collected some of its dust, and brought it back home. Japan's space agency did something similar and cool. Hayabusa missions by Japan ended up collecting tiny pieces from asteroids Itokawa and Ryugu, like space seashells. These missions weren’t completely about mining, but they proved that mining material from huge space rocks is possible. A few private companies also jumped in early, like Planetary Resources and Deep Space Industries. They had big dreams of mining in space, but real-world challenges forced them to slow down or shift focus. Various countries like the U.S, China, and Luxembourg are also now heavily investing in asteroid mining. It is true that till date there is no evidence of active mission, but its crystal clear that asteroid mining has a huge role to play in the future.Asteroid mining sounds pretty simple. All one has to do is bring the asteroid down, mine it and extract the resourceful elements. But asteroid mining has a lot more to it and it is not as simple as it sounds which is one of the major reasons for scientists to hold it back till date. There are various technical challenges acting as a huge barrier to asteroid mining. Asteroid landing sounds simple, but landing on rocks with zero gravity, which float in space, is tricky. Then there is a need for simple and cost efficient machines to mine without man labour, and after collecting all valuable resources, storing them in a safe and sound environment is critical. Apart from technical challenges, scientists are debating about asteroid mining and its ethical considerations. Questions like “Who owns Space and its resources?” and “Could mining disrupt the solar system?” are part of the ongoing ethical challenges. Asteroid mining can only happen if all these challenges are overcome.Asteroid mining is not just a far-off sci-fi dream anymore; it’s shaping up to be a real part of our space future. With active missions revolving around this concept, asteroid mining has emerged as one of the major missions for science. In the upcoming decades, we might get to see the mining that supports space stations or even provides fuel for deeper exploration. While there are still big challenges that need to be studied, one thing has come clear: the next resource race may not happen on Earth, but somewhere far above it, drifting silently among the stars.",
    },
  ],
};

export const Partners = {
  items: [
    { name: "Intec",             logo: "/assets/partners/intec.webp", },
    { name: "Thrust Tech India", logo: "/assets/partners/thrust-tech.webp", url: "https://www.thrusttechindia.com/" },
    { name: "Space India",       logo: "/assets/partners/space.webp",      url: "https://space-india.com/" },
    { name: "Foxmula",           logo: "/assets/partners/foxmula.webp",  },
    { name: "SEH",               logo: "/assets/partners/seh.webp",  },
    { name: "hART",              logo: "/assets/partners/hart.webp",  },
  ],
};

export const Gallery = {
  items: [
    { src: "/assets/gallery/1.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/2.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/3.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/4.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/5.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/6.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/7.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/8.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/9.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/10.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/11.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/12.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/13.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/14.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/15.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/16.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/17.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/18.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/19.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/20.webp", hasPlay: false, alt: "Mountain range at golden hour" },
    { src: "/assets/gallery/21.webp", hasPlay: false, alt: "Mountain range at golden hour" },
  ],
};

export const Faq = {
  items: [  
    { 
      q: "What is VIT Stellar?", 
      a: "VIT-STELLAR is the official Astronomy Club of VIT, bringing together students interested in astronomy, space science, technology, research, and exploration. The club provides a platform for students to learn, collaborate, organize and participate in events, and contribute to various technical and creative initiatives." 
    },
    { 
      q: "Do I need prior knowledge of astronomy or technical experience to join?", 
      a: "No. Prior knowledge or experience is not required. Students who are curious, enthusiastic, and willing to learn and contribute are welcome to join." 
    },
    { 
      q: "How can I become a member of VIT-STELLAR?", 
      a: "Students can officially join the club through VTOP when club registrations are open. Updates regarding registrations will be communicated through the club’s official channels." 
    },
  ],
};
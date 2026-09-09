// src/data/mentorshipPrograms.js
import mentorImg1 from "../assets/events/mentorshipProgram1.jpg";
import mentorImg2 from "../assets/events/mentorshipProgram2.jpg";
import mentorImg3 from "../assets/events/mentorshipProgram3.jpg";
import mentorImg4 from "../assets/events/mentorshipProgram4.jpg";
import mentorImg5 from "../assets/events/mentorshipProgram5.jpg";

export const mentorshipPrograms = [
  {
    id: "executive-leadership",
    title: "Executive & Youth Leadership Mentorship",
    tagline: "Shaping ethical, visionary youth leaders for national and county governance.",
    badge: "Leadership Track",
    image: mentorImg1,
    description:
      "A high-impact leadership incubator connecting emerging youth leaders, student council presidents, and grassroots organisers with seasoned executives, governance specialists, and civic leaders.",
    format: "Cohort-based & Roundtable Sessions",
    duration: "12 Weeks",
    targetAudience: "Student leaders, young executives, aspiring public servants, and community champions",
    keyOutcomes: [
      "Ethical leadership frameworks & governance fundamentals",
      "Public speaking, advocacy & strategic communication",
      "County & national community impact project execution",
      "Direct boardroom mentorship & networking mixers"
    ],
    highlight: "Featured in our UFA National Leadership Roundtables"
  },
  {
    id: "career-acceleration",
    title: "1-on-1 Career & Professional Development Track",
    tagline: "Bridging the gap between academic education and industry excellence.",
    badge: "Career Track",
    image: mentorImg2,
    description:
      "Personalized one-on-one mentorship matching university students and young graduates with established professionals across finance, technology, law, communications, and public administration.",
    format: "1-on-1 Personalized Mentoring",
    duration: "6 Months",
    targetAudience: "Final-year students, recent graduates, and early-career professionals",
    keyOutcomes: [
      "Tailored 3-year career roadmap & milestone planning",
      "Professional networking etiquette & executive presence",
      "Industry-specific interview preparation & portfolio building",
      "Continuous progress reviews with senior industry mentors"
    ],
    highlight: "Direct pairing with vetted corporate & industry mentors"
  },
  {
    id: "strategy-capacity",
    title: "Interactive Strategy & Community Action Workshops",
    tagline: "Turning youth potential into structured grassroots community solutions.",
    badge: "Action Workshop",
    image: mentorImg3,
    description:
      "Intensive participatory workshops where youth collaboratively analyze societal challenges in their counties, craft actionable intervention blueprints, and learn project proposal writing.",
    format: "Hands-on Workshops & Field Labs",
    duration: "Bi-weekly Sessions",
    targetAudience: "Community organisers, grassroots youth groups, and social entrepreneurs",
    keyOutcomes: [
      "Human-centered community needs assessment",
      "Proposal writing & donor engagement strategies",
      "Monitoring, evaluation & impact reporting metrics",
      "Collaborative problem solving & stakeholder management"
    ],
    highlight: "Translates UFA's Connect → Mentor → Lead → Serve pathway"
  },
  {
    id: "job-readiness",
    title: "Practical Skills & Job Readiness Accelerator",
    tagline: "Equipping young Kenyans with in-demand employability and workplace competencies.",
    badge: "Employability",
    image: mentorImg4,
    description:
      "Practical clinics focused on real-world market readiness. Mentees refine their CVs, complete mock technical interviews, master workplace software, and build stand-out portfolios.",
    format: "Hybrid Masterclasses & Practical Labs",
    duration: "8 Weeks",
    targetAudience: "Job seekers, interns, entry-level professionals, and vocational trainees",
    keyOutcomes: [
      "ATS-optimised resume & professional LinkedIn branding",
      "Workplace productivity tools & digital collaboration",
      "Simulated corporate interviews with hiring managers",
      "Access to exclusive UFA partner internship openings"
    ],
    highlight: "Direct pipeline to partner job boards and internship opportunities"
  },
  {
    id: "tech-innovation",
    title: "Tech, Innovation & Digital Skills Mentorship",
    tagline: "Harnessing technology and entrepreneurship to solve community challenges.",
    badge: "Innovation Track",
    image: mentorImg5,
    description:
      "Specialized mentorship guiding young technologists, creators, and digital innovators in software, digital media, e-commerce, and creative tech to build sustainable solutions.",
    format: "Project-based Mentoring & Hackathons",
    duration: "10 Weeks",
    targetAudience: "Aspiring developers, tech enthusiasts, creators, and digital freelancers",
    keyOutcomes: [
      "Modern digital tools & scalable tech product architecture",
      "Freelancing & remote work readiness for global markets",
      "Product pitching to tech founders & angel investors",
      "Collaborative open-source and civic tech development"
    ],
    highlight: "Mentors from leading Kenyan and global tech ecosystems"
  }
];

// src/data/pastEvents.js
import eventPoster1 from "../assets/events/pastEvent1.jpg";
import eventPoster2 from "../assets/events/pastEvent2.jpg";
import eventPoster3 from "../assets/events/pastEvent3.jpg";
import eventPoster4 from "../assets/events/pastEvent4.jpg";
import eventPoster5 from "../assets/events/pastEvent5.jpg";

export const pastEvents = [
  {
    id: "mental-health-mindset-talk",
    title: "Mental Health Talk: Your Mindset Matters",
    subtitle: "Rewriting the Inner Narrative",
    category: "Mental Health Awareness",
    date: "Friday, 22nd May",
    time: "From 8:30 PM EAT",
    platform: "Google Meet",
    image: eventPoster1,
    partners: [
      { name: "GM Companies (Muroki Grace Companies)", role: "Co-Host" },
      { name: "CONNECT Community Network", role: "Collaborator" },
      { name: "UFA Kenya", role: "Lead Organizer" }
    ],
    hashtags: ["#YoureNotAlone", "#EndTheStigma", "#YouthForYouth"],
    speakers: [
      {
        name: "Winfred Shem",
        title: "Chief Empowerment Officer & Social Welfare Director, UFA",
        role: "Keynote Speaker",
        image: eventPoster2
      },
      {
        name: "Ms. Grace Muroki",
        title: "CEO, GM Companies",
        role: "Mindset & Transformational Speaker",
        image: eventPoster3
      }
    ],
    overview:
      "An open, empathetic virtual dialogue addressing the psychological pressures facing Kenya's youth. The session tackled mental health stigmas, introduced actionable cognitive reframing techniques, and established ongoing peer support networks.",
    keyTakeaways: [
      "Deconstructing toxic societal pressures and cultivating healthy self-compassion",
      "Techniques for rewriting damaging internal narratives and overcoming imposter syndrome",
      "Confidential access pathways for professional counseling and peer support groups",
      "The role of youth community networks in building emotional resilience"
    ]
  },
  {
    id: "youth-mental-health-summit",
    title: "Virtual Talk: It is Okay Not to Be Okay",
    subtitle: "Youth and Mental Health in a Fast-Paced World",
    category: "Mental Health Awareness",
    date: "11th April 2026",
    time: "8:30 PM EAT",
    platform: "Google Meet",
    image: eventPoster4,
    partners: [
      { name: "Peter Salasya Foundation (PSF)", role: "Co-Host Partner" },
      { name: "UFA Kenya", role: "Organizer" }
    ],
    hashtags: ["#MentalHealthMatters", "#YouthWellness", "#UFAKenya"],
    speakers: [
      {
        name: "Ms. Grace Muroki",
        title: "Mental Health Coach",
        role: "Panelist"
      },
      {
        name: "Emmanuel Wafula",
        title: "Career Mentor & Youth Counsellor",
        role: "Panelist"
      },
      {
        name: "Cleopus Ngatia",
        title: "Counseling Psychologist",
        role: "Clinical Expert"
      },
      {
        name: "Angela Nabwire",
        title: "Counseling Psychologist (Chief Finance Officer, UFA)",
        role: "Mental Health Specialist"
      }
    ],
    overview:
      "Organized in partnership with the Peter Salasya Foundation (PSF), this premier virtual conference united clinical psychologists, youth counselors, and hundreds of young Kenyans to explore holistic mental well-being, academic and career burnout, and emotional wellness.",
    keyTakeaways: [
      "Clinical indicators of anxiety, depression, and chronic burnout in youth",
      "Practical coping mechanisms for stressful career transition phases after graduation",
      "Destigmatizing mental healthcare conversations within families and peer groups",
      "Building resilient community care circles across regional county chapters"
    ]
  },
  {
    id: "women-in-politics-forum",
    title: "Virtual Talk: Women in Politics",
    subtitle: "Participation, Tokenism or Leadership?",
    category: "Leadership & Governance",
    date: "14th March 2026",
    time: "8:30 PM EAT",
    platform: "Google Meet",
    image: eventPoster5,
    partners: [
      { name: "UFA Kenya Siaya County Chapter", role: "Lead Chapter" },
      { name: "Machakos University Student Association", role: "Youth Partner" }
    ],
    hashtags: ["#WomenInLeadership", "#YouthGovernance", "#UFAKenya"],
    speakers: [
      {
        name: "Ethel Subira Akinyi",
        title: "National Vice Chair 1 / Siaya County Chapter Leader, UFA",
        role: "Moderator & Key Speaker"
      },
      {
        name: "Julia Obuba Nyagwansa",
        title: "Journalist & Media Advocate",
        role: "Guest Speaker"
      },
      {
        name: "Ashley Chepkoech",
        title: "President, Machakos University",
        role: "Youth Governance Voice"
      },
      {
        name: "Emmanuel Magoba",
        title: "Political Scientist & Policy Analyst",
        role: "Policy Analyst"
      }
    ],
    overview:
      "A high-level governance discourse interrogating genuine political agency versus tokenistic representation for women and youth in Kenya. The forum provided direct strategic insights for aspiring young women in public leadership and student governance.",
    keyTakeaways: [
      "Overcoming systemic and cultural barriers to young women's political participation",
      "Moving beyond tokenistic appointments toward genuine policy influence and decision-making",
      "Grassroots organizing strategies for student council and county assembly aspirants",
      "Strengthening mentorship pipelines for young women leaders across Kenya"
    ]
  }
];

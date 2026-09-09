// src/data/ufaCore.js
import {
  Users,
  Compass,
  GraduationCap,
  HeartPulse,
  HeartHandshake,
  TrendingUp,
  Sparkles,
  TreePine,
  Lightbulb,
  Building2,
  BookOpen,
  Award,
  Globe2,
  SmilePlus
} from "lucide-react";

export const impactPathway = [
  {
    step: 1,
    name: "Connect",
    title: "Vibrant Networks",
    description: "Bringing young Kenyans together with peers, industry veterans, civic leaders, and organisations.",
    icon: Users
  },
  {
    step: 2,
    name: "Mentor",
    title: "Guided Wisdom",
    description: "Structured 1-on-1 and cohort guidance from seasoned mentors in tech, business, law, and governance.",
    icon: Compass
  },
  {
    step: 3,
    name: "Empower",
    title: "Skills & Capacity",
    description: "Hands-on workshops, technical masterclasses, mental health resilience, and job readiness tools.",
    icon: Lightbulb
  },
  {
    step: 4,
    name: "Lead",
    title: "Action & Voice",
    description: "Fostering ethical youth leaders who spearhead county chapter initiatives and policy discussions.",
    icon: Award
  },
  {
    step: 5,
    name: "Serve",
    title: "Grassroots Action",
    description: "Mobilising youth, resources, and institutional partners to address real, urgent community challenges.",
    icon: HeartHandshake
  },
  {
    step: 6,
    name: "Create Impact",
    title: "Sustainable Change",
    description: "Empowered young people driving self-reliance, community progress, and environmental stewardship.",
    icon: Sparkles
  }
];

export const ufaPillars = [
  {
    id: "networking",
    title: "Youth Networking",
    icon: Users,
    tagline: "Connecting across counties and industries",
    description: "Connecting young people with peers, professionals, leaders, and organisations across Kenya to unlock lifelong collaboration."
  },
  {
    id: "mentorship",
    title: "Mentorship & Career Development",
    icon: Compass,
    tagline: "Unlocking professional clarity and purpose",
    description: "Providing structured guidance, career coaching, exposure to emerging industries, and direct access to seasoned mentors."
  },
  {
    id: "leadership",
    title: "Leadership Development",
    icon: Award,
    tagline: "Cultivating ethical and visionary leaders",
    description: "Organising leadership talks, governance forums, and experiential learning opportunities for aspiring young leaders."
  },
  {
    id: "skills",
    title: "Skills & Job Readiness",
    icon: GraduationCap,
    tagline: "From classroom knowledge to workplace excellence",
    description: "Equipping youth with practical, technical, and professional competencies in resume building, interviews, and digital productivity."
  },
  {
    id: "mental-health",
    title: "Mental Health Awareness",
    icon: HeartPulse,
    tagline: "Normalising well-being & breaking stigmas",
    description: "Creating empathetic platforms and candid conversations around mental well-being, psychological safety, and youth resilience."
  },
  {
    id: "community-engagement",
    title: "Community Engagement",
    icon: HeartHandshake,
    tagline: "Responding to genuine local needs",
    description: "Involving young people in meaningful activities that directly respond to real social, economic, and community challenges."
  },
  {
    id: "community-empowerment",
    title: "Community Empowerment",
    icon: TrendingUp,
    tagline: "Building self-reliance & local capacity",
    description: "Supporting individuals and grassroots communities to identify economic opportunities, build internal capacity, and thrive."
  },
  {
    id: "community-support",
    title: "Community Support",
    icon: SmilePlus,
    tagline: "Practical help where it matters most",
    description: "Mobilising volunteers, institutional partners, and emergency resources to deliver practical aid to vulnerable community members."
  },
  {
    id: "environment-social",
    title: "Environmental & Social Initiatives",
    icon: TreePine,
    tagline: "Stewardship for our shared climate future",
    description: "Inspiring youth to actively participate in conservation, tree-planting, cleanups, and social well-being campaigns."
  }
];

export const whoCanParticipate = [
  {
    id: "students",
    title: "Students & Young Professionals",
    description: "Undergraduates, vocational students, recent graduates, and early-career changemakers seeking mentorship and job readiness.",
    icon: BookOpen,
    role: "Learn & Grow"
  },
  {
    id: "entrepreneurs",
    title: "Entrepreneurs & Innovators",
    description: "Founders, tech innovators, and creative freelancers building ventures that solve local community and market challenges.",
    icon: Lightbulb,
    role: "Innovate & Build"
  },
  {
    id: "youth-leaders",
    title: "Youth Leaders & Organisers",
    description: "Student council leaders, grassroots activists, and chapter coordinators mobilizing communities for positive action.",
    icon: Award,
    role: "Lead & Mobilise"
  },
  {
    id: "mentors",
    title: "Mentors & Seasoned Professionals",
    description: "Corporate executives, doctors, engineers, lawyers, academics, and veterans passionate about guiding the next generation.",
    icon: Compass,
    role: "Guide & Invest"
  },
  {
    id: "cbos",
    title: "Community-Based Organisations",
    description: "Local grassroots groups, youth clubs, and welfare associations working together for amplified local impact.",
    icon: HeartHandshake,
    role: "Collaborate & Serve"
  },
  {
    id: "institutions",
    title: "Companies & Institutions",
    description: "Corporate sponsors, universities, and technical colleges investing in youth employment, CSR, and capacity building.",
    icon: Building2,
    role: "Partner & Sponsor"
  },
  {
    id: "development-partners",
    title: "Development Partners & NGOs",
    description: "International foundations, civil society groups, and public agencies championing sustainable development goals.",
    icon: Globe2,
    role: "Fund & Scale"
  },
  {
    id: "supporters",
    title: "Supporters & Volunteers",
    description: "Anyone passionate about youth empowerment. You don't have to be established or influential—all are warmly welcomed.",
    icon: Users,
    role: "Belong & Support"
  }
];

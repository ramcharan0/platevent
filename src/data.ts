import { AuthAccount, Event, UserProfile } from "./types";

export const INITIAL_EVENTS: Event[] = [
  {
    id: "evt-1",
    title: "Community Launch Expo 2026",
    description: "A hands-on event for attendees to discover new programs, meet organizers, and register for sessions and volunteer roles.",
    longDescription: "Join students, organizers, volunteers, and local partners for a polished event showcase focused on registrations, scheduling, staffing, and venue coordination. The expo highlights practical planning, clear communication, and smooth check-in workflows.",
    date: "2026-06-15",
    time: "09:00 AM - 05:00 PM IST",
    location: "Mumbai International Convention Centre (and Online)",
    type: "Conference",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    organizerEmail: "events@communitylaunch.org",
    budgetTotal: 1500000,
    budgetSpent: 420000,
    budgetItems: [
      { id: "bud-1", name: "Venue setup and cleaning", amount: 200000, category: "operations" },
      { id: "bud-2", name: "Refreshments for attendees", amount: 450000, category: "catering" },
      { id: "bud-3", name: "Session materials and recognition awards", amount: 500000, category: "prizes" },
      { id: "bud-4", name: "Event promotion and outreach", amount: 150000, category: "marketing" },
      { id: "bud-5", name: "Badges, signage, and printed schedules", amount: 200000, category: "operations" }
    ],
    sponsorshipPackages: [
      { id: "pkg-1", tier: "Platinum", price: 500000, perks: ["Opening remarks slot", "Premium booth space", "Logo on event signage and materials", "Two reserved guest passes"], spots: 2, spotsLeft: 1 },
      { id: "pkg-2", tier: "Gold", price: 300000, perks: ["Session hosting opportunity", "Standard booth space", "Branding on website and schedules", "Social media acknowledgement"], spots: 4, spotsLeft: 3 },
      { id: "pkg-3", tier: "Silver", price: 150000, perks: ["Banner logo placement", "Digital recognition", "One attendee pass included"], spots: 6, spotsLeft: 6 }
    ],
    volunteerRoles: [
      { id: "vrole-1", roleName: "Session Host", spots: 10, spotsLeft: 8, description: "Support attendees, keep sessions on schedule, and answer basic event questions.", skillsRequired: ["Communication", "Coordination", "Customer Support"] },
      { id: "vrole-2", roleName: "Logistics Lead", spots: 5, spotsLeft: 2, description: "Coordinate check-ins, materials distribution, and event timing.", skillsRequired: ["Coordination", "Leadership"] },
      { id: "vrole-3", roleName: "Content Assistant", spots: 3, spotsLeft: 3, description: "Capture event highlights and help share updates with attendees.", skillsRequired: ["Content Writing", "Photography"] }
    ],
    registrations: 247,
    maxRegistrations: 350,
    agenda: [
      { id: "ag-1", time: "09:00 AM", activity: "Doors open and attendee check-in" },
      { id: "ag-2", time: "10:00 AM", activity: "Opening remarks and program overview" },
      { id: "ag-3", time: "11:30 AM", activity: "Guided networking and role matching" },
      { id: "ag-4", time: "01:00 PM", activity: "Lunch and breakout sessions" },
      { id: "ag-5", time: "04:30 PM", activity: "Wrap-up, feedback, and announcements" }
    ],
    certificatesConfigured: true
  },
  {
    id: "evt-2",
    title: "Planning and Operations Symposium",
    description: "A focused forum for organizers to review schedules, staffing, communications, and event-day readiness.",
    longDescription: "A curated series of presentations, panel discussions, and roundtables. Participants will review practical planning workflows, staffing strategies, communication templates, and post-event feedback processes.",
    date: "2026-07-02",
    time: "10:00 AM - 04:00 PM IST",
    location: "The Ashoka Hall, New Delhi",
    type: "Symposium",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    organizerEmail: "ops@symposiumhub.org",
    budgetTotal: 840000,
    budgetSpent: 300000,
    budgetItems: [
      { id: "bud-6", name: "Speaker honorarium", amount: 300000, category: "operations" },
      { id: "bud-7", name: "Printed planning materials", amount: 120000, category: "operations" },
      { id: "bud-8", name: "Audio-visual team", amount: 220000, category: "operations" },
      { id: "bud-9", name: "Organic morning coffee + lunches", amount: 200000, category: "catering" }
    ],
    sponsorshipPackages: [
      { id: "pkg-4", tier: "Gold", price: 250000, perks: ["Panel presentation panelist seat", "Branding in the print toolkit Booklet", "Prominent signage at the main entrance"], spots: 2, spotsLeft: 2 },
      { id: "pkg-5", tier: "Silver", price: 120000, perks: ["Standard branding on slides", "Resume access of award applicants"], spots: 5, spotsLeft: 4 }
    ],
    volunteerRoles: [
      { id: "vrole-4", roleName: "Panel Moderator Support", spots: 2, spotsLeft: 1, description: "Help manage Q&A slido and pass microphones to attendees.", skillsRequired: ["Public Speaking", "Quick Thinking"] },
      { id: "vrole-5", roleName: "Reception & Registration Host", spots: 4, spotsLeft: 4, description: "Check QR-coded tickets and distribute attendee badges.", skillsRequired: ["Customer Service", "Attention to Detail"] }
    ],
    registrations: 98,
    maxRegistrations: 120,
    agenda: [
      { id: "ag-6", time: "10:00 AM", activity: "Opening address and event overview" },
      { id: "ag-7", time: "11:15 AM", activity: "Panel discussion: planning challenges and best practices" },
      { id: "ag-8", time: "12:30 PM", activity: "Networking lunch" },
      { id: "ag-9", time: "01:45 PM", activity: "Breakout circles and action planning" }
    ],
    certificatesConfigured: true
  },
  {
    id: "evt-3",
    title: "Creative Event Design Workshop",
    description: "An interactive workshop focused on event branding, signage, and presentation design.",
    longDescription: "Learn how to create clear event visuals without relying on generic templates. We cover layout, typography, presentation rhythm, and simple motion cues for polished event experiences.",
    date: "2026-06-28",
    time: "01:00 PM - 05:00 PM IST",
    location: "Bangalore School of Design (and Online)",
    type: "Workshop",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    organizerEmail: "design@eventcraftstudio.org",
    budgetTotal: 400000,
    budgetSpent: 80000,
    budgetItems: [
      { id: "bud-10", name: "Interactive visual assets package", amount: 50000, category: "operations" },
      { id: "bud-11", name: "Guest designer fees", amount: 150000, category: "operations" },
      { id: "bud-12", name: "High-speed workshop internet lease", amount: 50000, category: "operations" },
      { id: "bud-13", name: "Snacks and refreshments station", amount: 150000, category: "catering" }
    ],
    sponsorshipPackages: [
      { id: "pkg-6", tier: "Gold", price: 200000, perks: ["5-minute sponsor lightning intro session", "Brand inclusion in tutorial files", "Standard booth in lobby"], spots: 2, spotsLeft: 2 },
      { id: "pkg-7", tier: "Silver", price: 100000, perks: ["Logo in design slides template", "Include custom sponsor stickers in attendee packets"], spots: 4, spotsLeft: 4 }
    ],
    volunteerRoles: [
      { id: "vrole-6", roleName: "Workshop Assistant", spots: 4, spotsLeft: 3, description: "Walk around and assist attendees during the session.", skillsRequired: ["Communication", "Patience", "Support"] }
    ],
    registrations: 45,
    maxRegistrations: 60,
    agenda: [
      { id: "ag-10", time: "01:00 PM", activity: "Event branding principles and visual planning" },
      { id: "ag-11", time: "02:15 PM", activity: "Hands-on exercise: signage and layout composition" },
      { id: "ag-12", time: "03:30 PM", activity: "Presentation polish and transitions" },
      { id: "ag-13", time: "04:30 PM", activity: "Showcase and feedback session" }
    ],
    certificatesConfigured: false
  },
  {
    id: "evt-4",
    title: "Community Networking Mixer",
    description: "An open social mixer for attendees, speakers, volunteers, and partners to connect in a relaxed setting.",
    longDescription: "Exchange ideas, find collaborators, and strengthen your event community in a warm, welcoming space. Enjoy refreshments, conversation prompts, and a structured networking flow.",
    date: "2026-07-15",
    time: "06:00 PM - 09:30 PM IST",
    location: "Chennai Central Cultural Hall, Lounge Room",
    type: "Social",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
    organizerEmail: "community@networkingmixer.org",
    budgetTotal: 250000,
    budgetSpent: 210000,
    budgetItems: [
      { id: "bud-14", name: "Lounge venue rental", amount: 180000, category: "venue" },
      { id: "bud-15", name: "Refreshment service", amount: 160000, category: "catering" },
      { id: "bud-16", name: "Live music honorarium", amount: 60000, category: "operations" },
      { id: "bud-17", name: "Networking card printing", amount: 100000, category: "operations" }
    ],
    sponsorshipPackages: [
      { id: "pkg-8", tier: "Gold", price: 150000, perks: ["Sponsor the dynamic mocktail menu", "Exclusive banner slot", "Distribute hiring pamphlets"], spots: 3, spotsLeft: 2 },
      { id: "pkg-9", tier: "Bronze", price: 60000, perks: ["Logo placement in printed table networking cards", "1 social post shoutout"], spots: 5, spotsLeft: 5 }
    ],
    volunteerRoles: [
      { id: "vrole-7", roleName: "Welcoming Ally", spots: 8, spotsLeft: 6, description: "Greet attendees, allocate icebreaker cards, and introduce solo guests.", skillsRequired: ["Warmth", "Friendliness", "Empathy"] }
    ],
    registrations: 110,
    maxRegistrations: 150,
    agenda: [
      { id: "ag-14", time: "06:00 PM", activity: "Arrival and welcome drinks" },
      { id: "ag-15", time: "06:45 PM", activity: "Opening remarks and networking guide" },
      { id: "ag-16", time: "07:15 PM", activity: "Open networking and live entertainment" },
      { id: "ag-17", time: "09:00 PM", activity: "Closing remarks and follow-up introductions" }
    ],
    certificatesConfigured: false
  }
];

export const INITIAL_USER: UserProfile = {
  id: "usr-1",
  name: "Ravi Kumar",
  role: "organizer",
  email: "ravi.kumar@eventco.in",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  bio: "Event organizer focused on clear planning, team coordination, and smooth attendee experiences.",
  skills: ["Event Coordination", "Logistics", "Budget Management", "Public Speaking"],
  performanceScore: 98,
  achievements: [
    { id: "ach-1", title: "Reliable Organizer", description: "Successfully coordinated a high-attendance community event.", icon: "Award", date: "2026-03-12" },
    { id: "ach-2", title: "Partnership Builder", description: "Secured strong support for a multi-track event program.", icon: "DollarSign", date: "2026-04-20" }
  ]
};

export const INITIAL_AUTH_ACCOUNTS: AuthAccount[] = [
  {
    ...INITIAL_USER,
    password: "admin123",
  },
  {
    id: "usr-10",
    name: "Anjali Sharma",
    role: "sponsor",
    email: "anjali.sharma@optimatech.in",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    bio: "Sponsor representative focused on partnerships and event visibility.",
    company: "Optima Tech Ventures India",
    industry: "Technology",
    password: "sponsor123",
  },
  {
    id: "usr-11",
    name: "Lalit Mehra",
    role: "participant",
    email: "lalit.mehra@camp.edu.in",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    bio: "Participant interested in networking, learning, and session feedback.",
    password: "participant123",
  },
  {
    id: "usr-12",
    name: "Asha Mehta",
    role: "volunteer",
    email: "asha.mehta@volunteer.in",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    bio: "Volunteer supporting event operations and guest experience.",
    skills: ["Coordination", "Communication", "Logistics"],
    performanceScore: 91,
    password: "volunteer123",
  },
];

export const INITIAL_VOLUNTEER_APPLICATIONS = [
  {
    id: "vapp-1",
    eventId: "evt-1",
    eventTitle: "Community Launch Expo 2026",
    roleId: "vrole-1",
    roleName: "Technical Mentor",
    volunteerId: "usr-2",
    volunteerName: "Ravi Patel",
    volunteerEmail: "ravi.patel@student.edu.in",
    skills: ["Communication", "Coordination", "Support"],
    status: "approved",
    assignedTasks: [
      { id: "task-1", name: "Review attendee check-in flow", status: "done" },
      { id: "task-2", name: "Support the registration desk", status: "doing" },
      { id: "task-3", name: "Assist with closing session setup", status: "todo" }
    ]
  },
  {
    id: "vapp-2",
    eventId: "evt-1",
    eventTitle: "Community Launch Expo 2026",
    roleId: "vrole-2",
    roleName: "Logistics Captain",
    volunteerId: "usr-3",
    volunteerName: "Asha Mehta",
    volunteerEmail: "asha.mehta@student.edu.in",
    skills: ["Coordination", "Organizing", "Communication"],
    status: "pending",
    assignedTasks: []
  },
  {
    id: "vapp-3",
    eventId: "evt-2",
    eventTitle: "Planning and Operations Symposium",
    roleId: "vrole-4",
    roleName: "Panel Moderator Support",
    volunteerId: "usr-2",
    volunteerName: "Ravi Patel",
    volunteerEmail: "ravi.patel@student.edu.in",
    skills: ["Public Speaking", "Writing"],
    status: "pending",
    assignedTasks: []
  }
];

export const INITIAL_SPONSOR_AGREEMENTS = [
  {
    id: "spon-1",
    eventId: "evt-1",
    eventTitle: "Community Launch Expo 2026",
    packageId: "pkg-1",
    sponsorId: "usr-4",
    sponsorName: "Anjali Sharma",
    companyName: "Optima Tech Ventures India",
    tier: "Platinum",
    price: 500000,
    status: "approved",
    roi: {
      impressions: 4800,
      clicks: 340,
      leadsGenerated: 24
    }
  },
  {
    id: "spon-2",
    eventId: "evt-3",
    eventTitle: "Creative Event Design Workshop",
    packageId: "pkg-6",
    sponsorId: "usr-5",
    sponsorName: "Marcus Vance",
    companyName: "Luminate Digital Agency",
    tier: "Gold",
    price: 200000,
    status: "pending",
    roi: {
      impressions: 0,
      clicks: 0,
      leadsGenerated: 0
    }
  }
];

export const INITIAL_TICKETS = [
  {
    id: "tkt-1",
    eventId: "evt-1",
    eventTitle: "Community Launch Expo 2026",
    eventDate: "2026-06-15",
    eventLocation: "Mumbai International Convention Centre (and Online)",
    participantId: "usr-6",
    participantName: "Lalit Mehra",
    registrationDate: "2026-05-18",
    ticketCode: "TKT-INN-4890",
    qrPayload: "eme-ticket|tkt-1|evt-1|usr-6|TKT-INN-4890",
    qrIssuedAt: "2026-05-18T09:00:00.000Z",
    feedbackSubmitted: false,
    certificateIssued: false,
    checkedIn: false
  },
  {
    id: "tkt-2",
    eventId: "evt-2",
    eventTitle: "Planning and Operations Symposium",
    eventDate: "2026-07-02",
    eventLocation: "The Ashoka Hall, New Delhi",
    participantId: "usr-6",
    participantName: "Lalit Mehra",
    registrationDate: "2026-05-20",
    ticketCode: "TKT-AI-2091",
    qrPayload: "eme-ticket|tkt-2|evt-2|usr-6|TKT-AI-2091",
    qrIssuedAt: "2026-05-20T09:00:00.000Z",
    feedbackSubmitted: true,
    certificateIssued: true,
    checkedIn: true,
    checkedInAt: "2026-05-20T12:15:00.000Z",
    checkedInBy: "Gate Desk"
  }
];

export const INITIAL_FEEDBACKS = [
  {
    id: "fdb-1",
    eventId: "evt-1",
    participantName: "Rohan Gupta",
    rating: 5,
    comment: "The event was well structured and the check-in process was smooth.",
    tags: ["Excellent Organization", "Smooth Check-In", "Helpful Team"]
  },
  {
    id: "fdb-2",
    eventId: "evt-1",
    participantName: "Sana Khan",
    rating: 4,
    comment: "Helpful staff, clear signage, and a strong program schedule.",
    tags: ["Clear Signage", "Helpful Staff"]
  }
];

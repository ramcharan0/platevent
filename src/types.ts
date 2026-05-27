export type EventType = "Workshop" | "Symposium" | "Social" | "Conference";

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: "operations" | "marketing" | "catering" | "prizes" | "venue";
}

export interface SponsorshipPackage {
  id: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
  price: number;
  perks: string[];
  spots: number;
  spotsLeft: number;
}

export interface VolunteerRole {
  id: string;
  roleName: string;
  spots: number;
  spotsLeft: number;
  description: string;
  skillsRequired: string[];
}

export interface AgendaItem {
  id: string;
  time: string;
  activity: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  image: string;
  organizerEmail: string;
  budgetTotal: number;
  budgetSpent: number;
  budgetItems: BudgetItem[];
  sponsorshipPackages: SponsorshipPackage[];
  volunteerRoles: VolunteerRole[];
  registrations: number;
  maxRegistrations: number;
  agenda: AgendaItem[];
  certificatesConfigured: boolean;
}

export type UserRole = "organizer" | "volunteer" | "sponsor" | "participant";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  bio: string;
  // Volunteer details
  skills?: string[];
  performanceScore?: number;
  achievements?: Achievement[];
  // Sponsor details
  company?: string;
  industry?: string;
}

export interface AuthAccount extends UserProfile {
  password: string;
}

export interface VolunteerApplication {
  id: string;
  eventId: string;
  eventTitle: string;
  roleId: string;
  roleName: string;
  volunteerId: string;
  volunteerName: string;
  volunteerEmail: string;
  skills: string[];
  status: "pending" | "approved" | "rejected";
  assignedTasks: { id: string; name: string; status: "todo" | "doing" | "done" }[];
}

export interface SponsorshipAgreement {
  id: string;
  eventId: string;
  eventTitle: string;
  packageId: string;
  sponsorId: string;
  sponsorName: string;
  companyName: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
  price: number;
  status: "pending" | "approved" | "rejected";
  roi: {
    impressions: number;
    clicks: number;
    leadsGenerated: number;
  };
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  participantId: string;
  participantName: string;
  registrationDate: string;
  ticketCode: string;
  qrPayload: string;
  qrIssuedAt: string;
  feedbackSubmitted: boolean;
  certificateIssued: boolean;
  checkedIn: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
}

export interface Feedback {
  id: string;
  eventId: string;
  participantName: string;
  rating: number; // 1-5
  comment: string;
  tags: string[];
}

export interface MockMessage {
  id: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  message: string;
  timestamp: string;
}

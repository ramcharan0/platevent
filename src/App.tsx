import { useState, useEffect } from "react";
import { 
  INITIAL_EVENTS, 
  INITIAL_USER, 
  INITIAL_AUTH_ACCOUNTS,
  INITIAL_VOLUNTEER_APPLICATIONS, 
  INITIAL_SPONSOR_AGREEMENTS, 
  INITIAL_TICKETS, 
  INITIAL_FEEDBACKS 
} from "./data";
import { Event, UserProfile, UserRole, VolunteerApplication, SponsorshipAgreement, Ticket, Feedback, MockMessage, VolunteerRole, SponsorshipPackage, BudgetItem, AuthAccount } from "./types";
import EventDirectory from "./components/EventDirectory";
import OrganizerModule from "./components/OrganizerModule";
// VolunteerModule merged into Organizer; keep file but no longer imported here
import SponsorModule from "./components/SponsorModule";
import ParticipantModule from "./components/ParticipantModule";
import HelpModule from "./components/HelpModule";
import ProfileSettingsModal from "./components/ProfileSettingsModal";
import AuthLandingPage from "./components/AuthLandingPage";
import LandingPage from "./components/LandingPage";
import { Menu, Search } from "lucide-react";

const buildTicketQrPayload = (ticketId: string, eventId: string, participantId: string, ticketCode: string) =>
  `eme-ticket|${ticketId}|${eventId}|${participantId}|${ticketCode}`;

const normalizeTicket = (ticket: Partial<Ticket>): Ticket => {
  const ticketId = ticket.id || `tkt-${Date.now()}`;
  const eventId = ticket.eventId || "evt-unknown";
  const participantId = ticket.participantId || "usr-unknown";
  const ticketCode = ticket.ticketCode || `TKT-${eventId.toUpperCase().slice(0, 3)}-${ticketId.slice(-4).toUpperCase()}`;

  return {
    id: ticketId,
    eventId,
    eventTitle: ticket.eventTitle || "Untitled Event",
    eventDate: ticket.eventDate || new Date().toISOString().slice(0, 10),
    eventLocation: ticket.eventLocation || "TBD",
    participantId,
    participantName: ticket.participantName || "Guest Participant",
    registrationDate: ticket.registrationDate || new Date().toISOString().slice(0, 10),
    ticketCode,
    qrPayload: ticket.qrPayload || buildTicketQrPayload(ticketId, eventId, participantId, ticketCode),
    qrIssuedAt: ticket.qrIssuedAt || new Date().toISOString(),
    feedbackSubmitted: ticket.feedbackSubmitted ?? false,
    certificateIssued: ticket.certificateIssued ?? false,
    checkedIn: ticket.checkedIn ?? false,
    checkedInAt: ticket.checkedInAt,
    checkedInBy: ticket.checkedInBy,
  };
};

export default function App() {
  // Initialize States from localStorage if present
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("eme_events");
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("eme_user");
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [authAccounts, setAuthAccounts] = useState<AuthAccount[]>(() => {
    const saved = localStorage.getItem("eme_accounts");
    return saved ? JSON.parse(saved) : INITIAL_AUTH_ACCOUNTS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem("eme_logged_in") === "true");

  const [volunteerApps, setVolunteerApps] = useState<VolunteerApplication[]>(() => {
    const saved = localStorage.getItem("eme_volunteer_apps");
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEER_APPLICATIONS;
  });

  const [sponsorAgreements, setSponsorAgreements] = useState<SponsorshipAgreement[]>(() => {
    const saved = localStorage.getItem("eme_sponsor_agreements");
    return saved ? JSON.parse(saved) : INITIAL_SPONSOR_AGREEMENTS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem("eme_tickets");
    return saved ? (JSON.parse(saved) as Partial<Ticket>[]).map(normalizeTicket) : INITIAL_TICKETS.map((ticket) => normalizeTicket(ticket));
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem("eme_feedbacks");
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  });

  const [messages, setMessages] = useState<MockMessage[]>(() => {
    const saved = localStorage.getItem("eme_messages");
    return saved ? JSON.parse(saved) : [
      { id: "msg-1", senderName: "Sana Khan", senderRole: "Attendee", recipientId: "peer-1", message: "Hi! The event schedule looked great. Are you attending the networking session later?", timestamp: "10:35 AM" },
      { id: "msg-2", senderName: "Lalit Mehra", senderRole: "Participant", recipientId: "peer-2", message: "Hello Marcus! I enjoyed the planning session and wanted to connect about future events.", timestamp: "11:02 AM" }
    ];
  });

  // Current active top view
  const [activeView, setActiveView] = useState<"directory" | "organizer" | "sponsor" | "participant" | "help">("directory");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const roleViews: Record<UserRole, Array<"directory" | "organizer" | "sponsor" | "participant" | "help">> = {
    organizer: ["directory", "organizer", "help"],
    sponsor: ["directory", "sponsor", "help"],
    participant: ["directory", "participant", "help"],
    volunteer: ["directory", "help"],
  };

  const allowedViews = roleViews[currentUser.role] || ["directory", "help"];

  // Sync state to localstorage
  useEffect(() => {
    localStorage.setItem("eme_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("eme_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("eme_accounts", JSON.stringify(authAccounts));
  }, [authAccounts]);

  useEffect(() => {
    localStorage.setItem("eme_logged_in", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("eme_volunteer_apps", JSON.stringify(volunteerApps));
  }, [volunteerApps]);

  useEffect(() => {
    localStorage.setItem("eme_sponsor_agreements", JSON.stringify(sponsorAgreements));
  }, [sponsorAgreements]);

  useEffect(() => {
    localStorage.setItem("eme_tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem("eme_feedbacks", JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem("eme_messages", JSON.stringify(messages));
  }, [messages]);

  const stripPassword = (account: AuthAccount): UserProfile => {
    const { password: _password, ...profile } = account;
    return profile;
  };

  const roleDefaultView: Record<UserRole, "directory" | "organizer" | "sponsor" | "participant" | "help"> = {
    organizer: "organizer",
    sponsor: "sponsor",
    participant: "participant",
    volunteer: "directory",
  };

  const handleLogin = (email: string, password: string) => {
    const account = authAccounts.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!account) return { ok: false, message: "No account found for that email." };
    if (account.password !== password) return { ok: false, message: "Invalid password." };

    setCurrentUser(stripPassword(account));
    setIsAuthenticated(true);
    setShowProfileMenu(false);
    setShowProfileSettings(false);
    setActiveView(roleDefaultView[account.role]);
    return { ok: true, message: `Welcome back, ${account.name}.` };
  };

  const handleSignup = (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    company?: string;
    industry?: string;
    skills?: string[];
    bio?: string;
  }) => {
    const exists = authAccounts.some((item) => item.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return { ok: false, message: "An account already exists with that email." };

    const newAccount: AuthAccount = {
      id: `usr-${Date.now()}`,
      name: data.name,
      role: data.role,
      email: data.email,
      password: data.password,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      bio: data.bio || "New event platform member.",
      company: data.company,
      industry: data.industry,
      skills: data.skills,
    };

    setAuthAccounts((prev) => [newAccount, ...prev]);
    setCurrentUser(stripPassword(newAccount));
    setIsAuthenticated(true);
    setActiveView(roleDefaultView[data.role]);
    return { ok: true, message: "Account created successfully." };
  };

  const handleLogout = () => {
    localStorage.removeItem("eme_user");
    localStorage.removeItem("eme_logged_in");
    setCurrentUser(INITIAL_USER);
    setIsAuthenticated(false);
    setActiveView("directory");
    setShowProfileMenu(false);
    setShowProfileSettings(false);
  };

  useEffect(() => {
    if (!allowedViews.includes(activeView)) {
      setActiveView(allowedViews[0]);
    }
  }, [activeView, allowedViews]);

  // (Simulator removed) Keep current user as configured in seed or localStorage

  // CORE ECOSYSTEM STATE MUTATORS BY MODULE ACTIONS
  
  // 1. Participant registers for event
  const handleRegisterParticipant = (eventId: string, name: string, email: string) => {
    // Increment Registrations in matching event
    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.id === eventId
          ? { ...evt, registrations: Math.min(evt.registrations + 1, evt.maxRegistrations) }
          : evt
      )
    );

    const matchEvent = events.find((e) => e.id === eventId);
    if (!matchEvent) return;

    // Generate Participant Ticket
    const ticketId = `tkt-${Date.now()}`;
    const ticketCode = `TKT-${matchEvent.type.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTkt: Ticket = {
      id: ticketId,
      eventId,
      eventTitle: matchEvent.title,
      eventDate: matchEvent.date,
      eventLocation: matchEvent.location,
      participantId: currentUser.id,
      participantName: name,
      registrationDate: new Date().toISOString().slice(0, 10),
      ticketCode,
      qrPayload: buildTicketQrPayload(ticketId, eventId, currentUser.id, ticketCode),
      qrIssuedAt: new Date().toISOString(),
      feedbackSubmitted: false,
      certificateIssued: false,
      checkedIn: false,
    };

    setTickets((prev) => [newTkt, ...prev]);
  };

  const handleCheckInTicket = (scanValue: string, checkedInBy = "Gate Desk") => {
    const normalized = scanValue.trim();
    if (!normalized) {
      return { ok: false, message: "Enter a ticket code or QR payload first." };
    }

    const match = tickets.find((ticket) => {
      const haystack = [ticket.id, ticket.ticketCode, ticket.qrPayload].map((item) => item.toLowerCase());
      return haystack.includes(normalized.toLowerCase());
    });

    if (!match) {
      return { ok: false, message: "No matching ticket found for that QR or ticket code." };
    }

    if (match.checkedIn) {
      return {
        ok: false,
        message: `Already checked in at ${match.checkedInAt ? new Date(match.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "an earlier time"}.`,
        ticket: match,
      };
    }

    const checkedInAt = new Date().toISOString();
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === match.id
          ? { ...ticket, checkedIn: true, checkedInAt, checkedInBy }
          : ticket
      )
    );

    return {
      ok: true,
      message: `Checked in ${match.participantName} for ${match.eventTitle}.`,
      ticket: { ...match, checkedIn: true, checkedInAt, checkedInBy },
    };
  };

  // 2. Volunteer applies for a role
  const handleVolunteerApply = (
    eventId: string,
    role: VolunteerRole,
    name: string,
    email: string,
    skills: string[]
  ) => {
    const matchEvent = events.find((e) => e.id === eventId);
    if (!matchEvent) return;

    const newApp: VolunteerApplication = {
      id: `vapp-${Date.now()}`,
      eventId,
      eventTitle: matchEvent.title,
      roleId: role.id,
      roleName: role.roleName,
      volunteerId: currentUser.id,
      volunteerName: name,
      volunteerEmail: email,
      skills,
      status: "pending",
      assignedTasks: [],
    };

    setVolunteerApps((prev) => [newApp, ...prev]);
  };

  // 3. Sponsor applies/buys a package
  const handleSponsorApply = (
    eventId: string,
    pack: SponsorshipPackage,
    company: string,
    name: string
  ) => {
    const matchEvent = events.find((e) => e.id === eventId);
    if (!matchEvent) return;

    const newAgreement: SponsorshipAgreement = {
      id: `spon-${Date.now()}`,
      eventId,
      eventTitle: matchEvent.title,
      packageId: pack.id,
      sponsorId: currentUser.id,
      sponsorName: name,
      companyName: company,
      tier: pack.tier,
      price: pack.price,
      status: "pending",
      roi: {
        impressions: 4200 + Math.floor(Math.random() * 800),
        clicks: 290 + Math.floor(Math.random() * 100),
        leadsGenerated: 12 + Math.floor(Math.random() * 10),
      },
    };

    setSponsorAgreements((prev) => [newAgreement, ...prev]);
    
    // Decrement spots left for sponsorship package on the event
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? {
              ...evt,
              sponsorshipPackages: evt.sponsorshipPackages.map((p) =>
                p.id === pack.id ? { ...p, spotsLeft: Math.max(0, p.spotsLeft - 1) } : p
              ),
            }
          : evt
      )
    );
  };

  // 4. Organizer adds custom event
  const handleAddEvent = (newEvent: Event) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  // 5. Organizer approves volunteer application
  const handleApproveVolunteer = (appId: string) => {
    setVolunteerApps((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: "approved",
              assignedTasks: [
                { id: `task-${Date.now()}-1`, name: "Complete registration check-in run sheets", status: "todo" },
                { id: `task-${Date.now()}-2`, name: "Set up AV podium testing", status: "todo" },
              ],
            }
          : app
      )
    );
  };

  // 6. Organizer rejects volunteer application
  const handleRejectVolunteer = (appId: string) => {
    setVolunteerApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: "rejected" } : app))
    );
  };

  // 7. Organizer assigns custom staff task
  const handleAssignTask = (appId: string, taskName: string) => {
    setVolunteerApps((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              assignedTasks: [
                ...app.assignedTasks,
                { id: `task-${Date.now()}`, name: taskName, status: "todo" },
              ],
            }
          : app
      )
    );
  };

  // 8. Organizer approves sponsorship package
  const handleApproveSponsor = (agreementId: string) => {
    setSponsorAgreements((prev) =>
      prev.map((sa) => (sa.id === agreementId ? { ...sa, status: "approved" } : sa))
    );
  };

  // 9. Organizer rejects sponsor agreement
  const handleRejectSponsor = (agreementId: string) => {
    setSponsorAgreements((prev) =>
      prev.map((sa) => (sa.id === agreementId ? { ...sa, status: "rejected" } : sa))
    );
  };

  // 10. Organizer logs budget operational expense
  const handleAddBudgetExpense = (eventId: string, expense: BudgetItem) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? {
              ...evt,
              budgetSpent: evt.budgetSpent + expense.amount,
              budgetItems: [...evt.budgetItems, expense],
            }
          : evt
      )
    );
  };

  // 11. Organizer issues event completion certificates
  const handleIssueCertificates = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === eventId ? { ...evt, certificatesConfigured: true } : evt))
    );

    // Turn matching registration tickets into completion-ready records
    setTickets((prev) =>
      prev.map((t) => (t.eventId === eventId ? { ...t, certificateIssued: true } : t))
    );
  };

  // 12. Participant files review feedback
  const handleAddFeedback = (
    eventId: string,
    rating: number,
    comment: string,
    tags: string[]
  ) => {
    const newFeedback: Feedback = {
      id: `fdb-${Date.now()}`,
      eventId,
      participantName: currentUser.name,
      rating,
      comment,
      tags,
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
  };

  const handleMarkFeedbackSubmitted = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, feedbackSubmitted: true } : t))
    );
  };

  // 13. Participant texts a peer
  const handleSendMessage = (recipientId: string, message: string) => {
    const newMsg: MockMessage = {
      id: `msg-${Date.now()}`,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId,
      message,
      timestamp: "Now",
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  // 14. Volunteer checks off a checklist task
  const handleCheckoffTask = (
    appId: string,
    taskId: string,
    nextStatus: "todo" | "doing" | "done"
  ) => {
    setVolunteerApps((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              assignedTasks: app.assignedTasks.map((t) =>
                t.id === taskId ? { ...t, status: nextStatus } : t
              ),
            }
          : app
      )
    );

    // Boost performance score slightly upon finishing task
    if (nextStatus === "done") {
      setCurrentUser((prev) => ({
        ...prev,
        performanceScore: Math.min((prev.performanceScore || 92) + 2, 100),
      }));
    }
  };

  const handleUpdateVolunteerProfile = (fields: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...fields
    }));
  };

  if (!isAuthenticated) {
    if (showAuth) {
      return (
        <AuthLandingPage
          onLogin={handleLogin}
          onSignup={handleSignup}
          demoAccounts={authAccounts}
        />
      );
    }

    return (
      <LandingPage onEnterAuth={() => setShowAuth(true)} />
    );
  }

  return (
    <div id="app-root" className="min-h-screen bg-[#EFEFE9] text-neutral-900 flex flex-col font-sans">
      {/* 1. TOP GLOBAL NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#EFEFE9]/95 border-b border-neutral-300 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* brand removed as requested */}

          {/* Navigation View switcher */}
          <nav className="hidden lg:flex gap-1.5">
            {[
              { id: "directory", label: "Discover" },
              { id: "organizer", label: "My Events" },
              { id: "sponsor", label: "Sponsors" },
              { id: "participant", label: "My Tickets" },
              { id: "help", label: "Help" }
            ].filter((lnk) => allowedViews.includes(lnk.id as any)).map((lnk) => (
              <button
                key={lnk.id}
                id={`nav-${lnk.id}`}
                onClick={() => setActiveView(lnk.id as any)}
                className={`px-3 py-1.8 border text-[10.5px] font-bold transition-all tracking-wider uppercase cursor-pointer ${
                  activeView === lnk.id
                    ? "bg-[#121211] border-[#121211] text-white"
                    : "bg-white/80 border-neutral-300 text-neutral-600 hover:border-black hover:text-black"
                }`}
              >
                {lnk.label}
              </button>
            ))}
          </nav>

          {/* Right Area items: search and menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const searchEl = document.getElementById("search-input");
                if (searchEl) {
                  searchEl.focus();
                  searchEl.scrollIntoView({ behavior: "smooth", block: "center" });
                } else {
                  setActiveView("directory");
                }
              }}
              className="bg-white border border-neutral-300 hover:border-black px-3 py-2 text-[#121211] font-bold text-[10px] uppercase flex items-center gap-1 transition-all cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>

            {/* Profile display + menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((s) => !s)}
                className="flex items-center gap-3 bg-white border border-neutral-200 px-3 py-2 rounded cursor-pointer"
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-neutral-800">{currentUser.name}</div>
                  <div className="text-[10px] text-neutral-400">{currentUser.role}</div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-neutral-300 rounded-lg shadow-xl py-2 z-50">
                      <button onClick={() => { setShowProfileMenu(false); setShowProfileSettings(true); }} className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50">Profile Settings</button>
                      <button onClick={() => { setShowProfileMenu(false); setActiveView('help'); }} className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50">Help</button>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50">Logout</button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Minimal header info line */}
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-neutral-200/60 flex flex-wrap items-center justify-between text-xs gap-2">
          <span className="text-[10px] text-neutral-400 font-mono tracking-wider">Unified Event Management Portal</span>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-grow bg-transparent">
        {activeView === "directory" && (
          <EventDirectory
            events={events}
            currentUser={currentUser}
            onRegister={handleRegisterParticipant}
            onVolunteerApply={handleVolunteerApply}
            onSponsorApply={handleSponsorApply}
          />
        )}

        {activeView === "organizer" && allowedViews.includes("organizer") && (
          <OrganizerModule
            events={events}
            tickets={tickets}
            messages={messages}
            volunteerApps={volunteerApps}
            sponsorAgreements={sponsorAgreements}
            onAddEvent={handleAddEvent}
            onApproveVolunteer={handleApproveVolunteer}
            onRejectVolunteer={handleRejectVolunteer}
            onAssignTask={handleAssignTask}
            onMessageVolunteer={handleSendMessage}
            onBroadcastMessage={(recipientId: string, message: string) => handleSendMessage(recipientId, message)}
            onCheckInTicket={handleCheckInTicket}
            onReassignTask={(fromAppId: string, toAppId: string, taskId: string) => {
              setVolunteerApps((prev) => {
                const from = prev.find((p) => p.id === fromAppId);
                const to = prev.find((p) => p.id === toAppId);
                if (!from || !to) return prev;
                const task = from.assignedTasks.find((t) => t.id === taskId);
                if (!task) return prev;
                return prev.map((p) => {
                  if (p.id === fromAppId) {
                    return { ...p, assignedTasks: p.assignedTasks.filter((t) => t.id !== taskId) };
                  }
                  if (p.id === toAppId) {
                    return { ...p, assignedTasks: [...p.assignedTasks, { ...task, status: 'todo' }] };
                  }
                  return p;
                });
              });
            }}
            onApproveSponsor={handleApproveSponsor}
            onRejectSponsor={handleRejectSponsor}
            onAddBudgetExpense={handleAddBudgetExpense}
            onIssueCertificates={handleIssueCertificates}
          />
        )}

        {/* Volunteer page merged into Organizer 'Staff' tab; removed separate volunteer view */}

        {activeView === "sponsor" && allowedViews.includes("sponsor") && (
          <SponsorModule
            currentUser={currentUser}
            events={events}
            messages={messages}
            sponsorAgreements={sponsorAgreements}
            onSponsorApply={handleSponsorApply}
            onUpdateProfile={handleUpdateVolunteerProfile}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeView === "participant" && allowedViews.includes("participant") && (
          <ParticipantModule
            currentUser={currentUser}
            tickets={tickets}
            feedbacks={feedbacks}
            messages={messages}
            onAddFeedback={handleAddFeedback}
            onFeedbackSubmitted={handleMarkFeedbackSubmitted}
            onSendMessage={handleSendMessage}
          />
        )}
        {activeView === "help" && allowedViews.includes("help") && (
          <HelpModule />
        )}
        {showProfileSettings && (
          <ProfileSettingsModal
            user={currentUser}
            onClose={() => setShowProfileSettings(false)}
            onSave={(fields) => handleUpdateVolunteerProfile(fields)}
          />
        )}
      </main>

      {/* 3. MINIMAL GLOSS FOOTER */}
      <footer className="bg-white border-t border-neutral-100 py-8 text-center text-xs text-neutral-400 font-medium">
        <p className="tracking-tight">© 2026</p>
        <p className="text-[10px] text-neutral-300 mt-1 uppercase tracking-widest font-mono">
          Built for a clean, minimal event workflow
        </p>
      </footer>
    </div>
  );
}

import React, { useState } from "react";
import { Event, VolunteerApplication, SponsorshipAgreement, BudgetItem, EventType, UserProfile, VolunteerRole, SponsorshipPackage, MockMessage } from "../types";
import { Plus, DollarSign, Send, Award, Users, Check, X, ShieldAlert, BarChart3, Briefcase, FileText } from "lucide-react";
import { motion } from "motion/react";
import { formatCurrencyINR } from "../utils/format";

interface OrganizerModuleProps {
  events: Event[];
  tickets: import("../types").Ticket[];
  messages: MockMessage[];
  volunteerApps: VolunteerApplication[];
  sponsorAgreements: SponsorshipAgreement[];
  onAddEvent: (newEvent: Event) => void;
  onApproveVolunteer: (appId: string) => void;
  onRejectVolunteer: (appId: string) => void;
  onAssignTask: (appId: string, taskName: string) => void;
  onMessageVolunteer?: (recipientId: string, message: string) => void;
  onReassignTask?: (fromAppId: string, toAppId: string, taskId: string) => void;
  onBroadcastMessage: (recipientId: string, message: string) => void;
  onCheckInTicket: (scanValue: string, checkedInBy?: string) => { ok: boolean; message: string; ticket?: import("../types").Ticket };
  onApproveSponsor: (agreementId: string) => void;
  onRejectSponsor: (agreementId: string) => void;
  onAddBudgetExpense: (eventId: string, expense: BudgetItem) => void;
  onIssueCertificates: (eventId: string) => void;
}

export default function OrganizerModule({
  events,
  tickets,
  messages,
  volunteerApps,
  sponsorAgreements,
  onAddEvent,
  onApproveVolunteer,
  onRejectVolunteer,
  onAssignTask,
  onMessageVolunteer,
  onReassignTask,
  onBroadcastMessage,
  onCheckInTicket,
  onApproveSponsor,
  onRejectSponsor,
  onAddBudgetExpense,
  onIssueCertificates,
}: OrganizerModuleProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<"dashboard" | "checkin" | "create" | "budget" | "staff" | "sponsors">("dashboard");

  // Selected Event context for budget and certificate triggers
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");

  // Create Event Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [date, setDate] = useState("2026-08-10");
  const [time, setTime] = useState("09:00 AM - 04:00 PM AEST");
  const [location, setLocation] = useState("Campus Main Auditorium, Building 4");
  const [type, setType] = useState<EventType>("Conference");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800");
  const [budgetTotal, setBudgetTotal] = useState(10000);
  const [maxReg, setMaxReg] = useState(200);

  // Quick form sub-components
  const [volunteerRoleName, setVolunteerRoleName] = useState("Technical Assistant");
  const [volunteerRoleDesc, setVolunteerRoleDesc] = useState("Help students troubleshoot framework issues");
  const [volunteerSkills, setVolunteerSkills] = useState("HTML, CSS, React");

  // Expense Form state
  const [expName, setExpName] = useState("");
  const [expAmount, setExpAmount] = useState<number>(200);
  const [expCat, setExpCat] = useState<"operations" | "marketing" | "catering" | "prizes" | "venue">("operations");

  // Broadcast state
  const [broadcastTarget, setBroadcastTarget] = useState<"all" | "volunteers" | "sponsors" | "participants">("all");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const [checkInInput, setCheckInInput] = useState("");
  const [checkInBy, setCheckInBy] = useState("Gate Desk");
  const [checkInNotice, setCheckInNotice] = useState<{ ok: boolean; message: string; ticket?: import("../types").Ticket } | null>(null);

  // Custom Task Assignment State
  const [customTask, setCustomTask] = useState("");
  const [focusedAppId, setFocusedAppId] = useState<string | null>(null);
  const [profileModalApp, setProfileModalApp] = useState<VolunteerApplication | null>(null);
  const [profileMessage, setProfileMessage] = useState<string>("");
  const [quickMessages, setQuickMessages] = useState<Record<string, string>>({});
  const [reassigningTaskId, setReassigningTaskId] = useState<string | null>(null);
  const [reassignFromAppId, setReassignFromAppId] = useState<string | null>(null);
  const [reassignTargetAppId, setReassignTargetAppId] = useState<string | null>(null);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    // Build volunteer role structure
    const volRoles: VolunteerRole[] = [
      {
        id: `vrole-${Date.now()}`,
        roleName: volunteerRoleName,
        spots: 5,
        spotsLeft: 5,
        description: volunteerRoleDesc,
        skillsRequired: volunteerSkills.split(",").map((s) => s.trim())
      }
    ];

    // Default package options
    const sponsorPacks: SponsorshipPackage[] = [
      { id: `pkg-g-${Date.now()}`, tier: "Gold", price: 3000, perks: ["Keynote presence", "A4 brochure slot", "Standard Booth"], spots: 3, spotsLeft: 3 },
      { id: `pkg-s-${Date.now()}`, tier: "Silver", price: 1500, perks: ["Slide brand logo", "Shared Booth space"], spots: 5, spotsLeft: 5 }
    ];

    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      title,
      description,
      longDescription: longDesc || description,
      date,
      time,
      location,
      type,
      image,
      organizerEmail: "alex.carter@union.edu.au",
      budgetTotal,
      budgetSpent: 0,
      budgetItems: [],
      sponsorshipPackages: sponsorPacks,
      volunteerRoles: volRoles,
      registrations: 0,
      maxRegistrations: maxReg,
      agenda: [
        { id: `ag-${Date.now()}-1`, time: "09:00 AM", activity: "Kickoff & General Introductions" },
        { id: `ag-${Date.now()}-2`, time: "01:00 PM", activity: "Interactive Workshop Circles" },
        { id: `ag-${Date.now()}-3`, time: "04:30 PM", activity: "Keynote Panels & Networking Drinks" }
      ],
      certificatesConfigured: false
    };

    onAddEvent(newEvent);
    // Reset inputs
    setTitle("");
    setDescription("");
    setLongDesc("");
    setBudgetTotal(10000);
    // Move to dashboard and focus new event
    setSelectedEventId(newEvent.id);
    setActiveTab("dashboard");
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName || expAmount <= 0 || !selectedEvent) return;

    const newExpense: BudgetItem = {
      id: `bud-${Date.now()}`,
      name: expName,
      amount: expAmount,
      category: expCat
    };

    onAddBudgetExpense(selectedEvent.id, newExpense);
    setExpName("");
    setExpAmount(200);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    const recipientId = broadcastTarget === "volunteers" ? "volunteer" : broadcastTarget === "participants" ? "participant" : broadcastTarget === "sponsors" ? "sponsor" : "all";
    onBroadcastMessage(recipientId, broadcastMessage);
    setBroadcastSuccess(true);
    setBroadcastMessage("");
    setTimeout(() => {
      setBroadcastSuccess(false);
    }, 3000);
  };

  const handleAssignTaskLocal = (appId: string) => {
    if (!customTask) return;
    onAssignTask(appId, customTask);
    setCustomTask("");
    setFocusedAppId(null);
  };

  const calculateEventSponsorshipRevenue = (evtId: string) => {
    return sponsorAgreements
      .filter((sa) => sa.eventId === evtId && sa.status === "approved")
      .reduce((sum, sa) => sum + sa.price, 0);
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onCheckInTicket(checkInInput, checkInBy);
    setCheckInNotice(result);
    if (result.ok) {
      setCheckInInput("");
    }
  };

  return (<>
    <div id="organizer-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-100 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Organizer Workspace</h2>
          <p className="text-xs text-neutral-500">Create events, manage budgets, review volunteer applications, and coordinate sponsor approvals.</p>
        </div>
        <div className="flex gap-2">
          {events.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedEventId(e.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                selectedEventId === e.id
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-50 hover:bg-neutral-150 text-neutral-600 border border-neutral-200"
              }`}
            >
              {e.title.split(":")[0].slice(0, 18)}...
            </button>
          ))}
        </div>
      </div>

      {/* Internal Ribbon Control */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-100 mb-8 pb-1">
        {[
          { id: "dashboard", label: "Overview & Analytics", count: null },
          { id: "checkin", label: "Entry Check-in", count: tickets.filter((ticket) => ticket.eventId === selectedEvent?.id && ticket.checkedIn).length },
          { id: "create", label: "Create Event", count: null },
          { id: "budget", label: "Budget & Spending", count: null },
          { id: "staff", label: "Volunteer Applications", count: volunteerApps.filter((a) => a.status === "pending").length },
          { id: "sponsors", label: "Sponsor Approvals", count: sponsorAgreements.filter((s) => s.status === "pending").length }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`org-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-4 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 2. TAB COMPONENT VIEWS */}

      {/* OVERVIEW & ANALYTICS TAB */}
      {activeTab === "dashboard" && selectedEvent && (
        <div className="space-y-8">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-xs">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block">Total Attendees</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-neutral-900">{selectedEvent.registrations}</span>
                <span className="text-xs text-neutral-400">/ {selectedEvent.maxRegistrations} max</span>
              </div>
              <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${(selectedEvent.registrations / selectedEvent.maxRegistrations) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-xs">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block">Sponsor Revenue</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-emerald-800">{formatCurrencyINR(calculateEventSponsorshipRevenue(selectedEvent.id))}</span>
                <span className="text-xs text-neutral-400">raised</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-3 block">From approved sponsor agreements</p>
            </div>

            <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-xs">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block">Approved Volunteers</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-neutral-900">
                  {volunteerApps.filter((a) => a.eventId === selectedEvent.id && a.status === "approved").length}
                </span>
                <span className="text-xs text-neutral-400">active staff</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-3">Ready to support registration, rooms, and live operations</p>
            </div>

            <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-xs">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block">Budget Spent</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-neutral-900">{formatCurrencyINR(selectedEvent.budgetSpent)}</span>
                <span className="text-xs text-neutral-500">of {formatCurrencyINR(selectedEvent.budgetTotal)}</span>
              </div>
              <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min((selectedEvent.budgetSpent / selectedEvent.budgetTotal) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Certificates Dispatch & Event Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Block: Communication Broadcaster */}
            <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-xs lg:col-span-2">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-4 flex items-center gap-1">
                <Send className="w-4 h-4 text-emerald-600" />
                Live Communication Hub
              </h3>
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 uppercase mb-1">Target audience</label>
                  <div className="flex gap-3">
                    {[
                      { id: "all", label: "All attendees" },
                      { id: "participants", label: "Participants" },
                      { id: "volunteers", label: "Volunteers" },
                      { id: "sponsors", label: "Sponsors" }
                    ].map((tg) => (
                      <label key={tg.id} className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer">
                        <input
                          type="radio"
                          name="broadcast_target"
                          checked={broadcastTarget === tg.id}
                          onChange={() => setBroadcastTarget(tg.id as any)}
                        />
                        {tg.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 uppercase mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share schedule updates, venue instructions, or team reminders..."
                    className="w-full p-3 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-neutral-400">Records a message update for the selected audience.</span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 border border-neutral-950 text-white font-bold rounded-lg text-xs transition-transform hover:scale-101 cursor-pointer"
                  >
                    Send Update
                  </button>
                </div>
              </form>

              {broadcastSuccess && (
                <div className="bg-emerald-550/20 text-emerald-800 border border-emerald-250 p-2.5 rounded-lg mt-4 text-xs font-medium text-center">
                  Sent successfully. The update is ready for review.
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-neutral-100">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Recent board messages</h4>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {messages.slice().reverse().slice(0, 6).map((message) => (
                    <div key={message.id} className="rounded-lg border border-neutral-100 bg-neutral-50 p-2 text-[10px]">
                      <div className="flex justify-between gap-2">
                        <span className="font-bold text-neutral-700">{message.senderName}</span>
                        <span className="text-neutral-400">{message.timestamp}</span>
                      </div>
                      <div className="text-neutral-400 uppercase tracking-widest">To: {message.recipientId}</div>
                      <p className="mt-1 text-neutral-600 line-clamp-2">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Block: Certificates Creator */}
            <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-emerald-930 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Certificate Management
                </h3>
                <p className="text-[11px] text-emerald-800 leading-normal">
                  Generate, preview, and issue completion certificates for attendees.
                </p>
                
                <div className="mt-4 p-3 bg-white/60 border border-emerald-100 rounded-lg text-[10px] text-emerald-900">
                  <span className="font-bold uppercase">Certificate ID:</span>
                  <ul className="list-disc pl-3.5 space-y-1 mt-1 font-mono">
                    <li>Event code: EVT-{selectedEvent.id.toUpperCase()}</li>
                    <li>Issue code: CERT-{selectedEvent.id.toUpperCase()}</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-100/60">
                {selectedEvent.certificatesConfigured ? (
                  <button
                    onClick={() => onIssueCertificates(selectedEvent.id)}
                    className="w-full py-2 bg-emerald-600 text-white font-extrabold rounded-lg text-xs hover:bg-emerald-700 transition-all cursor-pointer shadow-sm"
                  >
                    Issue Certificates
                  </button>
                ) : (
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-2">Enable certificate tracking first.</span>
                    <button
                      onClick={() => onIssueCertificates(selectedEvent.id)}
                      className="w-full py-2 bg-neutral-800 text-white font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Enable Certificates
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENTRY CHECK-IN TAB */}
      {activeTab === "checkin" && selectedEvent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-neutral-100 rounded-xl shadow-xs lg:col-span-2 space-y-5">
            <div>
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">QR Entry Desk</h3>
              <p className="text-xs text-neutral-500 mt-1">Scan or paste a participant QR payload, ticket code, or ticket ID to mark entry.</p>
            </div>

            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-neutral-500 uppercase mb-1">QR payload / ticket code</label>
                  <input
                    value={checkInInput}
                    onChange={(e) => setCheckInInput(e.target.value)}
                    placeholder="eme-ticket|tkt-1|evt-1|usr-6|TKT-INN-4890"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 uppercase mb-1">Verified by</label>
                  <input
                    value={checkInBy}
                    onChange={(e) => setCheckInBy(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button type="submit" className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold cursor-pointer">
                Verify Entry
              </button>
            </form>

            {checkInNotice && (
              <div className={`rounded-xl border p-4 text-xs ${checkInNotice.ok ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-amber-50 border-amber-100 text-amber-900"}`}>
                <div className="font-bold uppercase tracking-widest text-[10px] mb-1">{checkInNotice.ok ? "Entry Approved" : "Check-in Alert"}</div>
                <p>{checkInNotice.message}</p>
                {checkInNotice.ticket && (
                  <div className="mt-3 grid grid-cols-2 gap-3 text-[10px]">
                    <div className="rounded-lg bg-white/80 border border-neutral-100 p-2">
                      <div className="uppercase tracking-widest text-neutral-400 font-bold">Guest</div>
                      <div className="font-semibold text-neutral-800">{checkInNotice.ticket.participantName}</div>
                    </div>
                    <div className="rounded-lg bg-white/80 border border-neutral-100 p-2">
                      <div className="uppercase tracking-widest text-neutral-400 font-bold">Ticket</div>
                      <div className="font-semibold text-neutral-800">{checkInNotice.ticket.ticketCode}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 border border-neutral-100 rounded-xl shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Ticket Queue</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">{selectedEvent.title}</p>
            </div>

            <div className="space-y-3 max-h-[26rem] overflow-y-auto pr-1">
              {tickets.filter((ticket) => ticket.eventId === selectedEvent.id).length === 0 ? (
                <p className="text-xs text-neutral-400 py-6 text-center">No tickets issued for this event yet.</p>
              ) : (
                tickets.filter((ticket) => ticket.eventId === selectedEvent.id).map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => {
                      setCheckInInput(ticket.qrPayload);
                      setActiveTab("checkin");
                    }}
                    className="w-full text-left p-3 rounded-xl border border-neutral-100 bg-neutral-50/70 hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-neutral-800">{ticket.participantName}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">{ticket.ticketCode}</div>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${ticket.checkedIn ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {ticket.checkedIn ? "Checked In" : "Pending"}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE EVENT FORM TAB */}
      {activeTab === "create" && (
        <div className="bg-white p-6 sm:p-8 border border-neutral-100 rounded-xl shadow-xs max-w-3xl mx-auto">
          <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-widest mb-6 border-b border-neutral-50 pb-2">
            Host a New Event or Workshop
          </h3>

          <form onSubmit={handleCreateEvent} className="space-y-6">
            {/* Grid 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Community Forum 2026"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Category</label>
                <select
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Symposium">Symposium</option>
                  <option value="Social">Social</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>
            </div>

            {/* Grid 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5 font-bold text-neutral-700">Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Time</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Venue or meeting link</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Hall, Level 2, or a meeting link"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Max Capacity</label>
                <input
                  type="number"
                  required
                  min={10}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                  value={maxReg}
                  onChange={(e) => setMaxReg(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Short Description</label>
              <input
                type="text"
                required
                placeholder="A concise description shown in the event card"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Detailed Description</label>
              <textarea
                rows={4}
                placeholder="Provide a longer description with schedule, highlights, and attendee details..."
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-neutral-100">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase mb-1.5">Starting Budget Total ($)</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-emerald-100 bg-emerald-50/25 rounded-lg text-xs font-bold text-neutral-800"
                  value={budgetTotal}
                  onChange={(e) => setBudgetTotal(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Cover Image URL</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs font-mono"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>

            {/* Custom Initial Volunteer Role setup */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-3">
              <h4 className="text-[11px] font-extrabold text-neutral-600 uppercase tracking-widest block">Configure Volunteer Role</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Role Title (e.g. Registrar)</label>
                  <input
                    type="text"
                    className="w-full px-2.5 py-1.5 border border-neutral-200 rounded bg-white text-xs"
                    value={volunteerRoleName}
                    onChange={(e) => setVolunteerRoleName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Required Skills (Comma-separated)</label>
                  <input
                    type="text"
                    className="w-full px-2.5 py-1.5 border border-neutral-200 rounded bg-white text-xs"
                    value={volunteerSkills}
                    onChange={(e) => setVolunteerSkills(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500 mb-1">Short Role Description</label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-neutral-200 rounded bg-white text-xs"
                  value={volunteerRoleDesc}
                  onChange={(e) => setVolunteerRoleDesc(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Create Event
            </button>
          </form>
        </div>
      )}

      {/* BUDGET & EXPENSES TAB */}
      {activeTab === "budget" && selectedEvent && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: List Expenses and dynamic summary chart representation */}
            <div className="bg-white p-6 border border-neutral-100 rounded-xl lg:col-span-2 shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest block">Detailed Budget Ledger</h3>
                  <p className="text-[10px] text-neutral-500">Live operational invoices for {selectedEvent.title}</p>
                </div>
                <span className="text-xs font-bold text-neutral-700">Spent: ${selectedEvent.budgetSpent} ({Math.round((selectedEvent.budgetSpent / selectedEvent.budgetTotal) * 100)}%)</span>
              </div>

              {selectedEvent.budgetItems.length === 0 ? (
                <div className="text-center py-12 text-xs text-neutral-400 font-medium">
                  No budget items listed yet. Create expenses to track event spending.
                </div>
              ) : (
                <div className="divide-y divide-neutral-150">
                  {selectedEvent.budgetItems.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          item.category === "prizes" ? "bg-amber-500" :
                          item.category === "catering" ? "bg-emerald-500" :
                          item.category === "operations" ? "bg-indigo-500" : "bg-neutral-500"
                        }`} />
                        <div>
                          <p className="font-semibold text-neutral-800">{item.name}</p>
                          <span className="text-[9px] text-neutral-400 capitalize block">{item.category} item</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-neutral-900">${item.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right side: Add Expense form & breakdown */}
            <div className="space-y-6">
              <div className="bg-neutral-50 p-6 border border-neutral-150 rounded-xl">
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4">Log Expense</h3>
                <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase text-neutral-500 font-bold mb-1">Expense Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Printed schedules or venue signage"
                      className="w-full p-2 border border-neutral-200 rounded bg-white text-xs"
                      value={expName}
                      onChange={(e) => setExpName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 font-bold mb-1">Amount ($)</label>
                      <input
                        type="number"
                        min={1}
                        required
                        className="w-full p-2 border border-neutral-200 rounded bg-white text-xs"
                        value={expAmount}
                        onChange={(e) => setExpAmount(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 font-bold mb-1">Category</label>
                      <select
                        className="w-full p-2 border border-neutral-200 rounded bg-white text-xs"
                        value={expCat}
                        onChange={(e) => setExpCat(e.target.value as any)}
                      >
                        <option value="operations">Operations</option>
                        <option value="catering">Catering</option>
                        <option value="marketing">Marketing</option>
                        <option value="prizes">Prizes</option>
                        <option value="venue">Venue</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    Add Expense
                  </button>
                </form>
              </div>

              {/* ROI & Sponsorship analytics */}
              <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 text-xs text-emerald-950">
                <span className="font-bold flex items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-emerald-800" />
                  Event ROI Ledger
                </span>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Budget Allocation:</span>
                    <strong className="font-mono font-bold">${selectedEvent.budgetTotal}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual Spending:</span>
                    <strong className="font-mono font-bold text-amber-900">${selectedEvent.budgetSpent}</strong>
                  </div>
                  <div className="flex justify-between border-t border-emerald-100 pt-2 font-semibold">
                    <span>Sponsor Revenue:</span>
                    <strong className="font-mono text-emerald-800">${calculateEventSponsorshipRevenue(selectedEvent.id)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAFF & VOLUNTEERS APPLICATIONS TAB */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-neutral-100 rounded-xl shadow-xs">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4">
              Pending Volunteer Applications ({volunteerApps.filter((a) => a.status === "pending").length})
            </h3>

            {volunteerApps.filter((a) => a.status === "pending").length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No pending applications for review.</p>
            ) : (
              <div className="space-y-4">
                {volunteerApps.filter((a) => a.status === "pending").map((app) => (
                  <div key={app.id} className="p-4 bg-neutral-50/80 rounded-xl border border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-neutral-800">{app.volunteerName}</strong>
                        <span className="px-2 py-0.5 bg-neutral-200 text-neutral-600 rounded-md text-[9px] uppercase font-bold">{app.roleName}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Applied for: {app.eventTitle}</p>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {app.skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-emerald-50 text-[9px] text-emerald-800 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onApproveVolunteer(app.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded cursor-pointer"
                      >
                        Approve Candidate
                      </button>
                      <button
                        onClick={() => onRejectVolunteer(app.id)}
                        className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-600 text-[11px] font-medium rounded cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setProfileModalApp(app)}
                        className="px-2 py-1 bg-white border border-neutral-200 text-neutral-700 text-[11px] font-medium rounded cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core App Staff Task Allocation Table */}
          <div className="bg-white p-6 border border-neutral-100 rounded-xl shadow-xs">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4">
              Approved Volunteers & Task Allocation
            </h3>

            {volunteerApps.filter((a) => a.status === "approved").length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No active hired staff. Approve candidates above first.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {volunteerApps.filter((a) => a.status === "approved").map((app) => (
                  <div key={app.id} className="p-4 border border-neutral-100 rounded-xl bg-neutral-50/50 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-800">{app.volunteerName}</h4>
                        <span className="text-[9px] text-neutral-500 uppercase tracking-wide block">{app.roleName}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded uppercase">ACTIVE STAFF</span>
                    </div>

                    {/* Task checklist */}
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Assigned Tasks</span>
                      {app.assignedTasks.length === 0 ? (
                        <p className="text-[10px] text-neutral-400 font-medium">No tasks assigned yet. Allocate below.</p>
                      ) : (
                        <div className="space-y-1">
                          {app.assignedTasks.map((t) => (
                            <div key={t.id} className="flex justify-between items-center p-1.5 bg-white rounded border border-neutral-100 text-[11px]">
                              <span className="text-neutral-700">{t.name}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                t.status === "done" ? "bg-emerald-100 text-emerald-800" :
                                t.status === "doing" ? "bg-amber-100 text-amber-800" : "bg-neutral-100 text-neutral-500"
                              }`}>{t.status}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => { setReassigningTaskId(t.id); setReassignFromAppId(app.id); setReassignTargetAppId(null); }}
                                  className="ml-2 text-[10px] px-2 py-0.5 bg-neutral-100 hover:bg-neutral-150 rounded"
                                >
                                  Reassign
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reassign UI (shows when a task is selected) */}
                    {reassigningTaskId && reassignFromAppId === app.id && (
                      <div className="mt-2">
                        <label className="block text-[10px] text-neutral-500 mb-1">Move task to</label>
                        <div className="flex gap-2">
                          <select className="flex-1 p-2 border rounded text-xs" value={reassignTargetAppId || ""} onChange={(e) => setReassignTargetAppId(e.target.value)}>
                            <option value="">Select staff...</option>
                            {volunteerApps.filter((v) => v.status === 'approved' && v.id !== app.id).map((v) => (
                              <option key={v.id} value={v.id}>{v.volunteerName}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              if (reassignTargetAppId && reassigningTaskId && onReassignTask) {
                                onReassignTask(reassignFromAppId!, reassignTargetAppId, reassigningTaskId);
                              }
                              setReassigningTaskId(null);
                              setReassignFromAppId(null);
                              setReassignTargetAppId(null);
                            }}
                            className="px-3 py-1 bg-emerald-600 text-white text-xs rounded"
                          >Confirm</button>
                          <button onClick={() => { setReassigningTaskId(null); setReassignFromAppId(null); setReassignTargetAppId(null); }} className="px-2 py-1 border rounded text-xs">Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* Quick message to volunteer */}
                    <div className="pt-2">
                      <label className="block text-[10px] text-neutral-500 mb-1">Quick Message</label>
                      <div className="flex gap-2">
                        <input value={quickMessages[app.id] || ""} onChange={(e) => setQuickMessages((s) => ({ ...s, [app.id]: e.target.value }))} placeholder="Write a short message..." className="flex-1 px-2 py-1 border rounded text-[11px]" />
                        <button
                          onClick={() => {
                            const msg = quickMessages[app.id];
                            if (msg && onMessageVolunteer) {
                              onMessageVolunteer(app.volunteerId, msg);
                              setQuickMessages((s) => ({ ...s, [app.id]: "" }));
                            }
                          }}
                          className="px-3 py-1 bg-neutral-900 text-white rounded text-xs"
                        >Send</button>
                      </div>
                    </div>

                    {/* Quick Task allocator form */}
                    <div className="pt-2">
                      {focusedAppId === app.id ? (
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            required
                            placeholder="Type task details..."
                            className="flex-1 px-2.5 py-1 border border-neutral-200 bg-white rounded text-[11px]"
                            value={customTask}
                            onChange={(e) => setCustomTask(e.target.value)}
                          />
                          <button
                            onClick={() => handleAssignTaskLocal(app.id)}
                            className="bg-neutral-900 duration-150 uppercase text-white font-extrabold text-[10px] tracking-wider px-2.5 py-1 rounded cursor-pointer"
                          >
                            Assign
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setFocusedAppId(app.id)}
                          className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors uppercase cursor-pointer"
                        >
                          + Assign Task
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SPONSORSHIPS AGREEMENT REVIEW */}
      {activeTab === "sponsors" && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-neutral-100 rounded-xl shadow-xs">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4">
              Sponsor Approvals
            </h3>

            {sponsorAgreements.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No sponsor agreements filed yet.</p>
            ) : (
              <div className="space-y-4">
                {sponsorAgreements.map((sa) => (
                  <div key={sa.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-neutral-800">{sa.companyName}</strong>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] uppercase font-bold tracking-wider">{sa.tier} Sponsor</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Sponsor representative: {sa.sponsorName} | Amount: <strong className="font-mono text-emerald-800">${sa.price}</strong>
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Campaign program: {sa.eventTitle}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase ${
                        sa.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                        sa.status === "rejected" ? "bg-red-100 text-red-800" : "bg-neutral-100 text-neutral-500"
                      }`}>
                        {sa.status}
                      </span>

                      {sa.status === "pending" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => onApproveSponsor(sa.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onRejectSponsor(sa.id)}
                            className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-600 text-[11px] font-medium rounded cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
    {/* Volunteer Profile Modal */}
    {profileModalApp && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg border border-neutral-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold">Volunteer Profile - {profileModalApp.volunteerName}</h3>
            <button onClick={() => setProfileModalApp(null)} className="text-neutral-500">×</button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <div className="text-[11px] text-neutral-700 font-semibold">Email</div>
              <div className="text-[13px] text-neutral-600">{profileModalApp.volunteerEmail}</div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-700 font-semibold">Applied For</div>
              <div className="text-[13px] text-neutral-600">{profileModalApp.eventTitle} — {profileModalApp.roleName}</div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-700 font-semibold">Skills</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {profileModalApp.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[11px]">{s}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-neutral-700 font-semibold">Assigned Tasks</div>
              <div className="mt-2 space-y-2">
                {profileModalApp.assignedTasks.length === 0 ? (
                  <div className="text-[11px] text-neutral-400">No tasks yet.</div>
                ) : (
                  profileModalApp.assignedTasks.map((t) => (
                    <div key={t.id} className="flex justify-between items-center p-2 border rounded bg-neutral-50 text-[11px]">
                      <div>{t.name}</div>
                      <div className={`px-2 py-0.5 text-[10px] rounded ${t.status === 'done' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'}`}>{t.status}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">Send Quick Message</label>
              <div className="flex gap-2">
                <input value={profileMessage} onChange={(e) => setProfileMessage(e.target.value)} className="flex-1 p-2 border rounded text-sm" />
                <button onClick={() => { if (profileMessage && onMessageVolunteer) { onMessageVolunteer(profileModalApp.volunteerId, profileMessage); setProfileMessage(''); } setProfileModalApp(null); }} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">Send</button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setProfileModalApp(null)} className="px-3 py-1 border rounded text-sm">Close</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>);
}

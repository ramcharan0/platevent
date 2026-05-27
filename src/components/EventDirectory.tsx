import React, { useState } from "react";
import { Event, EventType, UserProfile, VolunteerRole, SponsorshipPackage } from "../types";
import { Search, Calendar, MapPin, Users, ArrowRight, Award, Shield, DollarSign, X, Check, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatDateIN } from "../utils/format";

interface EventDirectoryProps {
  events: Event[];
  currentUser: UserProfile;
  onRegister: (eventId: string, name: string, email: string) => void;
  onVolunteerApply: (eventId: string, role: VolunteerRole, name: string, email: string, skills: string[]) => void;
  onSponsorApply: (eventId: string, pack: SponsorshipPackage, company: string, name: string) => void;
}

export default function EventDirectory({
  events,
  currentUser,
  onRegister,
  onVolunteerApply,
  onSponsorApply,
}: EventDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Modal actions state
  const [activeTab, setActiveTab] = useState<"details" | "register" | "volunteer" | "sponsor">("details");
  
  // Registration Form
  const [regName, setRegName] = useState(currentUser.name);
  const [regEmail, setRegEmail] = useState(currentUser.email);
  
  // Volunteer Apply Form
  const [vRole, setVRole] = useState<VolunteerRole | null>(null);
  const [vSkillsInput, setVSkillsInput] = useState("");
  const [vSuccess, setVSuccess] = useState(false);

  // Sponsor Apply Form
  const [spPack, setSpPack] = useState<SponsorshipPackage | null>(null);
  const [spCompany, setSpCompany] = useState(currentUser.company || "Eco Ventures Ltd");
  const [spContact, setSpContact] = useState(currentUser.name);
  const [spSuccess, setSpSuccess] = useState(false);

  const [regSuccess, setRegSuccess] = useState(false);

  const actionTabsByRole: Record<UserProfile["role"], Array<"details" | "register" | "volunteer" | "sponsor">> = {
    organizer: ["details"],
    participant: ["details", "register"],
    volunteer: ["details", "volunteer"],
    sponsor: ["details", "sponsor"],
  };

  const allowedActionTabs = actionTabsByRole[currentUser.role] || ["details"];

  // Filters
  const eventTypes = ["All", "Workshop", "Symposium", "Social", "Conference"];
  const locations = ["All", "Mumbai", "New Delhi", "Bangalore", "Chennai", "Hyderabad", "Online"];

  const handleOpenEvent = (evt: Event) => {
    setSelectedEvent(evt);
    setActiveTab(allowedActionTabs[0] || "details");
    setRegSuccess(false);
    setVSuccess(false);
    setSpSuccess(false);
    if (evt.volunteerRoles.length > 0) {
      setVRole(evt.volunteerRoles[0]);
    }
    if (evt.sponsorshipPackages.length > 0) {
      setSpPack(evt.sponsorshipPackages[0]);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    onRegister(selectedEvent.id, regName, regEmail);
    setRegSuccess(true);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 1800);
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !vRole) return;
    const skillsArray = vSkillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    onVolunteerApply(selectedEvent.id, vRole, regName, regEmail, skillsArray.length > 0 ? skillsArray : ["Communication"]);
    setVSuccess(true);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 1800);
  };

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !spPack) return;
    onSponsorApply(selectedEvent.id, spPack, spCompany, spContact);
    setSpSuccess(true);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 1800);
  };

  // Clean date-formatting helper
  const formatEventDate = (dateStr: string) => formatDateIN(dateStr);

  // Modern Filter: "All" | "In-Person" | "Online" matching the webpage's pill triggers
  const fitsLocationFilter = (evtLocation: string) => {
    if (selectedLocation === "All") return true;
    if (selectedLocation === "Online") return evtLocation.toLowerCase().includes("online");
    // "In-Person" matches anything that is not purely "online"
    return !evtLocation.toLowerCase().includes("online");
  };

  const filteredEvents = events.filter((evt) => {
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          evt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || evt.type === selectedType;
    const matchesLoc = fitsLocationFilter(evt.location);
    return matchesSearch && matchesType && matchesLoc;
  });

  return (
    <div id="event-directory-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      
      {/* 2-Column Responsive Layout matching Quin site exactly */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column: Sticky Hero Column & Filter Controls (5/12 width on LG) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
          
          <div>
            {/* Custom stylized mini category indicator if active */}
            {selectedType !== "All" && (
              <span className="inline-block bg-[#121211] text-white font-mono text-[9px] font-black tracking-widest uppercase px-2 py-1 mb-4 rounded-xs">
                Active Tier: {selectedType}
              </span>
            )}
            
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-[#121211] tracking-tighter sm:leading-none leading-[0.98] font-sans">
              Discover what’s on,<br />register in seconds
            </h1>
            
            <p className="mt-5 text-sm md:text-base text-neutral-600 font-normal leading-relaxed max-w-md">
              Browse upcoming events, compare sessions, and open the details you need to register, volunteer, or manage a sponsorship.
            </p>
          </div>

          {/* Oulined Pill Box for ALL, IN-PERSON, ONLINE Filters */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[#7a7a76] uppercase tracking-widest block font-mono">
              Event Mode
            </span>
            <div className="border border-neutral-300 rounded-[#10px] p-1 bg-white/40 inline-flex gap-1 flex-wrap">
              {[
                { label: "ALL", val: "All" },
                { label: "IN-PERSON", val: "In-Person" },
                { label: "ONLINE", val: "Online" }
              ].map((pill) => (
                <button
                  key={pill.val}
                  onClick={() => setSelectedLocation(pill.val)}
                  className={`px-4 py-2 font-mono text-[11px] font-bold uppercase transition-all rounded-md cursor-pointer ${
                    selectedLocation === pill.val
                      ? "bg-[#121211] text-white shadow-xs"
                      : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar & categories dropdown built in a matching crisp container */}
          <div className="border-t border-neutral-200/80 pt-6 space-y-4">
            
            <div>
              <label htmlFor="search-input" className="block text-[10px] font-bold text-[#7a7a76] uppercase tracking-widest mb-1.5 font-mono">
                Search events
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Filter by title, description, or location"
                  id="search-input"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-black text-neutral-800 focus:ring-1 focus:ring-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <span className="block text-[10px] font-bold text-[#7a7a76] uppercase tracking-widest mb-2 font-mono">
                Event Type
              </span>
              <div className="flex flex-wrap gap-1.5">
                {eventTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 border rounded-md text-[11px] font-bold uppercase cursor-pointer transition-all ${
                      selectedType === type
                        ? "bg-[#121211] border-[#121211] text-white"
                        : "bg-white border-neutral-300 text-neutral-600 hover:border-black hover:text-black"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Prompt showing state counts */}
          <div className="bg-white/80 border border-neutral-300/60 p-4 rounded-xl text-xs space-y-1">
            <span className="font-bold text-[#121211] block">Current View</span>
            <p className="text-neutral-500">Showing {filteredEvents.length} events matching your selected filters.</p>
          </div>

        </div>

        {/* Right column: Dynamic Web-Style Grid (8/12 width on LG) */}
        <div className="lg:col-span-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-neutral-300 p-8">
              <HelpCircle className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-4 text-base font-bold text-neutral-900 uppercase tracking-tight">No Events Found</h3>
              <p className="mt-1 text-xs text-neutral-600 max-w-sm mx-auto">Try adjusting the filters, clearing search keywords, or selecting another event mode on the left.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("All");
                  setSelectedLocation("All");
                }}
                className="mt-6 inline-flex items-center px-4 py-2 bg-[#121211] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-neutral-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredEvents.map((evt) => {
                const isOnline = evt.location.toLowerCase().includes("online");
                return (
                  <div
                    key={evt.id}
                    onClick={() => handleOpenEvent(evt)}
                    className="group bg-white rounded-[20px] overflow-hidden border border-neutral-300/80 hover:border-[#121211] transition-all duration-300 cursor-pointer flex flex-col h-full shadow-xs"
                  >
                    {/* Event image container with elegant top overlay pills */}
                    <div className="relative aspect-[1.3/1] bg-neutral-100 overflow-hidden">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Left Overlay Pill (Date Range Style) */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white text-neutral-900 text-[10px] font-black uppercase tracking-tight shadow-sm rounded-sm font-mono border border-neutral-100">
                          {formatEventDate(evt.date)}
                        </span>
                      </div>

                      {/* Right Overlay Pill (Modality Style) */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-white text-neutral-900 text-[10px] font-black uppercase tracking-tight shadow-sm rounded-sm font-mono border border-neutral-100">
                          {isOnline ? "ONLINE" : "IN-PERSON"}
                        </span>
                      </div>
                    </div>

                    {/* Card Description and Text Block */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Event Category Flag */}
                        <div className="text-[#7a7a76] font-mono text-[9px] font-bold tracking-widest uppercase mb-2">
                          // {evt.type.toUpperCase()}
                        </div>
                        
                        <h3 className="text-xl sm:text-[22px] font-bold text-[#121211] leading-tight tracking-tight group-hover:underline transition-all mb-2">
                          {evt.title}
                        </h3>

                        <p className="text-xs text-neutral-600 font-normal leading-relaxed line-clamp-3">
                          {evt.description}
                        </p>
                      </div>

                      {/* Location visual box matching brown indicator square in Quin mockup */}
                      <div className="mt-5 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-xs flex-shrink-0 bg-amber-800" />
                        <span className="text-xs font-mono font-bold text-neutral-700 line-clamp-1">
                          {evt.location.replace("(and Online)", "").trim()}
                        </span>
                      </div>
                    </div>

                    {/* Dual Action Footer block split matching screenshot */}
                    <div className="border-t border-neutral-200/80 mt-auto flex h-14 bg-white">
                      
                      {/* Action trigger word */}
                      <div className="flex-1 flex items-center pl-5 font-mono text-xs font-bold uppercase tracking-wider text-[#121211]">
                        VIEW EVENT
                      </div>

                      {/* Right side block enclosing the big plus symbol */}
                      <div className="w-14 h-full border-l border-neutral-200/80 flex items-center justify-center text-lg font-bold text-[#121211] group-hover:bg-[#121211] group-hover:text-white transition-all">
                        +
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Details Side-over / Modal (using AnimatePresence) */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end items-stretch">
            {/* Overlay background close */}
            <div className="absolute inset-0 -z-10" onClick={() => setSelectedEvent(null)} />

            {/* Panel slider container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden h-full border-l border-neutral-100"
            >
              {/* Top Banner on Panel */}
              <div className="relative h-48 sm:h-56">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-md cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="px-2 py-0.5 text-[9px] font-extrabold tracking-widest bg-emerald-500 text-white rounded-md uppercase">
                    {selectedEvent.type}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mt-1">
                    {selectedEvent.title}
                  </h2>
                </div>
              </div>

              {/* Dynamic Action Navigation Tab */}
              <div className="bg-neutral-50 px-6 border-b border-neutral-100 flex gap-2">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "details"
                      ? "border-emerald-600 text-emerald-800"
                      : "border-transparent text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Event Details
                </button>
                {allowedActionTabs.includes("register") && (
                  <button
                    onClick={() => setActiveTab("register")}
                    className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                      activeTab === "register"
                        ? "border-emerald-600 text-emerald-800"
                        : "border-transparent text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    Participant Ticket
                  </button>
                )}
                {allowedActionTabs.includes("volunteer") && (
                  <button
                    onClick={() => setActiveTab("volunteer")}
                    className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                      activeTab === "volunteer"
                        ? "border-emerald-600 text-emerald-800"
                        : "border-transparent text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    Volunteer Opportunity
                  </button>
                )}
                {allowedActionTabs.includes("sponsor") && (
                  <button
                    onClick={() => setActiveTab("sponsor")}
                    className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                      activeTab === "sponsor"
                        ? "border-emerald-600 text-emerald-800"
                        : "border-transparent text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    Corporate Sponsor
                  </button>
                )}
              </div>

              {/* Panel Content Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                
                {/* 1. VIEW DETAILED DIRECTORY INFO */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">About The Event</h4>
                      <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                        {selectedEvent.longDescription || selectedEvent.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Time & Date</span>
                        <span className="text-xs font-bold text-neutral-700 block mt-1">{formatDateIN(selectedEvent.date)}</span>
                        <span className="text-[10px] text-neutral-500">{selectedEvent.time}</span>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Location</span>
                        <span className="text-xs font-bold text-neutral-700 block mt-1 line-clamp-1">{selectedEvent.location}</span>
                        <span className="text-[10px] text-neutral-500">In-Person & Digital Stream</span>
                      </div>
                    </div>

                    {/* Operational Agenda */}
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Agenda & Run Scheme</h4>
                      <div className="space-y-2">
                        {selectedEvent.agenda.map((ag) => (
                          <div key={ag.id} className="flex gap-4 p-2 bg-neutral-50 rounded-md text-xs border border-neutral-100">
                            <span className="font-mono text-emerald-700 font-bold w-20 flex-shrink-0">{ag.time}</span>
                            <span className="text-neutral-700">{ag.activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stat Bar */}
                    <div className="pt-4 border-t border-neutral-100 flex justify-between items-center text-xs">
                      <span className="text-neutral-500">Organizer: <strong className="text-neutral-700">{selectedEvent.organizerEmail}</strong></span>
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md font-medium">Auto-certificate supported</span>
                    </div>
                  </div>
                )}

                {/* 2. REGISTER AS PARTICIPANT */}
                {activeTab === "register" && (
                  <div>
                    {regSuccess ? (
                      <div className="text-center py-12">
                        <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-4">
                          <Check className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-bold text-neutral-900">Ticket Reserved Successfully!</h4>
                        <p className="text-xs text-neutral-500 mt-1">We sent a confirmation to {regEmail}. Your QR entry pass is now available in the Participant dashboard tab.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleRegisterSubmit} className="space-y-5">
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-2">
                          <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">Standard Admission Pass</h5>
                          <p className="text-xs text-emerald-700 mt-1">Free and open to all university students, industry members, and community builders. Access to all sessions and certificate of completion.</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Your Full Name</label>
                          <input
                            type="text"
                            required
                            className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Email Address</label>
                          <input
                            type="email"
                            required
                            className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Confirm Free Registration
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 3. APPLY TO VOLUNTEER */}
                {activeTab === "volunteer" && (
                  <div>
                    {vSuccess ? (
                      <div className="text-center py-12">
                        <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-4">
                          <Check className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-bold text-neutral-900">Application Submitted!</h4>
                        <p className="text-xs text-neutral-500 mt-1">The event organizer will review your profile. Track status and find assigned tasks under the "Volunteer" portal tab.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleVolunteerSubmit} className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Select Volunteer Role</label>
                          <div className="space-y-2">
                            {selectedEvent.volunteerRoles.map((role) => (
                              <label
                                key={role.id}
                                className={`block p-3 border rounded-xl cursor-pointer transition-all ${
                                  vRole?.id === role.id
                                    ? "border-emerald-500 bg-emerald-50/25"
                                    : "border-neutral-200 hover:bg-neutral-50"
                                }`}
                                onClick={() => setVRole(role)}
                              >
                                <div className="flex justify-between text-xs font-bold text-neutral-800">
                                  <span>{role.roleName}</span>
                                  <span className="text-emerald-700">{role.spotsLeft} vacancies left</span>
                                </div>
                                <p className="text-[10px] text-neutral-500 mt-1">{role.description}</p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {role.skillsRequired.map((s) => (
                                    <span key={s} className="px-2 py-0.5 bg-neutral-100 text-[9px] text-neutral-600 rounded-md">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Add Your Skills / Bio Highlights</label>
                          <input
                            type="text"
                            placeholder="e.g. React, Event Logistics, Public Relations"
                            className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={vSkillsInput}
                            onChange={(e) => setVSkillsInput(e.target.value)}
                          />
                          <p className="text-[10px] text-neutral-400 mt-1">Comma-separated skills. It increases your match relevance index.</p>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Submit Volunteer Application
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 4. PURCHASE CORPORATE SPONSORSHIP */}
                {activeTab === "sponsor" && (
                  <div>
                    {spSuccess ? (
                      <div className="text-center py-12">
                        <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-4">
                          <Check className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-bold text-neutral-900">Sponsorship Proposal Lodged!</h4>
                        <p className="text-xs text-neutral-500 mt-1">Thank you for supporting this ecosystem! The organizers have been notified. Visit the "Sponsor" portal to configure banners and track ROI metrics.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSponsorSubmit} className="space-y-4">
                        <div className="mb-2">
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Select Package Tier</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedEvent.sponsorshipPackages.map((pack) => (
                              <label
                                key={pack.id}
                                className={`p-3 border rounded-xl cursor-pointer block transition-all ${
                                  spPack?.id === pack.id
                                    ? "border-emerald-500 bg-emerald-50/25 ring-1 ring-emerald-500"
                                    : "border-neutral-200 hover:bg-neutral-50"
                                }`}
                                onClick={() => setSpPack(pack)}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-extrabold text-neutral-800 tracking-tight uppercase">{pack.tier} Package</span>
                                  <span className="font-mono text-xs font-bold text-emerald-700">${pack.price}</span>
                                </div>
                                <p className="text-[10px] text-neutral-400 mt-1">Spots left: {pack.spotsLeft} / {pack.spots}</p>
                                <ul className="text-[10px] text-neutral-500 mt-2 space-y-1 pl-3.5 list-disc leading-tight">
                                  {pack.perks.slice(0, 3).map((p, idx) => (
                                    <li key={idx}>{p}</li>
                                  ))}
                                </ul>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Company legal name</label>
                            <input
                              type="text"
                              required
                              className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                              value={spCompany}
                              onChange={(e) => setSpCompany(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Contact representative</label>
                            <input
                              type="text"
                              required
                              className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                              value={spContact}
                              onChange={(e) => setSpContact(e.target.value)}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Send Placement Request & Commit Funds
                        </button>
                      </form>
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

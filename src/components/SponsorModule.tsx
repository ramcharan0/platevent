import React, { useState } from "react";
import { UserProfile, Event, SponsorshipAgreement, SponsorshipPackage, MockMessage } from "../types";
import { DollarSign, Eye, Compass, TrendingUp, Sparkles, Building2, Check, ExternalLink, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { formatCurrencyINR } from "../utils/format";

interface SponsorModuleProps {
  currentUser: UserProfile;
  events: Event[];
  messages: MockMessage[];
  sponsorAgreements: SponsorshipAgreement[];
  onSponsorApply: (eventId: string, pack: SponsorshipPackage, company: string, name: string) => void;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
  onSendMessage: (recipientId: string, message: string) => void;
}

export default function SponsorModule({
  currentUser,
  events,
  messages,
  sponsorAgreements,
  onSponsorApply,
  onUpdateProfile,
  onSendMessage,
}: SponsorModuleProps) {
  const [activeTab, setActiveTab] = useState<"active" | "discover" | "profile" | "messages">("active");

  // Profile data
  const [companyName, setCompanyName] = useState(currentUser.company || "Optima Tech Ventures");
  const [industry, setIndustry] = useState(currentUser.industry || "Software & Machine Learning");
  const [editing, setEditing] = useState(false);

  // Filter for matching discover events
  const [industryFilter, setIndustryFilter] = useState("All");
  const [sponsorMessage, setSponsorMessage] = useState("");

  const mySponsorships = sponsorAgreements.filter((sa) => sa.companyName.toLowerCase() === companyName.toLowerCase());
  const sharedMessages = messages.filter((message) => {
    const isMine = message.senderName === currentUser.name;
    return isMine || message.recipientId === "all" || message.recipientId === "sponsor" || message.recipientId === currentUser.id;
  });

  // Industry recommendation system logic
  const matchEventWithIndustry = (evtType: string, ind: string) => {
    if (ind.includes("Technology") && (evtType === "Conference" || evtType === "Symposium")) return "Strong Match (96%)";
    if (ind.includes("Community") && evtType === "Social") return "Strong Match (94%)";
    if (ind.includes("Design") && evtType === "Workshop") return "Creative Track Match (95%)";
    return "Standard Match (70%)";
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ company: companyName, industry });
    setEditing(false);
  };

  const handleSponsorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorMessage.trim()) return;
    onSendMessage("organizer", sponsorMessage.trim());
    setSponsorMessage("");
  };

  return (
    <div id="sponsor-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-100 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Sponsor Workspace</h2>
          <p className="text-xs text-neutral-500">Discover events, review placement options, and track approved sponsor activity.</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-center">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Active Capital Contribution</span>
          <span className="text-2xl font-black text-amber-970">
            {formatCurrencyINR(mySponsorships.filter((s) => s.status === "approved").reduce((sum, s) => sum + s.price, 0))}
          </span>
        </div>
      </div>

      {/* Internal Navigation tabs */}
      <div className="flex gap-2 border-b border-neutral-100 mb-8 pb-1">
        {[
          { id: "active", label: "My Sponsorships", count: mySponsorships.filter((s) => s.status === "approved").length },
          { id: "discover", label: "Discover Events", count: null },
          { id: "profile", label: "Company Profile", count: null },
          { id: "messages", label: "Messages", count: sharedMessages.length }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`spon-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-4 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 2. TAB COMPONENT VIEWS */}

      {/* ACTIVE SPONSORSHIPS CAMPAIGN TAB */}
      {activeTab === "active" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ROI Dashboard Block */}
            <div className="bg-white p-6 border border-neutral-100 rounded-xl lg:col-span-2 shadow-xs space-y-6">
              <div>
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest block">Event Performance</h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">Track impressions, clicks, and leads from approved placements.</p>
              </div>

              {mySponsorships.length === 0 ? (
                <div className="text-center py-16 text-xs text-neutral-400 font-medium">
                  No approved sponsorships registered. Visit "Discover Events" to review placements.
                </div>
              ) : (
                <div className="space-y-6">
                  {mySponsorships.map((sa) => (
                    <div key={sa.id} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-150">
                        <div>
                          <h4 className="text-xs font-bold text-neutral-800">{sa.eventTitle}</h4>
                          <span className="text-[9px] text-amber-800 font-bold uppercase tracking-wide block mt-0.5">Tier: {sa.tier} Sponsor</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          sa.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-500"
                        }`}>{sa.status}</span>
                      </div>

                      {sa.status === "approved" ? (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white p-3 border border-neutral-100 rounded-lg text-center">
                            <span className="text-[10px] font-bold text-neutral-400 block uppercase">Impressions</span>
                            <span className="text-xl font-bold font-mono text-neutral-800 mt-1 block">{sa.roi.impressions}</span>
                          </div>
                          <div className="bg-white p-3 border border-neutral-100 rounded-lg text-center">
                            <span className="text-[10px] font-bold text-neutral-400 block uppercase">Brand Clicks</span>
                            <span className="text-xl font-bold font-mono text-neutral-800 mt-1 block">{sa.roi.clicks}</span>
                          </div>
                          <div className="bg-white p-3 border border-neutral-100 rounded-lg text-center animate-pulse">
                            <span className="text-[10px] font-bold text-neutral-400 block uppercase">Resume Leads</span>
                            <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">{sa.roi.leadsGenerated}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-neutral-400 leading-normal text-center py-4">Waiting for organizer to accept proposal. ROI counters activate post-approval.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar analytics */}
            <div className="space-y-6">
              <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100 space-y-3">
                <span className="font-bold flex items-center gap-1 text-xs text-amber-950">
                  <TrendingUp className="w-4 h-4 text-amber-800" />
                  Ecosystem Benefits
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Event sponsorship helps support programming, visibility, and attendee experience.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DISCOVER PLACEMENTS TAB */}
      {activeTab === "discover" && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-neutral-100 rounded-xl shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest block">Available Sponsorship Placements</h3>
                <p className="text-[10px] text-neutral-400">Discover matches using the current company profile.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 border border-neutral-150 rounded-xl bg-neutral-100/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-black text-neutral-800 max-w-[70%]">{evt.title}</h4>
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-800 font-bold rounded-md">
                        {matchEventWithIndustry(evt.type, industry)}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 line-clamp-2 mb-3">{evt.description}</p>
                    <span className="text-[9px] font-semibold text-neutral-400 block uppercase">Location: {evt.location}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-150/40 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-neutral-400 block">Pricing from:</span>
                      <strong className="text-xs text-emerald-800 font-bold font-mono">{formatCurrencyINR(evt.sponsorshipPackages[evt.sponsorshipPackages.length - 1]?.price || 1000)}</strong>
                    </div>

                    <button
                      onClick={() => {
                        // Triggers the standard package select apply callback
                        if (evt.sponsorshipPackages.length > 0) {
                          onSponsorApply(evt.id, evt.sponsorshipPackages[0], companyName, currentUser.name);
                          setActiveTab("active");
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold tracking-wide transition-all uppercase cursor-pointer"
                    >
                      Bespoke Backing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROFILE SETTINGS TAB */}
      {activeTab === "profile" && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white p-6 sm:p-8 border border-neutral-100 rounded-xl shadow-xs space-y-6">
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest block mb-4 border-b border-neutral-50 pb-2">Company profile</h3>

            {editing ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Company Display Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Primary Industry Target</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  Save Profile Settings
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex gap-4 items-center">
                  <div className="bg-neutral-50 p-3 rounded-full border border-neutral-100">
                    <Building2 className="w-8 h-8 text-neutral-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-800">{companyName}</h4>
                    <p className="text-xs text-neutral-400">{currentUser.email}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-neutral-50 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Industry Code</span>
                    <span className="text-neutral-700 font-semibold block">{industry}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Status</span>
                    <span className="text-emerald-800 font-bold block">Ecosystem Sponsor ✓</span>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded text-xs font-semibold hover:bg-neutral-150 cursor-pointer"
                >
                  Edit Settings
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === "messages" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-xs lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Communication Board</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">Track organizer updates and sponsor conversations in one place.</p>
            </div>

            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
              {sharedMessages.length === 0 ? (
                <p className="text-xs text-neutral-400 py-10 text-center">No board messages yet.</p>
              ) : (
                sharedMessages.map((message) => (
                  <div key={message.id} className={`p-3 rounded-xl border text-xs ${message.senderName === currentUser.name ? "bg-amber-50 border-amber-100" : "bg-neutral-50 border-neutral-100"}`}>
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="font-bold text-neutral-800">{message.senderName}</div>
                        <div className="text-[10px] uppercase tracking-widest text-neutral-400">To: {message.recipientId}</div>
                      </div>
                      <span className="text-[10px] text-neutral-400">{message.timestamp}</span>
                    </div>
                    <p className="mt-2 text-neutral-700 leading-relaxed">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Post to Organizer</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">Send a question or status update to the event team.</p>
            </div>
            <form onSubmit={handleSponsorMessage} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-500 uppercase mb-1">Message</label>
                <textarea value={sponsorMessage} onChange={(e) => setSponsorMessage(e.target.value)} rows={4} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs" placeholder="Ask about placement, approvals, or deliverables..." />
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold cursor-pointer">Send to organizer</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

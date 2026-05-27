import React, { useState } from "react";
import { Ticket, Feedback, MockMessage, UserProfile } from "../types";
import { Award, Mail, QrCode, Shield, MapPin, Calendar, Check, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatDateIN } from "../utils/format";
import { QRCodeSVG } from "qrcode.react";

interface ParticipantModuleProps {
  currentUser: UserProfile;
  tickets: Ticket[];
  feedbacks: Feedback[];
  messages: MockMessage[];
  onAddFeedback: (eventId: string, rating: number, comment: string, tags: string[]) => void;
  onFeedbackSubmitted: (ticketId: string) => void;
  onSendMessage: (recipientId: string, message: string) => void;
}

export default function ParticipantModule({
  currentUser,
  tickets,
  feedbacks,
  messages,
  onAddFeedback,
  onFeedbackSubmitted,
  onSendMessage,
}: ParticipantModuleProps) {
  const [activeTab, setActiveTab] = useState<"tickets" | "certificates" | "network" | "board">("tickets");

  // Certificate render context
  const [focusedCertificateTicket, setFocusedCertificateTicket] = useState<Ticket | null>(null);
  const [selectedQrTicket, setSelectedQrTicket] = useState<Ticket | null>(null);

  // Feedback parameters
  const [activeFeedbackTicket, setActiveFeedbackTicket] = useState<Ticket | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [tagsInput, setTagsInput] = useState("Useful, Inspiring");

  // Networking parameters
  const [selectedPeerId, setSelectedPeerId] = useState<string>("peer-2");
  const [chatInput, setChatInput] = useState("");
  const [boardTarget, setBoardTarget] = useState<"organizer" | "all">("organizer");
  const [boardMessage, setBoardMessage] = useState("");

  const sharedBoardMessages = messages.filter((message) => {
    const isMine = message.senderName === currentUser.name;
    const isPublic = message.recipientId === "all";
    const isParticipantBoard = message.recipientId === "participant";
    const isForMe = message.recipientId === currentUser.id || message.recipientId === currentUser.role;
    const isForOrganizerReply = currentUser.role === "participant" && message.recipientId === "organizer";
    return isMine || isPublic || isParticipantBoard || isForMe || isForOrganizerReply;
  });

  const networkingPeers = [
    { id: "peer-1", name: "Sana Khan", role: "Software Intern", email: "sana.khan@student.edu.in", bio: "Interested in React design systems, UX animation, and outdoor hiking." },
    { id: "peer-2", name: "Marcus Vance", role: "Sponsor Representative", email: "marcus.v@luminate.agency", bio: "Talent acquisition partner. Always searching for React juniors." },
    { id: "peer-3", name: "Zoe Patel", role: "Student", email: "z.patel@camp.edu.in", bio: "Fascinated by ethical compute, LLM calibration biases, and green power lines." }
  ];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedbackTicket || !comment) return;
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    onAddFeedback(activeFeedbackTicket.eventId, rating, comment, tags);
    onFeedbackSubmitted(activeFeedbackTicket.id);
    setActiveFeedbackTicket(null);
    setComment("");
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;
    onSendMessage(selectedPeerId, chatInput);
    setChatInput("");
  };

  const handleBoardPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardMessage.trim()) return;
    onSendMessage(boardTarget, boardMessage.trim());
    setBoardMessage("");
  };

  return (
    <div id="participant-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-100 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Participant Lounge</h2>
          <p className="text-xs text-neutral-500">Access your tickets, submit feedback, view certificates, and message other attendees.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Registered Tickets</span>
            <span className="text-2xl font-black text-emerald-990">{tickets.length} Registered</span>
          </div>
        </div>
      </div>

      {/* Internal Navigation tabs */}
      <div className="flex gap-2 border-b border-neutral-100 mb-8 pb-1">
        {[
          { id: "tickets", label: "My Tickets", count: tickets.filter((t) => !t.feedbackSubmitted).length },
          { id: "board", label: "Message Board", count: sharedBoardMessages.length },
          { id: "certificates", label: "Certificates", count: tickets.filter((t) => t.certificateIssued).length },
          { id: "network", label: "Networking", count: null }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`part-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-4 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 2. TAB COMPONENT VIEWS */}

      {/* MESSAGE BOARD TAB */}
      {activeTab === "board" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-xs lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Shared Message Board</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">Read organizer announcements and send a note back to the team.</p>
            </div>

            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
              {sharedBoardMessages.length === 0 ? (
                <p className="text-xs text-neutral-400 py-10 text-center">No messages on the board yet.</p>
              ) : (
                sharedBoardMessages.map((message) => (
                  <div key={message.id} className={`p-3 rounded-xl border text-xs ${message.senderName === currentUser.name ? "bg-emerald-50 border-emerald-100" : "bg-neutral-50 border-neutral-100"}`}>
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
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Post Message</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">Send a note to the organizer or the public board.</p>
            </div>
            <form onSubmit={handleBoardPost} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-500 uppercase mb-1">Audience</label>
                <select value={boardTarget} onChange={(e) => setBoardTarget(e.target.value as "organizer" | "all")} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs bg-white">
                  <option value="organizer">Organizer</option>
                  <option value="all">Public board</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-neutral-500 uppercase mb-1">Message</label>
                <textarea value={boardMessage} onChange={(e) => setBoardMessage(e.target.value)} rows={4} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs" placeholder="Ask a question or share an update..." />
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold cursor-pointer">Send to board</button>
            </form>
          </div>
        </div>
      )}

      {/* TICKETS TAB */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                
                {/* Visual Ticket Body */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded uppercase">Event Admission</span>
                      <h3 className="text-base font-bold text-neutral-900 mt-2">{tkt.eventTitle}</h3>
                    </div>
                    {/* Simulated Ticket Code */}
                    <span className="font-mono text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">{tkt.ticketCode}</span>
                  </div>

                  <div className="space-y-1 text-xs text-neutral-500">
                      <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-300" />
                      Date: <strong className="text-neutral-700">{formatDateIN(tkt.eventDate)}</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-neutral-300" />
                      Venue: <strong className="text-neutral-700">{tkt.eventLocation}</strong>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Registered holder:</span>
                      <strong className="text-xs text-neutral-800">{tkt.participantName}</strong>
                      <div className="mt-1 flex items-center gap-2 text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${tkt.checkedIn ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {tkt.checkedIn ? "Checked In" : "Awaiting Entry"}
                        </span>
                        <button
                          onClick={() => setSelectedQrTicket(tkt)}
                          className="text-emerald-700 font-bold hover:text-emerald-900"
                        >
                          Open QR
                        </button>
                      </div>
                    </div>

                    {/* QR Code preview */}
                    <button
                      onClick={() => setSelectedQrTicket(tkt)}
                      className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 flex items-center gap-2 cursor-pointer hover:bg-neutral-100 transition-colors"
                    >
                      <QRCodeSVG value={tkt.qrPayload} size={56} level="M" includeMargin fgColor="#115e59" bgColor="#ffffff" />
                      <div className="leading-none text-left">
                        <span className="text-[9px] text-neutral-400 block">Entry QR</span>
                        <span className="text-[8px] font-bold font-mono text-emerald-700 block">Tap to enlarge</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sub Action bar: Feedback trigger */}
                <div className="bg-neutral-50 p-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">Submit feedback after the event to unlock certificates.</span>
                  
                  {tkt.feedbackSubmitted ? (
                    <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Feedback Lodged
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveFeedbackTicket(tkt)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      Leave Feedback
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Feedback Modal Overlay */}
          <AnimatePresence>
            {activeFeedbackTicket && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl w-full max-w-md p-6 border border-neutral-100 shadow-2xl space-y-5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Submit Event Review</h3>
                      <h4 className="text-sm font-extrabold text-neutral-900 mt-1">{activeFeedbackTicket.eventTitle}</h4>
                    </div>
                    <button
                      onClick={() => setActiveFeedbackTicket(null)}
                      className="text-neutral-400 hover:text-neutral-800 text-xs font-semibold cursor-pointer"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Overall Quality Rating (1 to 5 Stars)</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-2.5 rounded text-xs font-bold flex-1 cursor-pointer transition-colors ${
                              rating >= star
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-neutral-50 text-neutral-400 border border-neutral-100"
                            }`}
                          >
                            ⭐ {star}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">What did you enjoy most? Suggestions?</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Discuss venue layout, catering quality, or event flow..."
                        className="w-full p-3 border border-neutral-250 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1.5">Quick Tags (Comma-separated)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs cursor-pointer"
                    >
                      Save Review
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* QR Ticket Viewer */}
          <AnimatePresence>
            {selectedQrTicket && (
              <div className="fixed inset-0 bg-black/55 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl w-full max-w-md p-6 border border-neutral-100 shadow-2xl space-y-5"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Entry QR Pass</h3>
                      <h4 className="text-sm font-extrabold text-neutral-900 mt-1">{selectedQrTicket.eventTitle}</h4>
                    </div>
                    <button onClick={() => setSelectedQrTicket(null)} className="text-neutral-400 hover:text-neutral-800 text-xs font-semibold cursor-pointer">×</button>
                  </div>

                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex flex-col items-center gap-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-neutral-100">
                      <QRCodeSVG value={selectedQrTicket.qrPayload} size={200} level="M" includeMargin fgColor="#115e59" bgColor="#ffffff" />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-sm font-bold text-neutral-900">{selectedQrTicket.participantName}</div>
                      <div className="text-xs text-neutral-500">{selectedQrTicket.ticketCode}</div>
                      <div className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase ${selectedQrTicket.checkedIn ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {selectedQrTicket.checkedIn ? "Checked In" : "Ready to Scan"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-neutral-100 p-3 bg-neutral-50">
                      <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Issued</div>
                      <div className="mt-1 font-semibold text-neutral-800">{formatDateIN(selectedQrTicket.qrIssuedAt.slice(0, 10))}</div>
                    </div>
                    <div className="rounded-xl border border-neutral-100 p-3 bg-neutral-50">
                      <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Entry Gate</div>
                      <div className="mt-1 font-semibold text-neutral-800">{selectedQrTicket.checkedInBy || "Not checked in"}</div>
                    </div>
                  </div>

                  <button onClick={() => setSelectedQrTicket(null)} className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-800">
                    Close
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* CERTIFICATES VAULT TAB */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-neutral-100 rounded-xl shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest block">Available Completion Certificates</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">Certificates ready for your records or portfolio.</p>
            </div>

            {tickets.filter((t) => t.certificateIssued).length === 0 ? (
              <p className="text-xs text-neutral-400 py-12 text-center">No certificates issued yet. Please ensure organizers enable certificates and feedback forms are filled.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tickets.filter((t) => t.certificateIssued).map((tkt) => (
                  <div key={tkt.id} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 flex justify-between items-center">
                    <div>
                      <strong className="text-xs text-neutral-800 block line-clamp-1">{tkt.eventTitle}</strong>
                      <span className="text-[9px] uppercase text-emerald-800 font-extrabold block mt-1 tracking-wider">CERTIFICATE ISSUED ✓</span>
                    </div>
                    <button
                      onClick={() => setFocusedCertificateTicket(tkt)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold cursor-pointer"
                    >
                      Draw Paper
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certificate Drawer Modal */}
          <AnimatePresence>
            {focusedCertificateTicket && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-stone-50 rounded-2xl w-full max-w-2xl p-8 border border-stone-200 shadow-2xl space-y-6 text-center text-stone-900 relative"
                >
                  {/* Decorative Frame border */}
                  <div className="absolute inset-4 border border-dashed border-stone-300 pointer-events-none rounded-lg" />
                  
                  <div className="flex justify-between items-center mt-2 relative z-10">
                    <span className="text-[9px] font-mono font-bold uppercase text-stone-400">Certificate ID: CERT-{focusedCertificateTicket.id.toUpperCase()}</span>
                    <button
                      onClick={() => setFocusedCertificateTicket(null)}
                      className="text-stone-400 hover:text-stone-800 font-extrabold cursor-pointer text-sm"
                    >
                      ×
                    </button>
                  </div>

                  <div className="py-6 space-y-6 relative z-10">
                    <span className="text-xs tracking-widest font-extrabold uppercase text-stone-540 block mb-2">Certificate of Recognition</span>
                    
                    <h3 className="text-3xl font-serif tracking-wide text-neutral-900 font-semibold">
                      {focusedCertificateTicket.participantName}
                    </h3>
                    
                    <div className="w-16 h-px bg-stone-400 mx-auto" />

                    <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                      has successfully completed the event program associated with the event:
                    </p>

                    <h4 className="text-sm font-extrabold uppercase text-stone-800 italic max-w-lg mx-auto">
                      {focusedCertificateTicket.eventTitle}
                    </h4>

                    <span className="text-[10px] text-stone-400 block tracking-widest uppercase">
                      Issued on {formatDateIN(focusedCertificateTicket.registrationDate)}
                    </span>
                  </div>

                  {/* Seals & Signatures block */}
                  <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-[10px] text-stone-400 relative z-10 px-4">
                    <div className="text-left">
                      <strong className="text-stone-600 block leading-tight font-serif italic text-sm">Ravi Kumar</strong>
                      <span className="uppercase tracking-wider">Lead Organizer</span>
                    </div>

                    <div className="text-center font-bold text-center border-2 border-emerald-600 text-emerald-700 px-3 py-1.5 rounded-full rotate-[-5deg]">
                      VERIFIED ✓
                    </div>

                    <div className="text-right">
                      <strong className="text-stone-600 block font-serif leading-tight">Event Management</strong>
                      <span className="uppercase tracking-wider">Office</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const blob = new Blob([
                        `Certificate ID: CERT-${focusedCertificateTicket.id.toUpperCase()}\nName: ${focusedCertificateTicket.participantName}\nEvent: ${focusedCertificateTicket.eventTitle}\nIssued: ${formatDateIN(focusedCertificateTicket.registrationDate)}`
                      ], { type: "text/plain;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${focusedCertificateTicket.eventTitle}-certificate.txt`.replace(/[^a-z0-9-_\.]/gi, "-");
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full mt-6 py-2.5 bg-neutral-900 border border-neutral-950 text-white font-extrabold rounded text-xs hover:bg-neutral-800 transition-colors relative z-10 cursor-pointer"
                  >
                    Download Certificate
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* PEER NETWORKING LOUNGE TAB */}
      {activeTab === "network" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Chat Pane */}
            <div className="bg-white border border-neutral-100 rounded-xl p-6 lg:col-span-2 shadow-xs flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="border-b border-neutral-100 pb-4 mb-4">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Direct Channel</span>
                  <strong className="text-sm text-neutral-800">
                    {networkingPeers.find((p) => p.id === selectedPeerId)?.name || "Sarah Wu"}
                  </strong>
                </div>

                {/* Messages stream */}
                <div className="space-y-3 h-64 overflow-y-auto mb-4">
                  {messages.filter((m) => m.recipientId === selectedPeerId).length === 0 ? (
                    <div className="text-center text-xs text-neutral-400 pt-16">
                      No communications yet. Send a message to start networking.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {messages.filter((m) => m.recipientId === selectedPeerId).map((msg) => (
                        <div key={msg.id} className="flex flex-col items-start bg-neutral-50 p-2.5 rounded-lg text-xs border border-neutral-100 max-w-[85%]">
                          <span className="font-extrabold text-[10px] text-emerald-800">{msg.senderName} ({msg.senderRole}):</span>
                          <p className="text-neutral-700 mt-1">{msg.message}</p>
                          <span className="text-[9px] text-neutral-400 mt-1.5 self-end">{msg.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Send Form */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Introduce yourself or ask about the event..."
                  className="flex-1 px-3 py-2 border border-neutral-250 bg-white rounded-lg text-xs"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>

            {/* Right List of Peers */}
            <div className="bg-neutral-50 border border-neutral-150 rounded-xl p-5 space-y-4">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Co-Attendees Online</span>
              <div className="space-y-3">
                {networkingPeers.map((peer) => (
                  <div
                    key={peer.id}
                    onClick={() => setSelectedPeerId(peer.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPeerId === peer.id 
                        ? "bg-white border-emerald-500 ring-1 ring-emerald-500" 
                        : "bg-white hover:bg-neutral-100 border-neutral-150"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-neutral-800">{peer.name}</span>
                      <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[9px] uppercase font-bold">{peer.role}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">{peer.bio}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

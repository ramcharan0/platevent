import React from "react";

export default function HelpModule() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white border border-neutral-100 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-neutral-900">Help & Support</h2>
        <p className="text-sm text-neutral-600 mt-3">Need a hand? This portal focuses on event discovery, registrations, staffing, sponsorships, and participant support.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-xs font-bold uppercase text-neutral-500">Getting Started</h4>
            <p className="text-[13px] text-neutral-700 mt-2">Browse "Discover" to see events. Organizers can create events from "My Events".</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-neutral-500">Support</h4>
            <p className="text-[13px] text-neutral-700 mt-2">Contact: support@eventco.in
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-neutral-500">Feedback</h4>
            <p className="text-[13px] text-neutral-700 mt-2">Use the "My Tickets" view to leave feedback for events you attended.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

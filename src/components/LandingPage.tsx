import React from "react";
import { ArrowRight } from "lucide-react";

interface LandingPageProps {
  onEnterAuth: () => void;
}

export default function LandingPage({ onEnterAuth }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-amber-50 text-neutral-900 overflow-hidden">
      <div className="max-w-6xl w-full px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          {/* header badge removed as requested */}

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Plan, run and learn from events — all from one modern workspace
          </h1>

          <p className="text-neutral-600 max-w-xl">
            Role-aware access, volunteer coordination, sponsorships, ticketing and feedback — tailored for local organisers and teams. Designed with a clean, modern layout and subtle motion.
          </p>

          <div className="flex items-center gap-3">
            <button onClick={onEnterAuth} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-md font-semibold transition">
              Get started <ArrowRight className="w-4 h-4" />
            </button>
            <a href="#features" className="text-sm text-neutral-700 hover:underline">See features</a>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            <div className="p-4 rounded-2xl bg-white/90 shadow-sm border border-neutral-100">
              <div className="text-xs font-bold text-neutral-700">For Organisers</div>
              <div className="text-sm text-neutral-500">Plan events, manage staff & budgets</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 shadow-sm border border-neutral-100">
              <div className="text-xs font-bold text-neutral-700">For Sponsors</div>
              <div className="text-sm text-neutral-500">Sponsorship workflows and agreements</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 shadow-sm border border-neutral-100">
              <div className="text-xs font-bold text-neutral-700">For Volunteers</div>
              <div className="text-sm text-neutral-500">Skill matching and task assignments</div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full max-w-md p-10 rounded-3xl bg-white/95 border border-neutral-100 shadow-xl transform transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">Quick demo</div>
                <div className="text-xs text-neutral-500">Try a demo account or sign up</div>
              </div>
              <div className="text-emerald-600 font-bold">Free</div>
            </div>

            <div className="mt-6">
              <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                <div className="text-xs text-neutral-700 font-semibold">Discover events</div>
                <div className="text-sm text-neutral-500 mt-2">Browse and register in seconds</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3 bg-white border border-neutral-100 text-sm text-neutral-600">Volunteer sign-up</div>
                <div className="rounded-lg p-3 bg-white border border-neutral-100 text-sm text-neutral-600">Sponsor inquiry</div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-20 -top-20 opacity-30 animate-float">
            <div className="w-40 h-40 rounded-full bg-emerald-200/70 blur-3xl" />
          </div>
          <div className="pointer-events-none absolute -left-20 -bottom-24 opacity-30 animate-rotateSlow">
            <div className="w-56 h-56 rounded-full bg-amber-200/70 blur-3xl" />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes rotateSlow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .animate-rotateSlow { animation: rotateSlow 30s linear infinite; }
        .animate-pulse-slow { animation: pulse 2.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

import React, { useState } from "react";
import { AuthAccount, UserRole } from "../types";
import { CalendarDays, ShieldCheck, Users, BadgeCheck, ArrowRight } from "lucide-react";

interface AuthLandingPageProps {
  onLogin: (email: string, password: string) => { ok: boolean; message?: string };
  onSignup: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    company?: string;
    bio?: string;
  }) => { ok: boolean; message?: string };
  demoAccounts: AuthAccount[];
}

export default function AuthLandingPage({ onLogin, onSignup, demoAccounts }: AuthLandingPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState(demoAccounts[0]?.email || "");
  const [password, setPassword] = useState("admin123");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("participant");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  const roleMeta = {
    organizer: {
      title: "Organizer access",
      helper: "Use your team identity to manage events, staff, budgets, and approvals.",
      affiliationLabel: "Organization / Team",
      showIndustry: false,
      showSkills: false,
    },
    sponsor: {
      title: "Sponsor access",
      helper: "Add your company and industry so event matches and sponsorship workflows stay relevant.",
      affiliationLabel: "Company name",
      showIndustry: true,
      showSkills: false,
    },
    participant: {
      title: "Participant access",
      helper: "Share your institution or city so the app can personalize your experience.",
      affiliationLabel: "Institution / City",
      showIndustry: false,
      showSkills: false,
    },
    volunteer: {
      title: "Volunteer access",
      helper: "Add your skills so organizers can match you to the right tasks and roles.",
      affiliationLabel: "Volunteer group / college",
      showIndustry: false,
      showSkills: true,
    },
  }[role];

  React.useEffect(() => {
    setCompany("");
    setIndustry("");
    setSkillsInput("");
  }, [role]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onLogin(email, password);
    setMessage(result.message || (result.ok ? "Logged in" : ""));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onSignup({
      name,
      email,
      password,
      role,
      company: company || undefined,
      industry: industry || undefined,
      skills: skillsInput
        ? skillsInput.split(",").map((skill) => skill.trim()).filter(Boolean)
        : undefined,
      bio: bio || undefined,
    });
    setMessage(result.message || (result.ok ? "Account created" : ""));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_36%),linear-gradient(180deg,#f5f3eb_0%,#efece3_100%)] text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-4rem)]">
          <div className="space-y-8">


            <div className="space-y-4 max-w-xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]">
                One system for events, roles, and real operations.
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg">
                Manage discovery, registrations, volunteers, sponsors, budgets, tickets, and feedback from a single role-aware workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: CalendarDays, title: "Event flow", text: "Discover and open event details" },
                { icon: ShieldCheck, title: "Role access", text: "Users only see allowed pages" },
                { icon: Users, title: "Team ops", text: "Organizer, sponsor, participant, volunteer" },
              ].map((item) => (
                <div key={item.title} className="bg-white/85 backdrop-blur rounded-2xl border border-neutral-200 p-4 shadow-sm">
                  <item.icon className="w-5 h-5 text-emerald-600" />
                  <h3 className="mt-3 text-sm font-bold text-neutral-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/80 border border-neutral-200 rounded-2xl p-5 shadow-sm max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                Demo account hints
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600">
                {demoAccounts.slice(0, 4).map((account) => (
                  <div key={account.id} className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                    <div className="font-bold text-neutral-800">{account.role}</div>
                    <div className="mt-1 break-all">{account.email}</div>
                    <div className="text-neutral-400 mt-1">password: {account.password}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:justify-self-end w-full max-w-xl">
            <div className="bg-white/92 backdrop-blur-xl border border-neutral-200 rounded-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.12)] overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-neutral-100">
                <div className="flex gap-2 bg-neutral-100 p-1 rounded-2xl w-fit">
                  <button
                    onClick={() => setMode("login")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${mode === "login" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setMode("signup")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${mode === "signup" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {message && <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">{message}</div>}

                {mode === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Email</label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Password</label>
                      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                    </div>
                    <button type="submit" className="w-full rounded-xl bg-neutral-950 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-800 inline-flex items-center justify-center gap-2">
                      Enter workspace <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                      <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">{roleMeta.title}</div>
                      <p className="mt-1 text-xs text-neutral-600 leading-relaxed">{roleMeta.helper}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Full name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
                          <option value="participant">Participant</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="sponsor">Sponsor</option>
                          <option value="organizer">Organizer</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Email</label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">{roleMeta.affiliationLabel}</label>
                        <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                      </div>
                    </div>

                    {roleMeta.showIndustry && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Industry</label>
                        <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Technology, Education, Non-profit" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                      </div>
                    )}

                    {roleMeta.showSkills && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Skills</label>
                        <input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Communication, Logistics, Design" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Short bio</label>
                      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                    </div>
                    <button type="submit" className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 inline-flex items-center justify-center gap-2">
                      Create account <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { UserProfile, VolunteerApplication, Achievement } from "../types";
import { Award, CheckSquare, Sparkles, User, BadgeAlert, Plus, Trash, Globe, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface VolunteerModuleProps {
  currentUser: UserProfile;
  volunteerApps: VolunteerApplication[];
  onUpdateVolunteerProfile: (updatedProfile: Partial<UserProfile>) => void;
  onCheckoffTask: (appId: string, taskId: string, nextStatus: "todo" | "doing" | "done") => void;
}

export default function VolunteerModule({
  currentUser,
  volunteerApps,
  onUpdateVolunteerProfile,
  onCheckoffTask,
}: VolunteerModuleProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "tasks" | "leaderboard">("tasks");

  // Profile Edit fields
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [newSkill, setNewSkill] = useState("");

  const myApplications = volunteerApps.filter((app) => app.volunteerEmail === currentUser.email);
  const approvedApplications = myApplications.filter((app) => app.status === "approved");

  const topVolunteers = [
    { rank: 1, name: "Sam Rivera", score: 98, level: "Gold", eventsCount: 4, badge: "Master Logistician" },
    { rank: 2, name: currentUser.name, score: currentUser.performanceScore || 92, level: "Gold", eventsCount: approvedApplications.length + 1, badge: "Ecosystem Builder" },
    { rank: 3, name: "Lucas Mitchell", score: 87, level: "Silver", eventsCount: 2, badge: "Code Guide" },
    { rank: 4, name: "Zoe Patel", score: 82, level: "Silver", eventsCount: 1, badge: "Frontline Welcomer" },
    { rank: 5, name: "Ben Gallagher", score: 75, level: "Bronze", eventsCount: 1, badge: "Operations Rookie" }
  ].sort((a,b) => b.score - a.score);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateVolunteerProfile({ name, bio });
    setEditing(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill) return;
    const currentSkills = currentUser.skills || [];
    if (!currentSkills.includes(newSkill)) {
      onUpdateVolunteerProfile({ skills: [...currentSkills, newSkill] });
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = currentUser.skills || [];
    onUpdateVolunteerProfile({ skills: currentSkills.filter((s) => s !== skill) });
  };

  const handleTaskStateChange = (appId: string, taskId: string, currentStatus: string) => {
    let next: "doing" | "done" = "doing";
    if (currentStatus === "doing") {
      next = "done";
    }
    onCheckoffTask(appId, taskId, next);
  };

  return (
    <div id="volunteer-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-100 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Volunteer Workspace</h2>
          <p className="text-xs text-neutral-500">Track assigned tasks, update your profile, and manage event-day responsibilities.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Performance Index</span>
          <span className="text-2xl font-black text-emerald-990">{currentUser.performanceScore || 92}%</span>
        </div>
      </div>

      {/* Internal Navigation tabs */}
      <div className="flex gap-2 border-b border-neutral-100 mb-8 pb-1">
        {[
          { id: "tasks", label: "My Tasks", count: approvedApplications.reduce((acc, current) => acc + current.assignedTasks.filter((t) => t.status !== "done").length, 0) },
          { id: "profile", label: "Profile & Skills", count: null },
          { id: "leaderboard", label: "Recognition Board", count: null }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`vol-tab-${tab.id}`}
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

      {/* TASKS COMPONENT */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Active Tasks column */}
            <div className="bg-white p-6 border border-neutral-100 rounded-xl lg:col-span-2 shadow-xs space-y-6">
              <div>
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest block">Task Checklist</h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">Assigned by organizers for approved volunteer roles.</p>
              </div>

              {approvedApplications.length === 0 ? (
                <div className="text-center py-16 text-xs text-neutral-400 font-medium">
                    No approved volunteer roles yet. Visit "What's On" to find and apply to roles!
                </div>
              ) : (
                <div className="space-y-6">
                  {approvedApplications.map((app) => (
                    <div key={app.id} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-150">
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900">{app.eventTitle}</h4>
                          <span className="text-[10px] font-semibold text-emerald-800 uppercase block mt-0.5">Role: {app.roleName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400">{app.assignedTasks.filter((t) => t.status === "done").length} / {app.assignedTasks.length} tasks finished</span>
                      </div>

                      {app.assignedTasks.length === 0 ? (
                        <p className="text-xs text-neutral-400 py-4 text-center">Organizers haven't assigned tasks for this project yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {app.assignedTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-3 rounded-lg border flex justify-between items-center transition-all ${
                                task.status === "done" 
                                  ? "bg-emerald-50/20 border-emerald-100/50" 
                                  : "bg-white border-neutral-100"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${
                                  task.status === "done" ? "bg-emerald-500" :
                                  task.status === "doing" ? "bg-amber-400" : "bg-neutral-300"
                                }`} />
                                <span className={`text-xs ${
                                  task.status === "done" ? "line-through text-neutral-400" : "text-neutral-700 font-medium"
                                }`}>
                                  {task.name}
                                </span>
                              </div>

                              <button
                                onClick={() => handleTaskStateChange(app.id, task.id, task.status)}
                                disabled={task.status === "done"}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                                  task.status === "done"
                                    ? "bg-emerald-50 text-emerald-700 hover:none"
                                    : task.status === "doing"
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                                }`}
                              >
                                {task.status === "done" && "Done ✓"}
                                {task.status === "doing" && "Finish Task →"}
                                {task.status === "todo" && "Start Task"}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar highlights applications overview */}
            <div className="space-y-6">
              {/* Profile Bio summary */}
              <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-150 space-y-4">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">Application Status</span>
                {myApplications.length === 0 ? (
                  <p className="text-xs text-neutral-400 leading-normal">
                    You have not applied for any roles yet. Visit the event listings to explore available roles.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {myApplications.map((app) => (
                      <div key={app.id} className="p-3 bg-white rounded-lg border border-neutral-100 text-xs">
                        <div className="flex justify-between font-bold text-neutral-800">
                          <span className="line-clamp-1 w-2/3">{app.eventTitle}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            app.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                            app.status === "rejected" ? "bg-red-100 text-red-800" : "bg-neutral-100 text-neutral-500"
                          }`}>{app.status}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1 uppercase">Position: {app.roleName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Badge Certificate preview widget */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 text-emerald-900 space-y-3">
                <span className="font-bold flex items-center gap-1 text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-750" />
                  Recognition Milestones
                </span>
                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  Every completed task contributes to your recognition score.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PROFILE SETUP TAB */}
      {activeTab === "profile" && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white p-6 sm:p-8 border border-neutral-100 rounded-xl shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-50 pb-4">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest block">Volunteer Profile</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded text-xs font-semibold cursor-pointer"
              >
                {editing ? "Cancel Editing" : "Edit Details"}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Your Display Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Short Bio</label>
                  <textarea
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  Save Profile Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="bg-neutral-100 p-3 rounded-full border border-neutral-200">
                    <User className="w-8 h-8 text-neutral-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-800">{currentUser.name}</h4>
                    <p className="text-xs text-neutral-400">{currentUser.email}</p>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Bio Summary</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">{currentUser.bio}</p>
                </div>
              </div>
            )}

            {/* Interactive Skill tag adding/removals */}
            <div className="pt-6 border-t border-neutral-100">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">Add Skill Tags</span>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {(currentUser.skills || []).map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs text-emerald-800 flex items-center gap-1.5 font-bold">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-emerald-500 hover:text-emerald-800 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  required
                  placeholder="e.g. Communication, Logistics, Copywriting"
                  className="flex-1 px-3 py-1.5 border border-neutral-200 rounded-lg text-xs"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-900 border border-neutral-950 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Add Skill
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD & AWARDS TAB */}
      {activeTab === "leaderboard" && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Rank List */}
          <div className="bg-white p-6 border border-neutral-100 rounded-xl shadow-xs">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest block mb-4">
              Recognition Ranks
            </h3>

            <div className="space-y-2">
              {topVolunteers.map((vol, idx) => (
                <div key={vol.name} className={`p-3.5 rounded-xl border flex justify-between items-center ${
                  vol.name === currentUser.name ? "bg-emerald-50/30 border-emerald-200" : "bg-neutral-50/50 border-neutral-100"
                }`}>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-xs text-neutral-400 w-5">#{idx + 1}</span>
                    <div>
                      <strong className="text-xs text-neutral-800">{vol.name} {vol.name === currentUser.name && "(You)"}</strong>
                      <span className="text-[9px] text-neutral-400 block tracking-wide uppercase mt-0.5">{vol.badge}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-neutral-500">{vol.eventsCount} events</span>
                    <span className="text-emerald-800 font-mono">{vol.score}% Score</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Volunteer recognition badge showcase */}
          <div className="bg-emerald-550/5 border border-emerald-100 rounded-xl p-6">
            <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-widest block mb-4 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-emerald-600" />
              Volunteer Milestones
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-emerald-100 flex gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg self-start">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">Reliable Event Supporter</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Assigned to volunteers supporting event-day operations.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-emerald-100 flex gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg self-start">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-800 font-semibold text-neutral-700">All-Star Logistics Liaison</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Successfully coordinates registration lists and event check-ins.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

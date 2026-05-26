import React, { useState } from "react";
import { UserProfile } from "../types";

interface Props {
  user: UserProfile;
  onClose: () => void;
  onSave: (fields: Partial<UserProfile>) => void;
}

export default function ProfileSettingsModal({ user, onClose, onSave }: Props) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState(user.bio || "");

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 border border-neutral-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Profile Settings</h3>
          <button onClick={onClose} className="text-neutral-500">×</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1">Display Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-3 py-1 text-xs border rounded">Cancel</button>
            <button
              onClick={() => {
                onSave({ name, email, bio });
                onClose();
              }}
              className="px-3 py-1 text-xs bg-emerald-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../lib/auth";

function Toggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <button onClick={() => set(!on)} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: on ? "var(--accent-violet)" : "rgba(124,58,237,0.15)", boxShadow: on ? "0 0 16px var(--glow-violet)" : "none" }}>
      <motion.span layout className="absolute top-0.5 w-5 h-5 bg-white rounded-full" style={{ left: on ? "calc(100% - 22px)" : "2px" }} />
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(8,8,18,0.6)",
  border: "1px solid var(--border-glass)",
  color: "var(--text-primary)",
};

export function SettingsView() {
  const [emailNotif, setEmail] = useState(true);
  const [pushNotif, setPush] = useState(false);
  const { user } = useAuth();

  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className="font-syne font-bold text-2xl" style={{ color: "var(--text-primary)" }}>Settings</h2>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-syne font-semibold" style={{ color: "var(--text-primary)" }}>Your Info</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Name</span>
            <input key={user?.uid || "name"} defaultValue={user?.displayName || "Luxe Co."} className="mt-1.5 w-full px-3 py-2 rounded-lg font-dm text-sm outline-none focus:border-violet-400" style={inputStyle} />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Email</span>
            <input key={user?.uid || "email"} defaultValue={user?.email || "hello@luxe.co"} className="mt-1.5 w-full px-3 py-2 rounded-lg font-dm text-sm outline-none focus:border-violet-400" style={inputStyle} />
          </label>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-syne font-semibold" style={{ color: "var(--text-primary)" }}>Notifications</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-dm text-sm" style={{ color: "var(--text-primary)" }}>Email updates</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Project milestones and replies</div>
          </div>
          <Toggle on={emailNotif} set={setEmail} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-dm text-sm" style={{ color: "var(--text-primary)" }}>Push notifications</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Real-time alerts in your browser</div>
          </div>
          <Toggle on={pushNotif} set={setPush} />
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-syne font-semibold" style={{ color: "var(--text-primary)" }}>Password</h3>
        <input type="password" placeholder="Current password" className="w-full px-3 py-2 rounded-lg font-dm text-sm outline-none focus:border-violet-400" style={inputStyle} />
        <input type="password" placeholder="New password" className="w-full px-3 py-2 rounded-lg font-dm text-sm outline-none focus:border-violet-400" style={inputStyle} />
      </div>

      <button className="w-full sm:w-auto px-6 py-2.5 rounded-full font-syne font-semibold text-sm text-white transition-all hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 24px var(--glow-violet)" }}>
        Save Changes
      </button>
    </div>
  );
}
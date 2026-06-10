import { motion } from "framer-motion";
import { Home, FolderKanban, MessageSquare, FileText, Settings, LogOut } from "lucide-react";
import type { Section } from "./types";
import { useAuth } from "../../lib/auth";

const items: { id: Section; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: number }[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "project", label: "My Project", icon: FolderKanban },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 2 },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ active, onChange }: { active: Section; onChange: (s: Section) => void }) {
  const { user, logout } = useAuth();
  
  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] flex-col z-30 glass-strong border-r" style={{ borderColor: "var(--border-glass)" }}>
      <div className="px-6 pt-7 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-syne font-bold text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #3b5bdb)", boxShadow: "0 0 20px var(--glow-violet)" }}>
            W
          </div>
          <span className="font-syne font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
            Webzi<span style={{ color: "var(--accent-violet)" }}>n</span>go
          </span>
        </div>
      </div>
      <div className="mx-6 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--border-bright), transparent)" }} />

      <nav className="flex-1 px-3 py-5 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className="relative w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 group transition-colors"
              style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.25), rgba(59,91,219,0.15))", border: "1px solid var(--border-bright)", boxShadow: "0 0 18px var(--glow-violet)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3 w-full">
                <Icon size={18} className={isActive ? "" : "group-hover:text-violet-300 transition-colors"} />
                <span className="font-syne text-sm font-medium flex-1">{it.label}</span>
                {it.badge ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "var(--accent-violet)", boxShadow: "0 0 10px var(--glow-violet)" }}>
                    {it.badge}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 pb-5 pt-3 border-t" style={{ borderColor: "var(--border-glass)" }}>
        <div className="flex items-center gap-3 mb-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user?.displayName || "User"} className="w-9 h-9 rounded-full object-cover border border-white/10" />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-syne font-semibold text-sm" style={{ background: "linear-gradient(135deg, #3b5bdb, #7c3aed)", color: "white" }}>
              {userInitials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-syne text-sm truncate" style={{ color: "var(--text-primary)" }}>{user?.displayName || "Client"}</div>
            <div className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>{user?.email || "Client Portal"}</div>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="flex items-center gap-2 text-xs font-dm transition-colors hover:opacity-100 cursor-pointer" 
          style={{ color: "var(--accent-rose)", opacity: 0.7 }}
        >
          <LogOut size={13} /> Logout
        </button>
        <div className="mt-3 text-[10px]" style={{ color: "var(--text-muted)" }}>v2.1 · Webzingo Portal</div>
      </div>
    </aside>
  );
}

export function MobileTabBar({ active, onChange }: { active: Section; onChange: (s: Section) => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 glass-strong border-t flex justify-around py-2" style={{ borderColor: "var(--border-glass)" }}>
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = active === it.id;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} className="flex flex-col items-center gap-1 px-3 py-1 relative" style={{ color: isActive ? "var(--accent-violet)" : "var(--text-muted)" }}>
            <Icon size={20} />
            <span className="text-[10px] font-syne">{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
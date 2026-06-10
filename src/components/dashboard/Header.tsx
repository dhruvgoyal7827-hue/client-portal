import { HelpCircle, Bell } from "lucide-react";
import type { Section } from "./types";
import { useAuth } from "../../lib/auth";

const titles: Record<Section, string> = {
  overview: "Overview",
  project: "My Project",
  messages: "Messages",
  documents: "Documents",
  settings: "Settings",
};

export function Header({ active }: { active: Section }) {
  const { user } = useAuth();

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-20 glass-strong border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: "var(--border-glass)" }}>
      <h1 className="font-syne font-bold text-xl" style={{ color: "var(--text-primary)" }}>
        {titles[active]}
      </h1>
      <div className="flex items-center gap-3">
        <button className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-dm transition-all hover:border-violet-400" style={{ color: "var(--text-muted)", border: "1px solid var(--border-glass)" }}>
          <HelpCircle size={13} /> Need Help?
        </button>
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/5" style={{ color: "var(--text-muted)" }}>
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: "var(--accent-violet)", boxShadow: "0 0 8px var(--glow-violet)" }} />
        </button>
        
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user?.displayName || "User"} 
            className="w-9 h-9 rounded-full object-cover border border-white/10 cursor-pointer" 
          />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-syne font-semibold text-xs cursor-pointer" style={{ background: "linear-gradient(135deg, #3b5bdb, #7c3aed)", color: "white" }}>
            {userInitials}
          </div>
        )}
      </div>
    </header>
  );
}
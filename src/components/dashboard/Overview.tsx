import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, Clock, RefreshCw, Folder, Check } from "lucide-react";
import { getProjects } from "../../lib/api";
import { Project } from "../../lib/types";
import { useClientId } from "../../hooks/use-client-id";
import { toast } from "sonner";
import ProjectTimeline from "./ProjectTimeline";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString() + suffix);
  const [display, setDisplay] = useState("0" + suffix);
  useEffect(() => {
    const controls = animate(mv, to, { duration: 1.2, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [to]);
  return <span>{display}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const } }),
};

const getStatusBadge = (status: string) => {
  const normalized = (status || "").toLowerCase();
  switch (normalized) {
    case "in progress":
    case "development":
      return {
        bg: "rgba(124,58,237,0.2)",
        border: "var(--border-bright)",
        color: "#ddd6fe",
        dot: "var(--accent-violet)",
        label: "In Progress"
      };
    case "completed":
    case "done":
    case "launch":
      return {
        bg: "rgba(52,211,153,0.2)",
        border: "rgba(52,211,153,0.4)",
        color: "#a7f3d0",
        dot: "#34d399",
        label: "Completed"
      };
    case "discovery":
    case "planning":
      return {
        bg: "rgba(96,165,250,0.2)",
        border: "rgba(96,165,250,0.4)",
        color: "#bfdbfe",
        dot: "#60a5fa",
        label: "Discovery"
      };
    case "design":
      return {
        bg: "rgba(245,158,11,0.2)",
        border: "rgba(245,158,11,0.4)",
        color: "#fde68a",
        dot: "#f59e0b",
        label: "Design"
      };
    default:
      return {
        bg: "rgba(156,163,175,0.2)",
        border: "rgba(156,163,175,0.4)",
        color: "#e5e7eb",
        dot: "#9ca3af",
        label: status || "Unknown"
      };
  }
};

export function Overview() {
  const { clientMongoId, clientLoading, clientNotFound } = useClientId();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [lastFetched, setLastFetched] = useState<Date>(new Date());

  async function loadData(showLoader = false) {
    if (!clientMongoId) return;
    if (showLoader) setIsRefreshing(true);
    try {
      const clientProjects = await getProjects(clientMongoId);
      setProjects(clientProjects);
      setLastFetched(new Date());
      if (clientProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(clientProjects[0]._id || clientProjects[0].id);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to refresh project data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    if (clientLoading || !clientMongoId) return;
    loadData();
    const interval = setInterval(() => loadData(), 30000);
    return () => { clearInterval(interval); };
  }, [clientMongoId, clientLoading]);

  // Still resolving Firebase user → MongoDB ID
  if (clientLoading || (loading && projects.length === 0)) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="rounded-2xl glass p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 bg-white/5">
          <div className="space-y-3 flex-1">
            <div className="h-3 w-20 bg-white/10 rounded" />
            <div className="h-6 w-1/2 bg-white/10 rounded" />
            <div className="h-4 w-1/3 bg-white/10 rounded" />
          </div>
          <div className="h-10 w-28 bg-white/10 rounded-full self-start md:self-auto" />
        </div>
        <div className="glass rounded-2xl p-6 h-20 bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5 h-32 bg-white/5" />
          <div className="glass rounded-2xl p-5 h-32 bg-white/5" />
          <div className="glass rounded-2xl p-5 h-32 bg-white/5" />
        </div>
      </div>
    );
  }

  // Backend returned 404 — client account not yet provisioned in MongoDB
  if (clientNotFound) {
    return (
      <div className="glass rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--accent-violet) var(--accent-violet) transparent transparent" }} />
        <h3 className="font-syne font-semibold text-lg text-white">Setting up your account...</h3>
        <p className="font-dm text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>
          We're preparing your client portal. This usually takes just a moment. Please check back shortly.
        </p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
        <Folder className="w-12 h-12 text-violet-400 opacity-60" />
        <h3 className="font-syne font-semibold text-lg text-white">No projects yet</h3>
        <p className="font-dm text-sm text-[var(--text-muted)] max-w-sm">
          Your project details will appear here once the agency sets up your project.
        </p>
      </div>
    );
  }

  const project = projects.find(p => (p._id || p.id) === selectedProjectId) || projects[0];
  const badge = getStatusBadge(project.status);

  const daysVal = project.daysRemaining !== undefined ? project.daysRemaining : 8;
  const daysSub = project.endDate ? `Est. delivery ${project.endDate}` : "Est. delivery June 14";

  const revValue = project.revisionsUsed !== undefined ? `${project.revisionsUsed} / ${project.totalRevisions || 3}` : "2 / 3";
  const revProgress = project.totalRevisions ? (project.revisionsUsed || 0) / project.totalRevisions : 0.66;

  const filesVal = project.filesShared !== undefined ? project.filesShared : 7;
  const filesSub = project.pendingFilesReview !== undefined ? `${project.pendingFilesReview} pending review` : "3 pending review";

  const secondsAgo = Math.floor((Date.now() - lastFetched.getTime()) / 1000);
  const relativeTime = secondsAgo < 60 ? `${secondsAgo}s ago` : secondsAgo < 3600 ? `${Math.floor(secondsAgo/60)}m ago` : lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      {/* HERO */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="show" custom={0}
        className="conic-border rounded-2xl glass p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: "var(--text-muted)" }}>Your Project</div>
          {projects.length > 1 ? (
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="font-syne font-bold text-[22px] md:text-[26px] leading-tight bg-transparent text-white border-0 outline-none cursor-pointer hover:text-violet-300 transition-colors mr-2 py-1"
              style={{ color: "var(--text-primary)" }}
            >
              {projects.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id} className="bg-[#04040c] text-white text-base">
                  {p.name || "Unnamed Project"}
                </option>
              ))}
            </select>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              <h2 className="font-syne font-bold text-[26px] leading-tight" style={{ color: "var(--text-primary)" }}>{project.name || "Brand Website — Luxe Co."}</h2>
              {project.description && (<p className="text-sm text-[var(--text-muted)]">{project.description}</p>)}
              <div className="text-xs text-[var(--text-muted)]">Assigned {project.startDate ? new Date(project.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}</div>
              <div className="flex items-center gap-1.5 text-xs font-dm" style={{ color: "var(--text-muted)" }}>
                <Calendar size={12} /> {project.startDate || "May 28"} → {project.endDate || "Jun 14, 2026"}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start md:items-end gap-2 relative">
          <div className="pulse-glow inline-flex items-center gap-2 px-4 py-2 rounded-full font-syne font-semibold text-sm" style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: badge.dot }} />
            {badge.label}
          </div>
          <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
            <span>Updated {relativeTime}</span>
            <button onClick={() => loadData(true)} className={`${isRefreshing ? "animate-spin" : ""} text-muted hover:text-violet-400 transition-colors`} aria-label="Refresh data">
              <RefreshCw size={12} />
            </button>
          </div>
        </div>
      </motion.div>

      <ProjectTimeline status={project.status} />

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Clock, color: "#a78bfa", label: "Days Remaining", value: daysVal, sub: daysSub },
          { icon: RefreshCw, color: "#60a5fa", label: "Revisions Used", value: revValue, sub: null, progress: revProgress },
          { icon: Folder, color: "#34d399", label: "Files Shared", value: filesVal, sub: filesSub },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              variants={fadeUp} initial="hidden" animate="show" custom={2 + i}
              whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(124,58,237,0.25)" }}
              transition={{ duration: 0.2 }}
              className="glass rounded-2xl p-5"
              style={{ border: "1px solid var(--border-glass)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: c.color + "20", color: c.color }}>
                  <Icon size={17} />
                </div>
              </div>
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{c.label}</div>
              <div className="font-syne font-bold text-[32px] leading-none" style={{ color: "var(--text-primary)" }}>
                {typeof c.value === "number" ? <Counter to={c.value} /> : c.value}
              </div>
              {c.progress !== undefined && (
                <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(124,58,237,0.15)" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.progress * 100}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full" style={{ background: "linear-gradient(90deg, var(--accent-violet), var(--accent-blue))" }} />
                </div>
              )}
              {c.sub && <div className="mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>{c.sub}</div>}
            </motion.div>
          );
        })}
      </div>

      {/* DETAILS */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-syne font-semibold text-lg" style={{ color: "var(--text-primary)" }}>Project Details</h3>
          <button className="text-xs px-3 py-1.5 rounded-full font-dm transition-colors hover:bg-violet-500/10" style={{ color: "var(--text-muted)", border: "1px solid var(--border-glass)" }}>
            Request Change
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {[
            ["Package", project.package || "Business Pro"],
            ["Pages", project.pages || "5 Pages"],
            ["Add-ons", (project.addOns && project.addOns.length > 0) ? project.addOns.join(", ") : "WhatsApp Chat, SEO Setup"],
            ["Payment", `${project.paymentAmount || "₹5,999"} · ${project.paymentStatus || "Paid"}`],
            ["Tech Stack", project.techStack || "React + Vercel"],
            ["Domain", project.domain || "Client-provided"],
          ].map(([k, v], i) => (
            <div key={k} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--border-glass)" }}>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{k}</span>
              <span className="font-dm text-sm flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
                {v}
                {k === "Payment" && v.toLowerCase().includes("paid") && <Check size={14} style={{ color: "var(--accent-emerald)" }} />}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <a href="#" className="text-sm font-dm transition-colors hover:underline" style={{ color: "var(--accent-violet)" }}>View Full Brief →</a>
        </div>
      </motion.div>
    </div>
  );
}
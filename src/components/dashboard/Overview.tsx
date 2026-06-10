import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, Clock, RefreshCw, Folder, Check } from "lucide-react";

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

export function Overview() {
  return (
    <div className="space-y-6">
      {/* HERO */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="show" custom={0}
        className="conic-border rounded-2xl glass p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: "var(--text-muted)" }}>Your Project</div>
          <h2 className="font-syne font-bold text-[26px] leading-tight" style={{ color: "var(--text-primary)" }}>
            Brand Website — Luxe Co.
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-[11px] px-2.5 py-1 rounded-full font-dm font-medium" style={{ background: "rgba(124,58,237,0.15)", color: "#c4b5fd", border: "1px solid var(--border-bright)" }}>
              Business Pro Package
            </span>
            <div className="flex items-center gap-1.5 text-xs font-dm" style={{ color: "var(--text-muted)" }}>
              <Calendar size={12} /> May 28 → Jun 14, 2026
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="pulse-glow inline-flex items-center gap-2 px-4 py-2 rounded-full font-syne font-semibold text-sm" style={{ background: "rgba(124,58,237,0.2)", border: "1px solid var(--border-bright)", color: "#ddd6fe" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-violet)" }} />
            In Progress
          </div>
          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Last updated 2 hours ago</div>
        </div>
      </motion.div>

      {/* TIMELINE */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between overflow-x-auto">
          {[
            { label: "Discovery", state: "done" },
            { label: "Design", state: "done" },
            { label: "Development", state: "current" },
            { label: "Launch", state: "pending" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center flex-1 min-w-[120px]">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {step.state === "current" && (
                    <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "var(--accent-violet)", opacity: 0.4 }} />
                  )}
                  <div className="relative w-4 h-4 rounded-full" style={{
                    background: step.state === "pending" ? "transparent" : "var(--accent-violet)",
                    border: "2px solid " + (step.state === "pending" ? "var(--text-muted)" : "var(--accent-violet)"),
                    boxShadow: step.state !== "pending" ? "0 0 12px var(--glow-violet)" : "none",
                  }} />
                </div>
                <div className="font-syne text-xs" style={{ color: step.state === "pending" ? "var(--text-muted)" : "var(--text-primary)" }}>
                  {step.label}
                </div>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {step.state === "done" ? "Done" : step.state === "current" ? "In Progress" : "Pending"}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="flex-1 h-px mx-3" style={{
                  background: arr[i + 1].state === "pending"
                    ? "repeating-linear-gradient(90deg, var(--text-muted) 0 4px, transparent 4px 8px)"
                    : "linear-gradient(90deg, var(--accent-violet), var(--accent-blue))",
                  boxShadow: arr[i + 1].state !== "pending" ? "0 0 8px var(--glow-violet)" : "none",
                }} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Clock, color: "#a78bfa", label: "Days Remaining", value: 8, sub: "Est. delivery June 14" },
          { icon: RefreshCw, color: "#60a5fa", label: "Revisions Used", value: "2 / 3", sub: null, progress: 0.66 },
          { icon: Folder, color: "#34d399", label: "Files Shared", value: 7, sub: "3 pending review" },
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
            ["Package", "Business Pro"],
            ["Pages", "5 Pages"],
            ["Add-ons", "WhatsApp Chat, SEO Setup"],
            ["Payment", "₹5,999 · Paid"],
            ["Tech Stack", "React + Vercel"],
            ["Domain", "Client-provided"],
          ].map(([k, v], i) => (
            <div key={k} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--border-glass)" }}>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{k}</span>
              <span className="font-dm text-sm flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
                {v}
                {k === "Payment" && <Check size={14} style={{ color: "var(--accent-emerald)" }} />}
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
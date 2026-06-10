import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, Archive, Download, Upload } from "lucide-react";

const files = [
  { name: "Brand-Guidelines-v2.pdf", date: "May 24, 2026", size: "2.4 MB", type: "pdf" as const },
  { name: "Homepage-Mockup-v1.png", date: "May 26, 2026", size: "1.8 MB", type: "img" as const },
  { name: "Logo-Pack.zip", date: "May 22, 2026", size: "8.1 MB", type: "zip" as const },
  { name: "Wireframes.pdf", date: "May 20, 2026", size: "3.2 MB", type: "pdf" as const },
  { name: "Hero-Section.png", date: "May 28, 2026", size: "920 KB", type: "img" as const },
];

const meta = {
  pdf: { icon: FileText, color: "#f43f5e", bg: "rgba(244,63,94,0.15)" },
  img: { icon: ImageIcon, color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  zip: { icon: Archive, color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
};

export function Documents() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-syne font-bold text-2xl" style={{ color: "var(--text-primary)" }}>Shared Documents</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full font-syne text-sm transition-all hover:bg-violet-500/10" style={{ color: "var(--text-primary)", border: "1px solid var(--border-bright)" }}>
          <Upload size={14} /> Upload File
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {files.map((f, i) => {
          const m = meta[f.type];
          const Icon = m.icon;
          return (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-5 py-4 group transition-colors hover:bg-violet-500/5 border-b last:border-0"
              style={{ borderColor: "var(--border-glass)" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: m.bg, color: m.color }}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-dm text-sm truncate" style={{ color: "var(--text-primary)" }}>{f.name}</div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Uploaded {f.date}</div>
              </div>
              <div className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>{f.size}</div>
              <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-violet-500/20" style={{ color: "var(--text-muted)" }}>
                <Download size={16} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}